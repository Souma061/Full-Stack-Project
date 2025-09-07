import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Define user-related routes here

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    },
  ]),
  registerUser);



export default router;








// Simple health check (GET) so you can test in browser easily
// router.get('/health', (req, res) => {
//   res.status(400).json({ status: 'ok', route: '/api/v1/users/health' });
// });
