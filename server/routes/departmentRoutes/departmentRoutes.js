import express from 'express';
import { createDepartment, deleteDepartment, getDepartments } from '../../controllers/departmentControllers/departmentController.js';
import authMiddleware from '../../middleware/auth.js';
import isOrgMiddleware from '../../middleware/isOrg.js';

//1- utiliser express pour creer un routeur 
const departmentRouter = express.Router(); 

//2-definition des routes
departmentRouter.post('/createDepartment',authMiddleware,isOrgMiddleware,createDepartment);
departmentRouter.get('/getDepartments',authMiddleware,getDepartments);
departmentRouter.delete('/deleteDepartment/:id',authMiddleware,isOrgMiddleware,deleteDepartment);

//3-exportation du routeur
export default departmentRouter;