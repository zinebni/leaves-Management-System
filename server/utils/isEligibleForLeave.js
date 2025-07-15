export const isEligibleForLeave = (dateDeRecrutement) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new Date(dateDeRecrutement) <= sixMonthsAgo;
};