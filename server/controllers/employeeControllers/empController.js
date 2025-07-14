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
    const { nom, prenom, verificationEmail, department, dateDeDepart } = req.body;
    try {
      const employee = await employeeModel.findByIdAndUpdate(
        id,
        { nom, prenom, verificationEmail, department, dateDeDepart},
        { new: true }
      );
      res.status(200).json({ success: true, employee });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

