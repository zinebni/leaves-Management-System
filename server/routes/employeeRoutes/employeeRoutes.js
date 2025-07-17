import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import {deleteEmployeeById, getEmployeeById, getEmployees, getEmployeesByDepartment, getEmployeesByDepartmentAndRole, getEmployeesByDepartmentName, getEmployeesByDepartmentNameAndRole, getEmployeesByRole, updateEmployeeById } from '../../controllers/employeeControllers/empController.js';

//1- utiliser express pour creer un routeur 
const employeeRouter = express.Router(); 

//2-definition des routes

//Employee RH dashboard inforation and some RH fonctionalities routes
employeeRouter.get('/getEmployees',authMiddleware,getEmployees);
employeeRouter.get('/getEmployeeById/:id',authMiddleware,getEmployeeById);
employeeRouter.get('/getEmployeesByRole/:role',authMiddleware,getEmployeesByRole);
employeeRouter.get('/getEmployeesByDepartment/:departmentId',authMiddleware,getEmployeesByDepartment);
employeeRouter.get('/getEmployeesByDepartmentAndRole/:departmentId/:role',authMiddleware,getEmployeesByDepartmentAndRole);
employeeRouter.get('/getEmployeesByDepartmentName/:departmentName',authMiddleware,getEmployeesByDepartmentName);
employeeRouter.get('/getEmployeesByDepartmentNameAndRole/:departmentName/:role',authMiddleware,getEmployeesByDepartmentNameAndRole);
employeeRouter.delete('/deleteEmployeeById/:id',authMiddleware,deleteEmployeeById);
employeeRouter.put('/updateEmployeeById/:id',authMiddleware,updateEmployeeById);


//3-exportation du routeur
export default employeeRouter;