import DroitConge from '../../models/droitCongeModel.js';
import { isEligibleForLeave } from '../../utils/isEligibleForLeave.js';

export const createDefaultLeaveRights = async (employee) => {
  if (!isEligibleForLeave(employee.dateDeRecrutement)) return;
  
  //calcule de l'anciennete
  const now = new Date();
  const recrutementDate = new Date(employee.dateDeRecrutement);
  const anciennete = now.getFullYear() - recrutementDate.getFullYear();

  const droits = [];

  droits.push({
    employee: employee._id,
    type: 'annuel',
    joursAutorisee: anciennete > 5 ? 30 : 24,
    estPaye: true
  });

  if (employee.sexe === 'Femme') {
    droits.push({
      employee: employee._id,
      type: 'maternite',
      joursAutorisee: 98,
      estPaye: true
    });
  }

  if (employee.sexe === 'Homme') {
    droits.push({
      employee: employee._id,
      type: 'paternite',
      joursAutorisee: 11,
      estPaye: true
    });
  }

  if (employee.situationFamiliale !== 'marié(e)') {
    droits.push({
      employee: employee._id,
      type: 'sans_solde',
      joursAutorisee: 4,
      estPaye: false
    });
  }

  await DroitConge.insertMany(droits);
};
