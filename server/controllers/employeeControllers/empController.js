import DroitConge from '../../models/droitCongeModel.js';
import employeeModel from '../../models/employeeModel.js';

//get all employees
export const getEmployees = async (req, res) => {
    try {
      const employees = await employeeModel.find();
      res.status(200).json({ success: true, employees });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//get employee by id
export const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
      const employee = await employeeModel.findById(id);
      res.status(200).json({ success: true, employee });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//delete employee by id
export const deleteEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
      await employeeModel.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: 'Employé supprimé avec succès.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//update employee by id
export const updateEmployeeById = async (req, res) => {
  const { id } = req.params;
  const {
    nom,
    prenom,
    verificationEmail,
    department,
    dateDeRecrutement,
    dateDeDepart,
    sexe,
    situationFamiliale,
    nombreEnfants
  } = req.body;

  try {
    const oldEmployee = await employeeModel.findById(id);
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
          joursAutorisee: 14,
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

