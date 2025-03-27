import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../app/config/firebaseConfig";  // Import konfigurasi Firebase
import bcrypt from "bcryptjs"; // Untuk enkripsi password (pastikan install `bcryptjs`)

const db = getFirestore(app);

export const login = async (email: string, password: string) => {
    try {
        // 1️⃣ Cari user berdasarkan email di Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("User tidak ditemukan");
        }

        // 2️⃣ Ambil data user pertama (seharusnya unik)
        const userDoc = querySnapshot.docs[0];
        const userData: any = userDoc.data();

        // 3️⃣ Cek apakah password cocok (gunakan bcrypt untuk verifikasi)
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            throw new Error("Password salah");
        }

        // 4️⃣ Jika sukses, return data user (kamu bisa generate JWT di sini jika perlu)
        return {
            id: userDoc.id,
            message: "Login successful",
            totalAverageWeightRatings: userData.totalAverageWeightRatings || "",
            role: userData.role || "",
            password: userData.password || "",
            name: userData.name || "",
            potentialScore: userData.potentialScore || "",
            email: userData.email || "",
            recentlyActive: userData.recentlyActive || { seconds: "0", nanoseconds: "0" },
            numberOfRents: userData.numberOfRents || "",
            age: userData.age || "",
          };
    } catch (error: any) {
        throw new Error(error.message);
    }
};
