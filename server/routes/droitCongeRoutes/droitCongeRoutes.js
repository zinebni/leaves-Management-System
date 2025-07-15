import express from 'express';
import { createCustomRight, getLeaveRightsByEmployee, getLeaveRightsByType, updateLeaveRight } from '../../controllers/leaveControllers/droitCongeController.js';


//1- utiliser express pour creer un routeur 
const droitCongeRouter = express.Router(); 

//2-definition des routes
droitCongeRouter.get('/getLeaveRightsByEmployee/:employeeId',getLeaveRightsByEmployee);
droitCongeRouter.get('/getLeaveRightsByType/:employeeId/:type',getLeaveRightsByType);
droitCongeRouter.put('/updateLeaveRight/:employeeId/:droitId',updateLeaveRight);
droitCongeRouter.post('/createCustomRights/:employeeId',createCustomRight);

//3-exportation du routeur
export default droitCongeRouter;