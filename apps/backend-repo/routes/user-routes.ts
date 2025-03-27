import express from "express";
import { UserController } from "../controller/user-controller";
import { AuthController } from "../controller/auth-controller"
import { authenticateUser, authorizeAdmin } from "../middleware/auth-middleware"

const router = express.Router();

// Define Routes
router.post("/create-user-data", UserController.createUser);
router.get("/fetch-user-data", authenticateUser, authorizeAdmin, UserController.getUsers);
router.get("/fetch-potential-user-data", authenticateUser, authorizeAdmin, UserController.getPotentialUsers);
router.put("/update-user-data/:id", authenticateUser, authorizeAdmin, UserController.updateUser);
router.delete("/delete-user-data/:id", authenticateUser, authorizeAdmin, UserController.deleteUser);

export default router;
