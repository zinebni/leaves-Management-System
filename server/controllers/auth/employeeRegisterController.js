import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import transporter from '../../config/nodemailer.js';
import employeeModel from '../../models/employeeModel.js';
import { createDefaultLeaveRights } from '../leaveControllers/droitCongeController.js';



//Employee register 

export const empRegister = async (req, res) => {
  const { nom, prenom, verificationEmail, department, sexe, numeroDeContact, dateDeRecrutement, situationFamiliale, nombreEnfants } = req.body;

  if (!nom || !prenom  ||!verificationEmail|| !department || !sexe) {
    return res.status(400).json({
      success: false,
      message: 'Informations incomplètes.'
    });
  }

  try {
    // generer le mot de passe aléatoirement et le hasher
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    //creer email
    const email = `${nom.toLowerCase()}.${prenom.toLowerCase()}.${uuidv4().slice(0, 3)}@employe.org`;
    
    // Vérifier si l'employé existe déjà
    const existingUser = await employeeModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Un utilisateur avec cet email existe déjà." });
    }

    // Créer le nouvel employé avec rôle forcé
    const organisation = req.user.organisation;
    const employee = new employeeModel({
      nom,
      prenom,
      email : email,
      password: hashedPassword,
      role: 'employe', // FORCÉ
      verificationEmail,
      department,
      organisation,
      sexe,
      numeroDeContact,
      dateDeRecrutement,
      situationFamiliale,
      nombreEnfants
    });

    // Sauvegarder l'employé et créer ses droits de congés par défaut
    await employee.save();
    
    await createDefaultLeaveRights(employee);
    
    //sending welcome email
        const  mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: verificationEmail,
            subject: 'Bienvenue !',
            template: 'account_created', // nom du fichier sans .hbs
            context: {
              nom,
              prenom,
              role: 'employé',
              email,
              password: randomPassword,
            },
          };
        await transporter.sendMail(mailOptions);

    // Envoyer la réponse
    res.status(201).json({ success: true, message: 'Employé enregistré avec succès.', employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};