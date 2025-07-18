const checkRole = (roles = []) => {
    
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès interdit" });
    }
    next();
  };
};

export default checkRole;
//exemple d'appelation
/*router.post('/conge/:id/approve', authMiddleware, checkRole(['rh', 'admin']), approveLeave);*/
