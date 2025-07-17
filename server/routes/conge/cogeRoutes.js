import express from 'express';
import upload from '../../middleware/upload.js';
import { cancelLeaveRequest, createLeaveRequest , getAllLeaveRequests, getAllLeaveRequestsByDepartment, getAllLeaveRequestsByDepartmentAndStatus, getAllLeaveRequestsByEmployee, getAllLeaveRequestsByStatus, getLeaveRequestById, getMyLeaveRequests, getMyLeaveRequestsByStatus, getMyLeaveRequestsDeleted} from '../../controllers/leaveControllers/congeController.js';
import authMiddleware from '../../middleware/auth.js';
import isRhMiddleware from '../../middleware/isRh.js';

//1- utiliser express pour creer un routeur 
const congeRouter = express.Router(); 

//2-definition des routes

//routes for employees
congeRouter.post('/createLeaveRequest',authMiddleware,upload.array('justificatif', 5),createLeaveRequest);
congeRouter.get('/getMyLeaveRequests',authMiddleware,getMyLeaveRequests);
congeRouter.get('/getMyLeaveRequestsDeleted',authMiddleware,getMyLeaveRequestsDeleted);
congeRouter.get('/getLeaveRequestsByStatus/:status',authMiddleware,getMyLeaveRequestsByStatus);
congeRouter.delete('/cancelLeaveRequest/:id',authMiddleware,cancelLeaveRequest);


//routes for RH
congeRouter.get('/getAllLeaveRequests',authMiddleware,isRhMiddleware,getAllLeaveRequests);
congeRouter.get('/getAllLeaveRequestsByStatus/:status',authMiddleware,isRhMiddleware,getAllLeaveRequestsByStatus);
congeRouter.get('/getLeaveRequestById/:id',authMiddleware,isRhMiddleware,getLeaveRequestById);
congeRouter.get('/getAllLeaveRequestsByEmployee/:employeeId',authMiddleware,isRhMiddleware,getAllLeaveRequestsByEmployee);
congeRouter.get('/getAllLeaveRequestsByDepartment/:departmentId',authMiddleware,isRhMiddleware,getAllLeaveRequestsByDepartment);
congeRouter.get('/getAllLeaveRequestsByDepartmentAndStatus/:departmentId/:status',authMiddleware,isRhMiddleware,getAllLeaveRequestsByDepartmentAndStatus);

//3-exportation du routeur
export default congeRouter;