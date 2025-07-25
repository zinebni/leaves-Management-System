import express from 'express';
import { getNotifications, markNotificationAsRead } from '../../controllers/notificationControllers/notificationControllers.js';
import authMiddleware from '../../middleware/auth.js';

//1- utiliser express pour creer un routeur 
const notificationRouter = express.Router(); 

//2-definition des routes
notificationRouter.get('/getNotifications',authMiddleware,getNotifications);
notificationRouter.put('/markNotificationAsRead/:id',authMiddleware,markNotificationAsRead);

//3-exportation du routeur
export default notificationRouter;