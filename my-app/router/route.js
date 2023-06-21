import { Router } from 'express';

/** Import all controllers */
import * as controller from '../controller/appController.js';
import Auth from '../middleware/auth.js';

const router = Router();

// POST method
router.route('/register').post(controller.register);
// router.route('/registerMail').post() // Use to send email
router.route('/authenticate').post((req, res) => res.end()); // Authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // Login in app

// GET method
router.route('/user/:username').get(controller.getUser); // User with username
router.route('/generateOTP').get(controller.generateOTP); // Generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP); // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession); // Reset all the variable

// PUT method
router.route('/updateUser').put(Auth, controller.updateUser); // To update the user profile
router.route('/resetPassword').put(controller.resetPassword); // Use to reset password

export default router;
