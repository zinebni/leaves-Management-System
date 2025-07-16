import dayjs from "dayjs";
import Conge from "../../models/congeModel.js";
import DroitConge from "../../models/droitCongeModel.js";
//Employé :

// createLeaveRequest() 
export const createLeaveRequest = async (req, res) => {
  const { employeeId } = req.params;
  const { date_debut, date_fin, motif} = req.body;
  const justificatifs = req.files ? req.files.map(f => f.filename) : [];  //passer par multer

  if (!date_debut || !date_fin  || !motif) {
    return res.status(400).json({ success: false, message: 'Informations incomplètes.' });
  } 
  if (date_debut > date_fin) {
    return res.status(400).json({ success: false, message: 'La date de début doit être antérieure à la date de fin.' });
  }

  const nombreDeJoursDemande=  dayjs(date_fin).diff(dayjs(date_debut), 'day') + 1; //dayjs(date_fin).diff(dayjs(date_debut), 'day') Cette expression calcule la différence en jours entiers entre les deux dates, en excluant la date de début pour cela on ajoute +1
  
  const droitConge = await DroitConge.findOne({_id:motif, employee: employeeId});
  if (!droitConge) {
    return res.status(400).json({ message: "Droit de congé introuvable." });
  }
  
  if (droitConge.joursAutorisee - nombreDeJoursDemande <0) {
  return res.status(400).json({ message: "Pas assez de jours autorisé." });
  }

  try {
    const conge = new Conge({
      employee: employeeId,
      date_debut,
      date_fin,
      nombreDeJours : nombreDeJoursDemande,
      motif,
      justificatif : justificatifs
    });

    await conge.save();

    res.status(201).json({ success: true, message: 'Congé enregistré avec succès.', conge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// getMyLeaveRequests() 

// cancelLeaveRequest(id) 

//RH :
    // getAllLeaveRequests() 

    // approveLeaveRequest(id) 

    // rejectLeaveRequest(id) 

    // getLeaveRequestById(id) (voir une demande précise) 