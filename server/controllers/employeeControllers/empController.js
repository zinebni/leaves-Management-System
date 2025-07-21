import DroitConge from '../../models/droitCongeModel.js';
import employeeModel from '../../models/employeeModel.js';
import departmentModel from '../../models/departmentModel.js';


//get all employees for an organisation
export const getEmployees = async (req, res) => {
    const org_id = req.user.organisation;
    try {
      const employees = await employeeModel.find({organisation: org_id},{password:0,resetOtp:0,verifyOtp:0,verifyOtpExpireAt:0,resetOtpExpiredAt:0,isAccountVerified:0,createdAt:0,updatedAt:0,__v:0,deleted:0}).populate("department").populate("organisation");
      res.status(200).json({ success: true, employees });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//get employee by id for an organisation
export const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    const org_id = req.user.organisation;
    try {
      const employee = await employeeModel.findById({ _id: id, organisation: org_id },{password:0,resetOtp:0,verifyOtp:0,verifyOtpExpireAt:0,resetOtpExpiredAt:0,createdAt:0,updatedAt:0,__v:0,deleted:0}).populate("department").populate("organisation");
      res.status(200).json({ success: true, employee });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//get employees for an organisation by role
export const getEmployeesByRole = async (req, res) => {
    const { role } = req.params;
    const org_id = req.user.organisation;
    try {
      const employees = await employeeModel.find({organisation: org_id, role},{password:0,resetOtp:0,verifyOtp:0,verifyOtpExpireAt:0,resetOtpExpiredAt:0,createdAt:0,updatedAt:0,__v:0,deleted:0}).populate("department");
      res.status(200).json({ success: true, employees });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//get employees for an organisation by department id
export const getEmployeesByDepartment = async (req, res) => {
    const { departmentId } = req.params;
    const org_id = req.user.organisation;
    try {
      const employees = await employeeModel.find({organisation: org_id, department: departmentId},{password:0,resetOtp:0,verifyOtp:0,verifyOtpExpireAt:0,resetOtpExpiredAt:0,createdAt:0,updatedAt:0,__v:0,deleted:0 });
      res.status(200).json({ success: true, employees });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
//get employees for an organisation by department name 
export const getEmployeesByDepartmentName = async (req, res) => {
  const { departmentName } = req.params;
  const org_id = req.user.organisation;

  try {
    // Étape 1 : chercher le département par son nom et organisation
    const department = await departmentModel.findOne({ nom: departmentName, organisation: org_id });
    if (!department) {
      return res.status(404).json({ success: false, message: "Département introuvable." });
    }

    // Étape 2 : chercher les employés liés à ce département
    const employees = await employeeModel.find(
      { organisation: org_id, department: department._id },{ password: 0, resetOtp: 0, verifyOtp: 0, verifyOtpExpireAt: 0, resetOtpExpiredAt: 0,createdAt:0,updatedAt:0,__v:0,deleted:0 }
    );

    res.status(200).json({ success: true, employees });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//get employees for an organisation by department id  and role
export const getEmployeesByDepartmentAndRole = async (req, res) => {
    const { departmentId, role } = req.params;
    const org_id = req.user.organisation;
    try {
      const employees = await employeeModel.find({organisation: org_id, department: departmentId, role},{password:0,resetOtp:0,verifyOtp:0,verifyOtpExpireAt:0,resetOtpExpiredAt:0, createdAt:0,updatedAt:0,__v:0,deleted:0 });
      res.status(200).json({ success: true, employees });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
      }
  };
//get employees for an organisation by department name and role
export const getEmployeesByDepartmentNameAndRole = async (req, res) => {
   const { departmentName , role } = req.params;
  const org_id = req.user.organisation;

  try {
    // Étape 1 : chercher le département par son nom et organisation
    const department = await departmentModel.findOne({ nom: departmentName, organisation: org_id });
    if (!department) {
      return res.status(404).json({ success: false, message: "Département introuvable." });
    }

    // Étape 2 : chercher les employés liés à ce département
    const employees = await employeeModel.find(
      { role,organisation: org_id, department: department._id },
      { password: 0, resetOtp: 0, verifyOtp: 0, verifyOtpExpireAt: 0, resetOtpExpiredAt: 0,createdAt:0,updatedAt:0,__v:0,deleted:0 }
    );

    res.status(200).json({ success: true, employees });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  };
//delete employee by id for an organisation
export const deleteEmployeeById = async (req, res) => {
    const { id } = req.params;
    const org_id = req.user.organisation;
    try {
      await employeeModel.delete({ _id: id, organisation: org_id });
      res.status(200).json({ success: true, message: 'Employé supprimé avec succès.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//update employee by id for an organisation
export const updateEmployeeById = async (req, res) => {
  const { id } = req.params;
  const org_id = req.user.organisation;
  const {
    nom,
    prenom,
    verificationEmail,
    numeroDeContact,
    department,
    dateDeRecrutement,
    dateDeDepart,
    sexe,
    situationFamiliale,
    nombreEnfants
  } = req.body;

  try {
    const oldEmployee = await employeeModel.findById({ _id: id, organisation: org_id });
    if (!oldEmployee) {
      return res.status(404).json({ success: false, message: "Employé introuvable." });
    }

    // Comparer et mettre à jour les congés
    const droitsToAdd = [];

    // Congé de paternité (si homme et situation devient marié)
    const becameMarried = oldEmployee.situationFamiliale !== 'marié(e)' && situationFamiliale === 'marié(e)';
    const isMale = sexe === 'Homme';
    const isFemale = sexe === 'Femme';

    if (becameMarried && isMale) {
      const hasPaternite = await DroitConge.findOne({ employee: id, type: 'paternite' });
      if (!hasPaternite) {
        droitsToAdd.push({
          employee: id,
          type: 'paternite',
          joursAutorisee: 3,
          estPaye: true
        });
      }
    }

    if (becameMarried && isFemale) {
      const hasMaternite = await DroitConge.findOne({ employee: id, type: 'maternite' });
      if (!hasMaternite) {
        droitsToAdd.push({
          employee: id,
          type: 'maternite',
          joursAutorisee: 14,
          estPaye: true
        });
      }
    }

    // Circoncision (si le nombre d’enfants augmente)
    const enfantAjoute = nombreEnfants > (oldEmployee.nombreEnfants || 0);
    if (enfantAjoute) {
      const hasCirconcision = await DroitConge.findOne({ employee: id, type: 'Circoncision d’un enfant' });
      if (!hasCirconcision) {
        droitsToAdd.push({
          employee: id,
          type: 'Circoncision d’un enfant',
          joursAutorisee: 1,
          estPaye: true
        });
      }

      const hasMariageEnfant = await DroitConge.findOne({ employee: id, type: 'Mariage d\’un enfant' });
      if (!hasMariageEnfant) {
        droitsToAdd.push({
          employee: id,
          type: 'Mariage d\’un enfant',
          joursAutorisee: 2,
          estPaye: true
        });
      }
    }

    //change de sexe
    const changedSexe = oldEmployee.sexe !== sexe;
    if (changedSexe) {
      // Suppression des droits liés au sexe précédent
      await DroitConge.deleteMany({ employee: id, type: { $in: ['paternite', 'maternite'] } });

      // Ajout des nouveaux droits en fonction du nouveau sexe
      if (sexe === 'Homme') {
        droitsToAdd.push({
          employee: id,
          type: 'paternite',
          joursAutorisee: 3,
          estPaye: true
        });
      } else if (sexe === 'Femme') {
        droitsToAdd.push({
          employee: id,
          type: 'maternite',
          joursAutorisee: 98,
          estPaye: true
        });
      }
    }

    // Ajout des nouveaux droits si nécessaires
    if (droitsToAdd.length > 0) {
      await DroitConge.insertMany(droitsToAdd);
    }

    //Mise à jour des données de l’employé
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      id,
      {
        nom,
        prenom,
        verificationEmail,
        numeroDeContact,
        department,
        dateDeRecrutement,
        dateDeDepart,
        sexe,
        situationFamiliale,
        nombreEnfants
      },
      { new: true }
    );

    res.status(200).json({ success: true, employee: updatedEmployee });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

