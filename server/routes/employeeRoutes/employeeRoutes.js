import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import { empRegister } from '../../controllers/auth/employeeRegisterController.js';

//1- utiliser express pour creer un routeur 
const employeeRouter = express.Router(); 

//2-definition des routes


//3-exportation du routeur
export default employeeRouter;