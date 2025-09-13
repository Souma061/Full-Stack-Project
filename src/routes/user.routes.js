import { Router } from 'express';
import { changeUserPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logOutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { UsernameParamSchema,
  UserRegisterSchema,
  UserLoginSchema,
  UserAccountUpdateSchema,
  ChangePasswordSchema } from '../schemas/user.schemas.js';


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
  validateRequest({body: UserRegisterSchema}),
  registerUser
);

router.route("/login").post(validateRequest({body: UserLoginSchema}), loginUser);



// secured routes

router.route("/logout").post(verifyJWT, logOutUser);

router.route("/refresh").post(refreshAccessToken);

router.route('/channel/:username').get(validateRequest({params: UsernameParamSchema}), getUserChannelProfile);

router.route('/change-password').post(verifyJWT, validateRequest({body: ChangePasswordSchema}), changeUserPassword);

router.route('/me').get(verifyJWT, getCurrentUser);

router.route('/update').patch(verifyJWT, validateRequest({body: UserAccountUpdateSchema}), updateAccountDetails);
router.route('/update/avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar);
router.route('/update/cover-image').patch(verifyJWT, upload.single('coverImage'), updateUserCoverImage);
router.route('/watch-history').get(verifyJWT, getWatchHistory);

export default router;








// Simple health check (GET) so you can test in browser easily
// router.get('/health', (req, res) => {
//   res.status(400).json({ status: 'ok', route: '/api/v1/users/health' });
// });
