import DroitConge from '../../models/droitCongeModel.js';
import { isEligibleForLeave } from '../../utils/isEligibleForLeave.js';


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
 
  try {
    const droits = [];

    // Calcule de l'ancienneté en mois
    const now = new Date();
    const recrutementDate = new Date(employee.dateDeRecrutement);
    const moisTravaille = (now.getFullYear() - recrutementDate.getFullYear()) * 12 +
                          (now.getMonth() - recrutementDate.getMonth());

    // Congé annuel uniquement après 6 mois
    if (isEligibleForLeave(employee.dateDeRecrutement)) {
      let joursAnnuel = 18; //1,5 jour × 12 mois = 18 jours/an
      const nb5ans = Math.floor(moisTravaille / 60); // 60 mois = 5 ans
      joursAnnuel += nb5ans * 1.5;
      joursAnnuel = Math.min(joursAnnuel, 30);

      droits.push({
        employee: employee._id,
        type: 'annuel',
        joursAutorisee: joursAnnuel,
        estPaye: true
      });
    }

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
    //pour eviter les doublants
    await DroitConge.deleteMany({ employee: employee._id });
    //la creation des droits
    await DroitConge.insertMany(droits);

    return { success: true, message: 'Droits de congé par défaut créés.' };

  } catch (error) {
    console.error("Erreur création droits:", error);
    return { success: false, message: error.message };
  }
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



