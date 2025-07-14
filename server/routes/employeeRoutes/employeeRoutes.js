import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import isOrgMiddleware from '../../middleware/isOrg.js';
import isRhMiddleware from '../../middleware/isRh.js';
import {deleteEmployeeById, getEmployeeById, getEmployees, updateEmployeeById } from '../../controllers/employeeControllers/empController.js';

//1- utiliser express pour creer un routeur 
const employeeRouter = express.Router(); 

//2-definition des routes
employeeRouter.get('/getEmployees',authMiddleware,getEmployees);
employeeRouter.get('/getEmployeeById/:id',authMiddleware,getEmployeeById);
employeeRouter.delete('/deleteEmployeeById/:id',authMiddleware,isRhMiddleware,deleteEmployeeById);
employeeRouter.put('/updateEmployeeById/:id',authMiddleware,updateEmployeeById);

//3-exportation du routeur
export default employeeRouter;