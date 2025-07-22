import express from 'express';
import { createevenement, deleteevenement, getevenementById, getevenements, updateevenement } from '../../controllers/evenementControllers/eventController.js';
import authMiddleware from '../../middleware/auth.js';
import checkRole from '../../middleware/checkRole.js';

//1- utiliser express pour creer un routeur 
const evenementRouter = express.Router(); 

//2-definition des routes
evenementRouter.post('/createevenement',authMiddleware,checkRole(['RH', 'org']),createevenement);
evenementRouter.get('/getevenements',authMiddleware,getevenements);
evenementRouter.get('/getevenementById/:id',authMiddleware,getevenementById);
evenementRouter.put('/updateevenement/:id',authMiddleware,checkRole(['RH', 'org']),updateevenement);
evenementRouter.delete('/deleteevenement/:id',authMiddleware,checkRole(['RH', 'org']),deleteevenement);

//3-exportation du routeur
export default evenementRouter;