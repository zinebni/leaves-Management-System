import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import organisationModel from '../../models/organisationModel.js';


//organisation register
export const orgRegister = async (req, res) => {
    const { email, nom, description, password } = req.body;

    if (!email ||!nom || !password) {
        return res.status(400).json({
            success: false,
            message: 'Informations incomplètes.'
        });
    }

    try {
        //verifie si il y a deja un compte qui existe avec cet email
        const existingOrg = await organisationModel.findOne({ email });
        
        if (existingOrg) {
            return res.status(400).json({ success: false, message: "une organisation avec cet email existe déjà." });
        }
        
        // Générer un orgID unique
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
        const slugNom = nom.trim().toLowerCase().replace(/\s+/g, '-'); // ex: "My Company" => "my-company"
        const orgID = `${slugNom}-${timestamp}`; // exemple : my-company-202507091624

       

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'organisation
        const org = new organisationModel({
            email,
            orgID,
            nom,
            description,
            dateDeCreation: Date.now(),
            password: hashedPassword,
            role: "org"
        });

        await org.save();

        // Générer le token
        const payload = {
            id: org._id,
            role: org.role,
            organisation : org._id
        };
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });

        // Stocker dans un cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Réponse
        res.status(201).json({
            success: true,
            message: "Organisation enregistrée avec succès.",
            id: org._id,
            orgID : org.orgID ,// important pour que le frontend le récupère s’il veut l’afficher
            nom: org.nom,
            role: org.role
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



