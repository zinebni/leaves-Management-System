import departmentModel from '../../models/departmentModel.js';

//create department
export const createDepartment = async (req, res) => {
    const { nom, description } = req.body;
  
    if (!nom) {
      return res.status(400).json({
        success: false,
        message: 'Informations incomplètes.'
      });
    }
  
    try {
      const department = new departmentModel({
        nom,
        description
      });
  
      await department.save();
  
      res.status(201).json({ success: true, message: 'Department enregistré avec succès.', department });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
//get all departments
export const getDepartments = async (req, res) => {
  try {
      const departments = await departmentModel.find();
      res.status(200).json({ success: true, departments });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

//supprimer un department
export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    await departmentModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Department supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};