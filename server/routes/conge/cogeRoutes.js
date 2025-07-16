import express from 'express';
import upload from '../../middleware/upload.js';
import { createLeaveRequest } from '../../controllers/leaveControllers/congeController.js';

//1- utiliser express pour creer un routeur 
const congeRouter = express.Router(); 

//2-definition des routes
congeRouter.post('/createLeaveRequest/:employeeId',upload.array('justificatif', 5),createLeaveRequest);

//3-exportation du routeur
export default congeRouter;