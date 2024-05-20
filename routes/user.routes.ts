import express from "express";
const router = express.Router();

import UserController from "../controllers/user.controller";

const userController = new UserController();
router.post('/create-account', userController.createAccount);
router.post('/authenticate', userController.authenticate);

export default router;