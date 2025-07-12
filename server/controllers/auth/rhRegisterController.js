import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import transporter from '../../config/nodemailer.js';
import employeeModel from '../../models/employeeModel.js';



//RH register
export const rhRegister = async(req,res)=>{
    const   {nom,prenom,verificationEmail,department} = req.body;  //recuperer les infos chargées dans la requet http

    if(!nom||!prenom ||!verificationEmail||!department){
        return res.status(400).json({
            success:false,
            message:'Informations incomplètes.'
        })
    }

    try{

    //1-creer un rundom password :  8 caractères en base 36 (chiffres 0–9 + lettres a–z)
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword,10);

    //2-creer email
        const email = `${nom.toLowerCase()}.${prenom.toLowerCase()}.${uuidv4().slice(0, 3)}@employe.aufes.org`;
        
    //3-Vérifier si l'utilisateur existe déjà
        const existingUser = await employeeModel.findOne({email}) 
        if(existingUser){
            return res.json({success:false,message:"Un utilisateur avec cet email existe déjà."})
        }

    //4-creer un nouveau RH
        const RH = new employeeModel({
            nom,
            prenom,
            email : email,
            password:hashedPassword,
            role:"RH", // FORCÉ
            verificationEmail,
            department})

    //5-Sauvgarder dans la base de données
        await RH.save();

    //6-generer un token JWT
        const payload= {
            id:RH._id,
            role:RH.role,
        };
        const  secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload,secretKey,{expiresIn:'7d'});

    //7-envoyer le token dans la reponse avec un cookie
        res.cookie(
            'token',token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7*24*60*60*1000
            });
        
    //8-sending welcome email
        const  mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: verificationEmail,
            subject: 'Bienvenue !',
            text: `Bonjour, votre compte en tant que RH à été créé par l\'email: ${email} et le mot de passe: ${randomPassword}`,
          };
        await transporter.sendMail(mailOptions);
        
    //9-envoyer la reponse
        res.status(201).json({success:true,message:"RH enregistré avec succès."});
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}


