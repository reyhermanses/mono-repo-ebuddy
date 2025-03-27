import { Request, Response } from "express";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import firebaseApp from "../config/firebase-config";
import { UserRepository } from "../repository/user-repository";

const db = getFirestore(firebaseApp);
const usersCollection = collection(db, "users");

export class AuthController {
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            // Validasi input
            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required" });
                return
            }

            // Cari user berdasarkan email di Firestore
            const q = await UserRepository.checkEmail(email)
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                res.status(401).json({ message: "Invalid email or password" });
                return
            }

            // Ambil data user pertama yang ditemukan
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            // Cek password
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (!passwordMatch) {
                res.status(401).json({ message: "Invalid email or password" });
                return
            }

            const payload = {
                uid: userDoc.id,
                email: userData.email,
                name: userData.name,
                role: userData.role
            }

            // Generate JWT token
            const token = jwt.sign(
                payload,
                process.env.SECRET_KEY || "default_secret", // Pastikan `JWT_SECRET` ada di env
                { expiresIn: "1h" }
            );

            // Update recentlyActive dan potentialScore
            await UserRepository.updateUserActivity(userDoc.id);

            // Kirim response
            res.status(200).json({
                message: "Login successful",
                token,
                user: { uid: userDoc.id, email: userData.email, name: userData.name, role: userData.role },
            });
        } catch (error: any) {
            console.error("Login Error:", error);
            res.status(500).json({ message: "Login failed", error: error.message });
        }
    }
}