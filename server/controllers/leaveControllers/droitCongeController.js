import DroitConge from '../../models/droitCongeModel.js';
import Employee from '../../models/employeeModel.js';
import { isEligibleForLeave } from '../../utils/isEligibleForLeave.js';


//get leave rights by employee
export const getLeaveRightsByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const droits = await DroitConge.find({ employee: employeeId },{createdAt:0,updatedAt:0,__v:0}).populate("employee");
    res.status(200).json({ success: true, droits });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get leave rights by type for an employee
export const getLeaveRightsByType = async (req, res) => {
  const { employeeId, type } = req.params;
  try {
    const droits = await DroitConge.find({ employee: employeeId, type },{createdAt:0,updatedAt:0,__v:0}).populate("employee");
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

    //droit maternité
    if (employee.sexe === 'Femme' && employee.nombreEnfants > 0) {
      droits.push({
        employee: employee._id,
        type: 'maternite',
        joursAutorisee: 98,
        estPaye: true
      });
    }
    //droit paternité
    if (employee.sexe === 'Homme' && employee.nombreEnfants > 0) {
      droits.push({
        employee: employee._id,
        type: 'paternite',
        joursAutorisee: 3,
        estPaye: true
      });
    }
    //droit mariage
    if(employee.situationFamiliale === 'celibataire'){
      droits.push({
        employee: employee._id,
        type: 'Mariage du salarié',
        joursAutorisee: 4,
        estPaye: true
      });
    }

    //droits sans solde
    droits.push({
      employee: employee._id,
      type: 'sans_solde',
      estPaye: false
    });

    //droit maladie
    droits.push({
      employee: employee._id,
      type: 'maladie',
      estPaye: false
    });

    //droit examen
    droits.push({
      employee: employee._id,
      type: 'examen',
      estPaye: false
    });

    //droit Décès 
    droits.push({
      employee: employee._id,
      type: 'Décès (conjoint, parent, enfant)',
      joursAutorisee: 3,
      estPaye: false
    });
    droits.push({
      employee: employee._id,
      type: 'Décès (frère, sœur, beau-parent)',
      joursAutorisee: 2,
      estPaye: false
    });

    //droit exceptionnel
    droits.push({
      employee: employee._id,
      type: 'exceptionnel',
      estPaye: true
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

// creer un droit  au congé
export const createCustomRight = async (req, res) => {
  try {
    const {employeeId} = req.params;
    const {type,joursAutorisee,estPaye} = req.body;

    if (type && joursAutorisee && estPaye ) {
        await DroitConge.deleteMany({ employee: employeeId, type });
        const droits = new DroitConge({
            employee: employeeId,
            type,
            joursAutorisee,
            estPaye,
        });

        await droits.save();

        res.status(201).json({ success: true, message: `Droits au congé ${droits.type} créés.` });
    } else {
        res.status(400).json({ success: false, message: 'Informations incomplètes.' });
    }
        
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// creer un droit  au congé pour tous les employés
export const createCustomRightForAllEmployees = async (req, res) => {
  try {
    const {type,joursAutorisee,estPaye} = req.body;

    if (type && joursAutorisee && estPaye ) {
        const employees = await Employee.find({});

        for (const employee of employees) {
            await DroitConge.deleteMany({ employee: employee._id, type });

            const droits = new DroitConge({
                employee: employee._id,
                type,
                joursAutorisee,
                estPaye,
            });

            await droits.save();
        }

        res.status(201).json({ success: true, message: `Droits au congé ${type} créés pour tous les employés.` });
    } else {
        res.status(400).json({ success: false, message: 'Informations incomplètes.' });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 

//delete droitConge by id à tous les employés
export const deleteCustomRightForAllEmployees = async (req, res) => {
  try {
    const { type } = req.body;

    if (type) {
      await DroitConge.deleteMany({ type });

      res.status(200).json({ success: true, message: `Droits au congé ${type} supprimés pour tous les employés.` });
    } else {
      res.status(400).json({ success: false, message: 'Informations incomplètes.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//delet droitConge by id à un employé
export const deleteRightsForEmployee = async (req, res) => {
  const { employeeId, droitId } = req.params;
  const droit = await DroitConge.findOne({_id:droitId, employee: employeeId});
  if (!droit) {
    return res.status(404).json({ success: false, message: "Droit de congé introuvable pour cet employé." });
  }
  try {
    
    await DroitConge.findOneAndDelete({_id:droitId, employee: employeeId});

    res.status(200).json({ success: true, message: 'Droit au congé supprimé.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


