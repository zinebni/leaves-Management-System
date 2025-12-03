//I-importation des modules:---------------
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import path from 'path';
/*importation des tâches planifiées par cron*/ 
import './cron/resetDroitsCongesTousLesEmployes.js';
import './cron/updateLeaveRights.js';
/*add importation socket.io for notification*/
import http from 'http';
import { Server } from 'socket.io';

//II-importation de la base de données----------------
import connectDB from './config/mongodb.js';

//III-importation des routes----------------
import authRouter from './routes/auth/authRoutes.js';
import congeRouter from './routes/conge/cogeRoutes.js';
import departmentRouter from './routes/departmentRoutes/departmentRoutes.js';
import droitCongeRouter from './routes/droitCongeRoutes/droitCongeRoutes.js';
import employeeRouter from './routes/employeeRoutes/employeeRoutes.js';
import evenementRouter from './routes/evenementRoutes/evenementRoutes.js';
import notificationRouter from './routes/notificationRoutes/notificationRoutes.js';
import rhRouter from './routes/rhRoutes/rhRoutes.js';

//IV-initialisation  du server----------------
const app =express();//initialiser l'application
const port = process.env.PORT ||4050; //definir le port du server en faisant appel à la variable d'environnement
connectDB(); //connecter la base de données

/*Configuration CORS - adapte selon l'environnement*/
const corsOrigin = process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production'
  ? 'http://localhost:8080'  // Production: nginx serves frontend on port 8080
  : 'http://localhost:5173'); // Development: Vite dev server

/*initialisation de socket.io*/

const server = http.createServer(app); // on crée un vrai serveur HTTP
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'] ,
    credentials: true}
});


//V-activer les middlewares----------------
app.use(express.json());//// Middleware pour lire du JSON dans les requêtes
app.use(cookieParser());// Middleware pour gérer les cookies
app.use(cors({origin: corsOrigin, credentials: true}));// Middleware pour permettre les requêtes cross-origin (React → Express) // l'option truepermet l’envoi des cookies/JWT

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


//VI-faire appel aux routers creer == API Endpoints // creation des routes -------------------
app.use('/api/department', departmentRouter);
app.use('/api/auth', authRouter); // exemple : /api/auth/login and /api/auth/logout
app.use('/api/employee', employeeRouter); 
app.use('/api/rh', rhRouter);
app.use('/api/droits', droitCongeRouter);
app.use('/api/conge', congeRouter);
app.use('/api/evenement', evenementRouter);
app.use('/api/notification', notificationRouter);

//route de test
app.get('/',(req,res)=> res.send(`api is working fine on ${port} :)`));

//socket.io

/*client connected*/
io.on('connection', (socket) => {
  console.log('a user connected');
  
  /*client joined a room*/
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`user joined room ${room}`);
  });
  
  /*client disconnected*/
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  
});



//VII-lancer le server-------------------

//app.listen(port,()=>console.log(`server started on http://127.0.0.1:${port}`));

server.listen(port, () => {
 console.log(`Express + WebSocket  Server is running on port http://localhost:${port}`);
});

export default io;