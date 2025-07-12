import express from 'express';
import { rhRegister } from '../../controllers/auth/rhRegisterController.js';

//1- utiliser express pour creer un routeur 
const rhRouter = express.Router(); 

//2-definition des routes


//3-exportation du routeur
export default rhRouter;