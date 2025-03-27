import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit as firestoreLimit, startAfter, DocumentSnapshot, serverTimestamp, QueryDocumentSnapshot } from "firebase/firestore";
import firebaseApp from "../config/firebase-config"

const db = getFirestore(firebaseApp);
const usersCollection = collection(db, "users");

export class UserRepository {
    // Create User
    static async createUser(data: any) {
        try {
            // Menghitung potentialScore saat membuat user baru
            const potentialScore = this.calculatePotentialScore({
                totalAverageWeightRatings: data.totalAverageWeightRatings || 0,
                numberOfRents: data.numberOfRents || 0,
                recentlyActive: Date.now()
            });

            // Tambahkan potentialScore dan recentlyActive ke data
            const userData = {
                ...data,
                potentialScore,
                recentlyActive: serverTimestamp()
            };

            const docRef = await addDoc(usersCollection, userData);
            return { id: docRef.id, ...userData };
        } catch (error: any) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    // Read Users
    static async getUsers() {
        try {
            const querySnapshot = await getDocs(usersCollection);
            const users = querySnapshot.docs.map(doc => {
                const userData = doc.data();
                // Remove sensitive data
                const { password, ...safeUserData } = userData;
                return { id: doc.id, ...safeUserData };
            });
            // return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return users
        } catch (error: any) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }

    // Get Potential Users with Pagination
    static async getPotentialUsers(limit: number = 10, lastDoc?: DocumentSnapshot) {
        try {
            let q;

            if (lastDoc) {
                // Untuk halaman berikutnya (dengan pagination)
                q = query(
                    usersCollection,
                    orderBy("potentialScore", "desc"),
                    startAfter(lastDoc),
                    firestoreLimit(limit)
                );
            } else {
                // Untuk halaman pertama
                q = query(
                    usersCollection,
                    orderBy("potentialScore", "desc"),
                    firestoreLimit(limit)
                );
            }

            const querySnapshot = await getDocs(q);
            // const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // // Mengembalikan data pengguna dan lastDoc untuk pagination berikutnya
            // return {
            //     users,
            //     lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
            // };
            const users = querySnapshot.docs.map(doc => {
                const userData = doc.data();
                // Remove sensitive data
                const { password, ...safeUserData } = userData;
                return { id: doc.id, ...safeUserData };
            });

            // Just return the lastDocId rather than the entire document
            return {
                users,
                pagination: {
                    lastDocId: querySnapshot.docs.length > 0 ?
                        querySnapshot.docs[querySnapshot.docs.length - 1].id : null,
                    hasMore: querySnapshot.docs.length === limit
                }
            };
        } catch (error: any) {
            throw new Error(`Error fetching potential users: ${error.message}`);
        }
    }

    // Update User
    static async updateUser(id: string, data: any) {
        try {
            const userRef = doc(db, "users", id);

            // Jika ada update untuk field yang mempengaruhi potentialScore, hitung ulang
            if (data.totalAverageWeightRatings !== undefined ||
                data.numberOfRents !== undefined) {

                // Ambil data user yang ada
                const userDoc = await getDocs(query(usersCollection, where("__name__", "==", id)));
                const userData = userDoc.docs[0].data();

                // Gabungkan data lama dengan yang baru untuk menghitung potentialScore
                const newUserData = {
                    totalAverageWeightRatings: data.totalAverageWeightRatings ?? userData.totalAverageWeightRatings ?? 0,
                    numberOfRents: data.numberOfRents ?? userData.numberOfRents ?? 0,
                    recentlyActive: userData.recentlyActive?.toMillis() ?? Date.now()
                };

                // Hitung potentialScore baru
                data.potentialScore = this.calculatePotentialScore(newUserData);
            }

            await updateDoc(userRef, data);
            return { id, ...data };
        } catch (error: any) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    // Update User Activity
    static async updateUserActivity(id: string) {
        try {
            const userRef = doc(db, "users", id);

            // Ambil data user untuk menghitung ulang potentialScore
            const userDoc = await getDocs(query(usersCollection, where("__name__", "==", id)));
            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();

                // Menghitung potentialScore baru dengan waktu aktivitas terbaru
                const potentialScore = this.calculatePotentialScore({
                    totalAverageWeightRatings: userData.totalAverageWeightRatings || 0,
                    numberOfRents: userData.numberOfRents || 0,
                    recentlyActive: Date.now()
                });

                // Buat objek update dengan kedua field yang perlu diperbarui
                const activityUpdate = {
                    recentlyActive: serverTimestamp(),
                    potentialScore: potentialScore
                };

                await updateDoc(userRef, activityUpdate);
                return { id, updated: true };
            } else {
                throw new Error("User not found");
            }
        } catch (error: any) {
            throw new Error(`Error updating user activity: ${error.message}`);
        }
    }

    // Delete User
    static async deleteUser(id: string) {
        try {
            const userRef = doc(db, "users", id);
            await deleteDoc(userRef);
            return { message: "User deleted successfully" };
        } catch (error: any) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    // Helper function to calculate potentialScore
    private static calculatePotentialScore(user: {
        totalAverageWeightRatings: number;
        numberOfRents: number;
        recentlyActive: number;
    }) {
        // Bobot untuk setiap faktor
        const weightRatingWeight = 10000;  // Prioritas tertinggi
        const rentsWeight = 100;           // Prioritas kedua
        const activityWeight = 1;          // Prioritas ketiga

        // Normalisasi nilai aktivitas terkini (mengubah timestamp menjadi nilai 0-1)
        // Asumsikan aktivitas dalam 30 hari terakhir
        const now = Date.now();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const activityScore = Math.max(0, Math.min(1, (now - user.recentlyActive) / thirtyDaysInMs));

        // Hitung skor komposit
        return (user.totalAverageWeightRatings * weightRatingWeight) +
            (user.numberOfRents * rentsWeight) +
            ((1 - activityScore) * activityWeight); // Semakin baru, semakin tinggi nilainya
    }

    static async checkEmail(email: string) {
        return query(usersCollection, where("email", "==", email));
    }

    static async potentialUser(lastDocId: string) {
        return query(collection(getFirestore(firebaseApp), "users"), where("__name__", "==", lastDocId))
    }
}