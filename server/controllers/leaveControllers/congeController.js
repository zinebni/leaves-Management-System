import dayjs from "dayjs";
import Conge from "../../models/congeModel.js";
import DroitConge from "../../models/droitCongeModel.js";
//Employé---------------------------------------------------------Employé :

// createLeaveRequest() 
export const createLeaveRequest = async (req, res) => {
  const  employeeId  = req.user.id;
  const organisation = req.user.organisation;
  const { date_debut, date_fin, motif, commentaire} = req.body;
  const justificatifs = req.files ? req.files.map(f => f.filename) : [];  //passer par multer

  if (!date_debut || !date_fin  || !motif || !commentaire) {
    return res.status(400).json({ success: false, message: 'Informations incomplètes.' });
  } 
  if (date_debut > date_fin) {
    return res.status(400).json({ success: false, message: 'La date de début doit être antérieure à la date de fin.' });
  }

  const nombreDeJoursDemande=  dayjs(date_fin).diff(dayjs(date_debut), 'day') + 1; //dayjs(date_fin).diff(dayjs(date_debut), 'day') Cette expression calcule la différence en jours entiers entre les deux dates, en excluant la date de début pour cela on ajoute +1
  
  const droitConge = await DroitConge.findOne({_id:motif, employee: employeeId, organisation : organisation});
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
      commentaire,
      justificatif : justificatifs
    });

    await conge.save();

    res.status(201).json({ success: true, message: 'Congé enregistré avec succès.', conge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// getMyLeaveRequests() 
export const getMyLeaveRequests = async (req, res) => {
  
  const employeeId = req.user.id;
  console.log(employeeId);
  if (!employeeId) {
    res.status(400).json({ success: false, message: 'utilisateur non trouvé.' });
  }
  try {
    const conges = await Conge.find({ employee: employeeId },{createdAt:0,updatedAt:0,__v:0,deleted:0}).populate({path: 'motif', select: 'type'});
    res.status(200).json({ success: true, conges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// cancelLeaveRequest(id) 
export const cancelLeaveRequest = async (req, res) => {
  const  {id} = req.params;
  const employeeId = req.user.id;
  if (!employeeId) {
    res.status(400).json({ success: false, message: 'utilisateur non trouvé.' });
  }
  try {
    const conge = await Conge.delete(
      { _id: id, employee: employeeId }
    );
    if (!conge) {
      return res.status(404).json({ success: false, message: 'Demande de congé non trouvée.' });
    }
    res.status(200).json({ success: true, message: 'Demande de congé annulée avec succès.', conge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get my  deleted leave requests
export const getMyLeaveRequestsDeleted = async (req, res) => {
  const  employeeId = req.user.id;
  if (!employeeId) {
    res.status(400).json({ success: false, message: 'utilisateur non trouvé.' });
  }
  try {
    const conges = await Conge.findDeleted({ employee: employeeId }, {createdAt:0, updatedAt:0, __v:0}).populate({path: 'motif', select: 'type'});
    res.status(200).json({ success: true, conges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get leave requests by status
export const getMyLeaveRequestsByStatus = async (req, res) => {
  const employeeId  = req.user.id;
  const { status } = req.params;
  if (!employeeId) {
    res.status(400).json({ success: false, message: 'utilisateur non trouvé.' });
  }
  try {
    const conges = await Conge.find({ employee: employeeId, status: status }, {createdAt:0, updatedAt:0, __v:0, deleted:0}).populate({path: 'motif', select: 'type'});
    res.status(200).json({ success: true, conges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//RH------------------------------------------------------RH :
    // getAllLeaveRequests() 
    // getLeaveRequestById(id)
    // approveLeaveRequest(id) 
    // rejectLeaveRequest(id) 

