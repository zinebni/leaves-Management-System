import DroitConge from "../models/droitCongeModel.js";

export const checkAndResetDroitCongeAnnuel = async (employee) => {
  const dateActuelle = new Date();
  const moisActuel = dateActuelle.getMonth(); // 0 = janvier, 5 = juin
  const jourActuel = dateActuelle.getDate();
  const anneeActuelle = dateActuelle.getFullYear();
  const anneeDerniereMiseAJour = employee.anneeDerniereMiseAJour || 0;

  // Vérifie si on est le 1er juin et que l’année n’a pas encore été mise à jour
  if ( moisActuel === 5 && jourActuel === 1 && anneeDerniereMiseAJour < anneeActuelle) {
    const droitConges = await DroitConge.find({ employee: employee._id });
    
    for (const droit of droitConges) {
      droit.joursPris = 0;
      await droit.save();
      
    }
    console.log(`➕ Mis à jour des droits  pour ${employee.nom}`)
    employee.anneeDerniereMiseAJour = anneeActuelle;
    await employee.save();

    console.log(`Droits de congé réinitialisés pour ${employee.nom} le 1er juin ${anneeActuelle}`);
  }
};
