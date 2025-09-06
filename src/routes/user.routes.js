import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';

const router = Router();

// Define user-related routes here

router.route("/register").post(registerUser);

// Simple health check (GET) so you can test in browser easily
router.get('/health', (req, res) => {
  res.status(400).json({ status: 'ok', route: '/api/v1/users/health' });
});

export default router;
