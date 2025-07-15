import nodeCron from 'node-cron';
import DroitConge from '../models/droitCongeModel.js';
import { isEligibleForLeave } from '../utils/isEligibleForLeave.js';
import Employee from '../models/employeeModel.js';


//Tâche planifiée pour mettre à jour les droits de congé annuel tous les jours selon l'ancienneté

nodeCron.schedule('* * * * *', async () => {
  console.log("Lancement de la mise à jour automatique des droits de congé...");
  const employees = await Employee.find();

  //mise à jour des droits de congé annuel
    /* on parcours tous les employés et on crées un tableau de promesses asynchrones (Promise[])
    Pour chaque emp, on écris une fonction asynchrone qui fera le calcul des jours annuels et met à jour le droit de congé annuel correspondant
    Cette fonction retourne une promesse automatiquement car elle est async == Promise.resolve() == await new Promise 
    Une fois que toutes les fonctions async sont prêtes (une pour chaque employé), Promise.all() va les exécuter en parallèle.
    Et await attend que toutes soient terminées. */
  await Promise.all(employees.map(async (emp) => {
    const now = new Date();
    const recrutement = new Date(emp.dateDeRecrutement);
    const mois = (now.getFullYear() - recrutement.getFullYear()) * 12 + (now.getMonth() - recrutement.getMonth());

    if (isEligibleForLeave(emp.dateDeRecrutement)) {
      // Calcul des jours annuels selon ancienneté
      let joursAnnuel = 18;
      const nb5ans = Math.floor(mois / 60); // tous les 5 ans (5ans = 5*12 = 60 mois)
      joursAnnuel += nb5ans * 1.5;
      joursAnnuel = Math.min(joursAnnuel, 30);

      // Vérifier s'il a déjà un droit de congé annuel
      const existingLeave = await DroitConge.findOne({
        employee: emp._id,
        type: 'annuel'
      });

      if (existingLeave) {
        // Mettre à jour
        await DroitConge.findByIdAndUpdate(existingLeave._id, {
          joursAutorisee: joursAnnuel
        });
      } else {
        // Créer si pas encore existant
        await DroitConge.create({
          employee: emp._id,
          type: 'annuel',
          joursAutorisee: joursAnnuel,
          estPaye: true
        });
      }
    }
  }));


  console.log("✅ Mise à jour terminée");
});