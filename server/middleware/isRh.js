
const isRhMiddleware = (req, res, next) => {
  try {
    const user = req.user; // Injecté par le authMiddleware après vérif JWT

    if (!user || user.role !== 'RH') {
      console.log(user.role);
      return res.status(403).json({ success: false, message: 'Accès refusé. Réservé au RH.' });
    }

    next(); // continuer si rôle valide
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export default isRhMiddleware;
