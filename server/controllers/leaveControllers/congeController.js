import dayjs from "dayjs";
import Conge from "../../models/congeModel.js";
import DroitConge from "../../models/droitCongeModel.js";
import mongoose from "mongoose";
//Employé---------------------------------------------------------Employé :

// createLeaveRequest() 
export const createLeaveRequest = async (req, res) => {
  const  employeeId  = req.user.id;
  const { date_debut, date_fin, motif, commentaire} = req.body;
  const justificatifs = req.files ? req.files.map(f => f.filename) : [];  //passer par multer

  if (!date_debut || !date_fin  || !motif || !commentaire) {
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
export const getAllLeaveRequests = async (req, res) => {
  const organisationId =  new mongoose.Types.ObjectId(req.user.organisation);
  if(!organisationId){
    return res.status(400).json({ success: false, message: 'organisation non trouvée.' });
  }
  try {
    const conges = await Conge.aggregate([
        {
          $lookup: {
            from: 'employees', 
            localField: 'employee',
            foreignField: '_id',
            as: 'employee'
          }
        },
        { $unwind: '$employee' },
        {
          $match: {
            'employee.organisation': organisationId
          }
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
          }
        }
      ]) 
    res.status(200).json({ success: true, conges , count : conges.length});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// getLeaveRequestById(id conge)
export const getLeaveRequestById = async (req, res) => {
  const { id } = req.params;
  const organisation = req.user.organisation;
  try {
    const conge = await Conge.findOne({ _id: id}, {createdAt:0, updatedAt:0, __v:0, deleted:0}).populate({path: 'motif', select: 'type'}).populate({path: 'employee', select: 'nom prenom department'});
    if (!conge) {
      return res.status(404).json({ success: false, message: 'Demande de congé non trouvée.' });
    }
    res.status(200).json({ success: true, conge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//get all leave requests by status
export const getAllLeaveRequestsByStatus = async (req, res) => {
  const { status } = req.params;
  const organisationId =  new mongoose.Types.ObjectId(req.user.organisation);
  if(!organisationId){
    return res.status(400).json({ success: false, message: 'organisation non trouvée.' });
  }
  try {
    const conges = await Conge.aggregate([
        {
          $lookup: {
            from: 'employees', 
            localField: 'employee',
            foreignField: '_id',
            as: 'employee'
          }
        },
        { $unwind: '$employee' },
        {
          $match: {
            'employee.organisation': organisationId,
             status: status
          }
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
          }
        }
      ]) 
    res.status(200).json({ success: true, conges , count : conges.length});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  
};

//get all leave requests by employee
export const getAllLeaveRequestsByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const organisationId =  new mongoose.Types.ObjectId(req.user.organisation);
  if(!organisationId){
    return res.status(400).json({ success: false, message: 'organisation non trouvée.' });
  }
  try {
    const conges = await Conge.aggregate([
        {
          $lookup: {
            from: 'employees', 
            localField: 'employee',
            foreignField: '_id',
            as: 'employee'
          }
        },
        { $unwind: '$employee' },
        {
          $match: {
            'employee.organisation': organisationId,
            'employee._id': new mongoose.Types.ObjectId(employeeId)
          }
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
          }
        }
      ]) 
    res.status(200).json({ success: true, conges , count : conges.length});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
  
};  

//get all leave requests by department
export const getAllLeaveRequestsByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const organisationId =  new mongoose.Types.ObjectId(req.user.organisation);
  if(!organisationId){
    return res.status(400).json({ success: false, message: 'organisation non trouvée.' });
  }
  try {
    const conges = await Conge.aggregate([
        {
          $lookup: {
            from: 'employees',
            localField: 'employee',
            foreignField: '_id',
            as: 'employee'
          }
        },
        { $unwind: '$employee' },
        {
          $match: {
            'employee.organisation': organisationId,
            'employee.department': new mongoose.Types.ObjectId(departmentId)
          }
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
          }
        }
      ])
    res.status(200).json({ success: true, conges, count : conges.length});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};

//get all leave requests by department and status
export const getAllLeaveRequestsByDepartmentAndStatus = async (req, res) => {
  const { departmentId, status } = req.params;
  const organisationId =  new mongoose.Types.ObjectId(req.user.organisation);
  if(!organisationId){
    return res.status(400).json({ success: false, message: 'organisation non trouvée.' });
  }
  try {
    const conges = await Conge.aggregate([
        {
          $lookup: {
            from: 'employees',
            localField: 'employee',
            foreignField: '_id',
            as: 'employee'
          }
        },
        { $unwind: '$employee' },
        {
          $match: {
            'employee.organisation': organisationId,
            'employee.department': new mongoose.Types.ObjectId(departmentId),
            status: status
          }
        },
        {
          $project: {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
          }
        }
      ])
    res.status(200).json({ success: true, conges, count : conges.length});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

};
// approveLeaveRequest(id) 
// rejectLeaveRequest(id) 

