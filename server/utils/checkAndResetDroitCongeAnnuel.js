import DroitConge from "../models/droitCongeModel";

export const checkAndResetDroitCongeAnnuel = async (employee) => {
  const dateActuelle = new Date();
  const dateDeRecrutement = new Date(employee.dateDeRecrutement);
  const anneeActuelle = dateActuelle.getFullYear();
  const anneeDerniereMiseAJour = employee.anneeDerniereMiseAJour || dateDeRecrutement.getFullYear();

  if (anneeActuelle > anneeDerniereMiseAJour) {
    const droitConges = await DroitConge.find({ employee: employee._id});
    if (droitConges.length > 0) {
      for(const droit of droitConges){
        droit.joursPris = 0;
        await droit.save();
      }
    }
    console.log("Droits de congé réinitialisés pour l'année " + anneeActuelle);
    employee.anneeDerniereMiseAJour = anneeActuelle;
    await employee.save(); 
  }
};
