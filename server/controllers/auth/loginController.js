import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../../config/nodemailer.js';
import employeeModel from '../../models/employeeModel.js';
import { isEligibleForLeave } from '../../utils/isEligibleForLeave.js';


//login
export const login = async (req,res)=>{
    //1-recuperer les infos chargées dans la requet http
    const {email,password} = req.body;
    if(!email||!password){
        return res.status(400).json({
            success:false,
            message:'Informations incomplètes.'
        })
    }
    
    try {
        //2-verifier si l'utilisateur existe
        const employee = await employeeModel.findOne({email});
        if(!employee){
            return res.status(401).json({success:false, message:"Email ou mot de passe incorrect !"})
        }
        //3-verifier si le mot de passe est correct
        const isPasswordMatch = await bcrypt.compare(password,employee.password);
        
        if(!isPasswordMatch){
            return res.status(401).json({success:false, message:"Email ou mot de passe incorrect."})
        }
        

        //savoir s'il a droit au conge 
        const eligible = isEligibleForLeave(employee.dateDeRecrutement); //pour envoyer alert dans le frontend "vous n'avez pas le droit au conge annuel"
        //4-generer un token JWT
        const payload= {
            id:employee._id,
            role:employee.role,
            organisation:employee.organisation,
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
        
        //6-envoyer la reponse (ou le role de l'utilisateur pour le rederiger correctement vers la page RH ou employee dans le frontend)
        res.status(200).json({
            success:true,
            message:"Connexion réussie.",
            data: {
            id: employee._id,
            nom: employee.nom,
            prenom: employee.prenom,
            role: employee.role,
            email: employee.email,
            organisation: employee.organisation,
            department: employee.department,
            dateDeRecrutement: employee.dateDeRecrutement,
            isEligibleForLeave: eligible
            }
        });
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
    
}


// logout
export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        const role = tokenDecoded.role;
        if(role === 'org'){
            return res.status(400).json({
                success:false,
                message:'logout not allowed for org'
            })
        }
        const employeeId = tokenDecoded.id;

        // Mise à jour de isAccountVerified à false
        await employeeModel.findByIdAndUpdate(employeeId, { isAccountVerified: false });

        // Supprimer le cookie JWT
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 0
        });

        return res.status(200).json({ success: true, message: "Déconnexion réussie. Compte à revérifier à la prochaine connexion." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



//!!! pour les fonction suivant l'utilisateur envoi son const { employeeId } = req.body; grace au midedleware qui accede au token stocker dans le cookie enregistré sur le navigateur

//send verification  otp to the User's email
export const sendVerifyOtp = async (req, res) => {
    try {
        const employeeId  = req.user.id;
        const employee = await employeeModel.findById(employeeId);

        if(employee.isAccountVerified){
            return res.status(400).json({
                success:false,
                message:'compte deja verifié'
            });
        }

        //generate otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        //stocker otp
        employee.verifyOtp = otp;
        //set expiration time
        employee.verifyOtpExpireAt = Date.now() + 24*60*60*1000;; // 24 hours
        
        //save les modifications
        await employee.save();
        
        //sending verification email
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: employee.verificationEmail,
            subject: 'Verification de compte',
            text: `Votre code de verification est: ${otp}. verifiez votre compte en cliquant sur le lien suivant: http://localhost:3000/verify-account/${employee._id}`,
          };
        
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Email de verification envoyé.' });

        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
   

  };

//verify email
export const verifyEmail = async (req,res)=>{
    
     const { id: employeeId } = req.user;
     const { otp } = req.body;
     if(!employeeId||!otp){
        return res.status(400).json({
            success:false,
            message:'verification incomplètes.'
        })
     }

     try {
        const employee = await employeeModel.findById(employeeId).populate({path:'organisation',select:'orgID'});

        if(!employee){
            return res.status(404).json({
                success:false,
                message:'utilisateur non trouvé.'
            })
        }

        if(employee.isAccountVerified){
            return res.status(400).json({
                success:false,
                message:'compte deja verifié'
            });
        }

        if(employee.verifyOtp === '' || employee.verifyOtp !== otp){
            return res.status(400).json({
                success:false,
                message:'code de verification invalide.'
            });
        }

        if(employee.verifyOtpExpireAt < Date.now()){
            return res.status(400).json({
                success:false,
                message:'code de verification expiré.'
            });
        }

        //***si tous est ok :
        // on verifie le compte
        employee.isAccountVerified = true;
        // on supprime le code de verification
        employee.verifyOtp = '';
        // on supprime la date d'expiration du code de verification
        employee.verifyOtpExpireAt = 0;
        // on sauvegarde
        await employee.save();
        // on envoie la reponse
        console.log(employee.organisation.orgID);
        return res.status(200).json({
            success:true,
            message:'compte verifié avec succès.',
            data : {employee, orgID: employee.organisation.orgID}
        });
     } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
     }
} 

//check if user is authenticated
export const isAuthenticated = async(req,res)=>{
    try {
        return res.json({success:true, message:"utilisateur authentifié"})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//send password reset otp
export const sendResetOtp = async (req, res) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json({
            success:false,
            message:'email manquant.'
        })
    }
    try {
        const employee= await employeeModel.findOne({email});
        if(!employee){
            return res.status(404).json({
                success:false,
                message:'utilisateur non trouvé.'
            })
        }
        
        //generate otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        employee.resetOtp = otp;
        //set expiration time
        employee.resetOtpExpiredAt = Date.now() + 15*60*1000;; 
        
        //save les modifications
        await employee.save();
        
        //sending verification email
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: employee.verificationEmail,
            subject: 'Reset password',
            text: `utiliser ce code de verification pour changer votre mot de passe: ${otp}`,
          };
        
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Email otp pour reset password est envoyé.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

    
}

//reset user otp password
export const resetPassword = async (req, res) => {
    const { email, otp, newpassword } = req.body;
    if (!email ||!otp || !newpassword) {
      return res.status(400).json({
        success: false,
        message: 'Informations incomplètes.'
      });
    }
  
    try {
      const employee = await employeeModel.findOne({email});
        
      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'utilisateur non trouvé.'
        });
      }

      if(employee.resetOtp == "" || employee.resetOtp !== otp){
        return res.status(400).json({
          success: false,
          message: 'Code de verification invalide.'
        });
      }
  
      if (employee.resetOtpExpiredAt < Date.now()) {
        return res.status(400).json({
          success: false,
          message: 'Code de verification expiré.'
        });
      }
      
      //in case the otp is valide
      const hashedPassword = await bcrypt.hash(newpassword, 10);   
      employee.password = hashedPassword;
      employee.resetOtp = '';
      employee.resetOtpExpiredAt = 0;

      //save les modifications
      await employee.save();
  
      return res.status(200).json({ success: true, message: 'Mot de passe modifié avec succès.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };


