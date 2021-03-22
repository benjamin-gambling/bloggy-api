import express from "express";
import userController from "../controllers/user";

const router = express.Router();

// GET - Get users
router.get("/", userController.getUsers);

// GET - Get user by id
router.get("/:userId", userController.getUser);

// POST - LOG IN
router.post("/login", userController.loginUser);

// POST - SIGN UP
router.post("/sign-up", userController.signUpUser);

export default router;
