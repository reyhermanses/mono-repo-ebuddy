import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { UserRepository } from "../repository/user-repository";
import { getDocs } from "firebase/firestore";
import { User } from "@monorepo/shared/src/user";

export class UserController {
    // Create User
    static async createUser(req: Request, res: Response) {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 12);
            const user: User[] = await UserRepository.createUser(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get All Users
    static async getUsers(req: Request, res: Response) {
        try {
            const users = await UserRepository.getUsers();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get Potential Users with Pagination
    static async getPotentialUsers(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const lastDocId = req.query.lastDocId as string;
            
            let lastDoc;
            if (lastDocId) {
                // Mendapatkan referensi dokumen terakhir untuk pagination
                const q = await UserRepository.potentialUser(lastDocId);
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    lastDoc = querySnapshot.docs[0];
                }
            }
            
            const potentialUsers = await UserRepository.getPotentialUsers(limit, lastDoc);
            res.status(200).json(potentialUsers);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update User
    static async updateUser(req: Request, res: Response) {
        try {
            const updatedUser = await UserRepository.updateUser(req.params.id, req.body);
            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update User Activity
    static async updateUserActivity(req: Request, res: Response) {
        try {
            const result = await UserRepository.updateUserActivity(req.params.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Delete User
    static async deleteUser(req: Request, res: Response) {
        try {
            const result = await UserRepository.deleteUser(req.params.id);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}