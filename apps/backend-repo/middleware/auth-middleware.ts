import { Request, Response, NextFunction } from "express";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import admin from "firebase-admin";
import firebaseApp from "../config/firebase-config";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// Inisialisasi Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), // Atau gunakan private key
    });
}

const auth = admin.auth(); // Gunakan Firebase Admin untuk autentikasi
const db = getFirestore(firebaseApp);

// Middleware untuk memeriksa apakah user memiliki token yang valid
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY!);
        console.log('payload :', payload)
        req.user = payload; // Properti user sekarang diakui
        next(); // Lanjutkan ke middleware berikutnya
    } catch (error: any) {
        res.status(403).json({ message: "Unauthorized: Invalid token", error: error.message });
    }
};

// Middleware untuk memeriksa apakah user adalah admin
export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user.uid) {
            res.status(403).json({ message: "Forbidden: No user data" });
            return
        }

        const userRef = doc(db, "users", req.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || userSnap.data().role !== "admin") {
            res.status(403).json({ message: "Forbidden: You are not an admin" });
            return
        }

        next();
    } catch (error: any) {
        res.status(500).json({ message: "Error checking user role", error: error.message });
    }
};
