import departmentModel from '../../models/departmentModel.js';

//create department pour une organisation
export const createDepartment = async (req, res) => {
    const { nom, description } = req.body;
  
    if (!nom) {
      return res.status(400).json({
        success: false,
        message: 'Informations incomplètes.'
      });
    }
    
    try {
      const existingDepartment = await departmentModel.findOne({ nom, organisation: req.user.id });
      if (existingDepartment) {
        return res.status(409).json({ success: false, message: "Un department avec ce nom existe déjà." });
      }
      const department = new departmentModel({
        nom,
        description,
        organisation: req.user.id //id de l'organisation grace au middleware auth
      });
  
      await department.save();
  
      res.status(201).json({ success: true, message: 'Department enregistré avec succès.', department });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
//get all departments by organisation
export const getDepartments = async (req, res) => {
  try {
      const org_id = req.user.id; //id de l'organisation grace au middleware auth
      const departments = await departmentModel.findById({organisation: org_id}).populate(); //populate pour recuperer les employes de chaque department
      res.status(200).json({ success: true, departments });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

//update department by id
export const updateDepartment = async (req, res) => {
  const org_id = req.user.id;
  const { id } = req.params;
  const { nom, description } = req.body;
  try {
    const department = await departmentModel.findOneAndUpdate(
      { _id: id, organisation: org_id },
      { nom, description },
      { new: true }
    );
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department introuvable.' });
    }
    res.status(200).json({ success: true, department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//supprimer un department d'une organisation
export const deleteDepartment = async (req, res) => {
  const org_id = req.user.id;
  const { id } = req.params;
  try {
    await departmentModel.findByIdAndDelete({ _id: id, organisation: org_id });
    res.status(200).json({ success: true, message: 'Department supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

