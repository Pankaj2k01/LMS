import { Router } from "express";
import { forgotPasswordController, loginController, meController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { withAsync } from "../utils/validation.js";

const router = Router();

router.post("/login", withAsync(loginController));
router.post("/forgot-password", withAsync(forgotPasswordController));
router.get("/me", authMiddleware, withAsync(meController));

export default router;
