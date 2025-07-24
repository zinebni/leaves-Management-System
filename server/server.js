//I-importation des modules:---------------
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import './cron/updateLeaveRights.js';
import './cron/resetDroitsCongesTousLesEmployes.js';


//II-importation de la base de données----------------
import connectDB from './config/mongodb.js';

//III-importation des routes----------------
import authRouter from './routes/auth/authRoutes.js';
import departmentRouter from './routes/departmentRoutes/departmentRoutes.js';
import employeeRouter from './routes/employeeRoutes/employeeRoutes.js';
import rhRouter from './routes/rhRoutes/rhRoutes.js';
import droitCongeRouter from './routes/droitCongeRoutes/droitCongeRoutes.js';
import congeRouter from './routes/conge/cogeRoutes.js';
import evenementRouter from './routes/evenementRoutes/evenementRoutes.js';

//IV-initialisation  du server----------------
const app =express();//initialiser l'application
const port = process.env.PORT ||4050; //definir le port du server en faisant appel à la variable d'environnement
connectDB(); //connecter la base de données

//V-activer les middlewares----------------
app.use(express.json());//// Middleware pour lire du JSON dans les requêtes
app.use(cookieParser());// Middleware pour gérer les cookies
app.use(cors({origin: 'http://localhost:5173',credentials: true}));// Middleware pour permettre les requêtes cross-origin (React → Express) // l'option truepermet l’envoi des cookies/JWT

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


//VI-faire appel aux routers creer == API Endpoints // creation des routes -------------------
app.use('/api/department', departmentRouter);
app.use('/api/auth', authRouter); // exemple : /api/auth/login and /api/auth/logout
app.use('/api/employee', employeeRouter); 
app.use('/api/rh', rhRouter);
app.use('/api/droits', droitCongeRouter);
app.use('/api/conge', congeRouter);
app.use('/api/evenement', evenementRouter);

//route de test
app.get('/',(req,res)=> res.send(`api is working fine on ${port} :)`));

//VII-lancer le server-------------------
app.listen(port,()=>console.log(`server started on http://127.0.0.1:${port}`));
