import express  from 'express';
import { checkAuth } from '../controller/auth.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/check",protectedRoute,checkAuth)

export default router;