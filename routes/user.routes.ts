import express from "express";
const router = express.Router();

import { createAccount, authenticate } from "../controllers/user.controller";


router.post('/create-account', createAccount);
router.post('/authenticate', authenticate);

export default router;