import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import organisationModel from '../../models/organisationModel.js';

//login
export const orgLogin = async (req,res)=>{
    //1-recuperer les infos chargées dans la requet http
    const {email,password} = req.body;
    if(!email||!password){
        return res.status(400).json({
            success:false,
            message:'Informations incomplètes.'
        })
    }
    
    try {
        //2-verifier si l'organisation existe
        const org = await organisationModel.findOne({email});
        if(!org){
            return res.status(401).json({success:false, message:"Email ou mot de passe incorrect !"})
        }
        //3-verifier si le mot de passe est correct
        const isPasswordMatch = await bcrypt.compare(password,org.password);
        
        if(!isPasswordMatch){
            return res.status(401).json({success:false, message:"Email ou mot de passe incorrect."})
        }
        
        //4-generer un token JWT
        const payload= {
            id:org._id,
            orgID:org.orgID,
            role:org.role,
        };
        const  secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload,secretKey,{expiresIn:'7d'});
        
        //5-envoyer le token dans la reponse avec un cookie
        res.cookie(
            'token',token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 7*24*60*60*1000
            });
        
        //6-envoyer la reponse (ou le role de l'utilisateur pour le rederiger correctement  dans le frontend)
        res.status(200).json({success:true,message:"Connexion réussie.",id:`${org._id}`,role:`${org.role}`,orgID: `${org.orgID}`});
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
    
}

//logout
export const orgLogout = async (req, res)=>{
    try {
        res.clearCookie('token',{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7*24*60*60*1000
            });

        //envoyer la reponse
        return res.status(200).json({success:true, message:"Déconnexion réussie."});
    } catch (error) {
        return res.status(500).json({success:false, message:error.message})
    }
}










