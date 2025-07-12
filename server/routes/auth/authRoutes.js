import express from 'express';
import { empRegister } from '../../controllers/auth/employeeRegisterController.js';
import { isAuthenticated, login, logout, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../../controllers/auth/loginController.js';
import { orgLogin, orgLogout } from '../../controllers/auth/orgLoginController.js';
import { orgRegister } from '../../controllers/auth/orgRegisterController.js';
import { rhRegister } from '../../controllers/auth/rhRegisterController.js';
import authMiddleware from '../../middleware/auth.js';
import isOrgMiddleware from '../../middleware/isOrg.js';
import isRhMiddleware from '../../middleware/isRh.js';

//1- utiliser express pour creer un routeur 
const authRouter = express.Router(); 

//2-definition des routes

//***les routes pour enregistrement et login des organisations */

authRouter.post('/orgRegister',orgRegister);
authRouter.post('/orgLogin',orgLogin);
authRouter.post('/orgLogout',orgLogout);


//***les routes pour login des employés */
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',authMiddleware,sendVerifyOtp);
authRouter.post('/verify-account',authMiddleware,verifyEmail);
authRouter.post('/is-auth',authMiddleware,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);

//***les routes pour register */
authRouter.post('/rhRegister',authMiddleware,isOrgMiddleware,rhRegister);
authRouter.post('/empRegister',authMiddleware,isRhMiddleware,empRegister);

//3-exportation du routeur
export default authRouter;
