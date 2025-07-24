import nodeCron from 'node-cron';
import DroitConge from '../models/droitCongeModel.js';
import Employee from '../models/employeeModel.js';
import { checkAndResetDroitCongeAnnuel } from '../utils/checkAndResetDroitCongeAnnuel.js';


//Tâche planifiée pour réinitialiser les jours pris de congé annuel tous les 1er juin

nodeCron.schedule('0 0 0 1 6 *', async () => {
    try {
        console.log("🔄 Lancement de la réinitialisation des jours pris des droit de congés...");

        const employees = await Employee.find();

        console.log(`${employees.length} employés trouvés.`);

        for (const employee of employees) {
            await checkAndResetDroitCongeAnnuel(employee);
        }

        console.log("✅ Réinitialisation terminée.");
    } catch (error) {
        console.error("Erreur lors de la réinitialisation des jours pris des droit de congés :", error);
    }

  
});