import express from 'express';
import { createCustomRight, createCustomRightForAllEmployees, getLeaveRightsByEmployee, getLeaveRightsByType, updateLeaveRight } from '../../controllers/leaveControllers/droitCongeController.js';
import authMiddleware from '../../middleware/auth.js';
import isRhMiddleware from '../../middleware/isRh.js';

//1- utiliser express pour creer un routeur 
const droitCongeRouter = express.Router(); 

//2-definition des routes
droitCongeRouter.get('/getLeaveRightsByEmployee/:employeeId',authMiddleware,getLeaveRightsByEmployee);
droitCongeRouter.get('/getLeaveRightsByType/:employeeId/:type',authMiddleware,getLeaveRightsByType);
droitCongeRouter.put('/updateLeaveRight/:employeeId/:droitId',authMiddleware,isRhMiddleware,updateLeaveRight);
droitCongeRouter.post('/createCustomRights/:employeeId',authMiddleware,isRhMiddleware,createCustomRight);
droitCongeRouter.post('/createCustomRightsForAllEmployees',authMiddleware,isRhMiddleware,createCustomRightForAllEmployees);

//3-exportation du routeur
export default droitCongeRouter;