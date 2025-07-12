
const isOrgMiddleware = (req, res, next) => {
  try {
    const user = req.user; // Injecté par le authMiddleware après vérif JWT

    if (!user || user.role !== 'org') {
      return res.status(403).json({ success: false, message: 'Accès refusé. Réservé a l\' admin de l\'organisation.' });
    }

    next(); // continuer si rôle valide
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

export default isOrgMiddleware;
