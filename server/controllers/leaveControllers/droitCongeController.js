import DroitConge from '../../models/droitCongeModel.js';
import employeeModel from '../../models/employeeModel.js';


//get leave rights by employee
export const getLeaveRightsByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const droits = await DroitConge.find({ employee: employeeId });
    res.status(200).json({ success: true, droits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get leave rights by type for an employee
export const getLeaveRightsByType = async (req, res) => {
  const { employeeId, type } = req.params;
  try {
    const droits = await DroitConge.find({ employee: employeeId, type });
    res.status(200).json({ success: true, droits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update a leave right for an employee
// PUT /api/droits/:employeeId/:droitId
export const updateLeaveRight = async (req, res) => {
  const { employeeId, droitId } = req.params;
  const { joursAutorisee, estPaye } = req.body;

  try {
    const droit = await DroitConge.findOneAndUpdate(
      { _id: droitId, employee: employeeId }, // filtre : sécurité
      { joursAutorisee, estPaye },            // champs à modifier
      { new: true }                           // retourne le doc mis à jour
    );

    if (!droit) {
      return res.status(404).json({ success: false, message: "Droit de congé introuvable pour cet employé." });
    }

    res.status(200).json({ success: true, droit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//creer les droits de congé par defaut
export const createDefaultLeaveRights = async (employee) => {
  
  //calcule de l'anciennete
  const now = new Date();
  const recrutementDate = new Date(employee.dateDeRecrutement);
  const anciennete = now.getFullYear() - recrutementDate.getFullYear();
  const nbr5 = anciennete%5;
  


  const droits = [];

  droits.push({
    employee: employee._id,
    type: 'annuel',
    joursAutorisee:18+nbr5*1.5 >30 ? 30 : 18+nbr5*1.5,
    estPaye: true
  });

  if (employee.sexe === 'Femme') {
    droits.push({
      employee: employee._id,
      type: 'maternite',
      joursAutorisee: 98,
      estPaye: true
    });
  }

  if (employee.sexe === 'Homme') {
    droits.push({
      employee: employee._id,
      type: 'paternite',
      joursAutorisee: 11,
      estPaye: true
    });
  }

 
    droits.push({
      employee: employee._id,
      type: 'sans_solde',
      estPaye: false
    });
  
  await DroitConge.insertMany(droits);
};

// creer un droit de congé
export const createCustomRights = async (req, res) => {
  try {
    const { employeeId, droits } = req.body;

    const droitsFormates = droits.map(d => ({
      employee: employeeId,
      type: d.type,
      joursAutorisee: d.joursAutorisee,
      estPaye: d.estPaye
    }));

    await DroitConge.insertMany(droitsFormates);

    res.status(201).json({ success: true, message: 'Droits de congé personnalisés créés.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



