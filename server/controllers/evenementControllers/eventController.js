import evenementModel from "../../models/evenementModel.js";

export const createevenement = async (req, res) => {
    const { titre, description, date_debut, date_fin, lieu } = req.body;
    const organisation = req.user.organisation;
  
    if (!titre || !date_debut || !date_fin) {
      return res.status(400).json({
        success: false,
        message: 'Informations incomplètes.'
      });
    }
  
    try {
      const evenement = new evenementModel({ titre, description, date_debut, date_fin, lieu, organisation });
      await evenement.save();
      res.status(201).json({ success: true, message: 'Evénement enregistré avec succès.', evenement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const getevenements = async (req, res) => {
    const organisation = req.user.organisation;
  
    try {
      const evenements = await evenementModel.find({ organisation });
      res.status(200).json({ success: true, evenements });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const getevenementById = async (req, res) => {
    const { id } = req.params;
    const organisation = req.user.organisation;
  
    try {
      const evenement = await evenementModel.findOne({ _id: id, organisation });
      if (!evenement) {
        return res.status(404).json({ success: false, message: 'Evénement introuvable.' });
      }
      res.status(200).json({ success: true, evenement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const updateevenement = async (req, res) => {
    const { id } = req.params;
    const organisation = req.user.organisation;
    const { titre, description, date_debut, date_fin, lieu } = req.body;
  
    try {
      const evenement = await evenementModel.findOneAndUpdate(
        { _id: id, organisation },
        { titre, description, date_debut, date_fin, lieu },
        { new: true }
      );
      if (!evenement) {
        return res.status(404).json({ success: false, message: 'Evénement introuvable.' });
      }
      res.status(200).json({ success: true, evenement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const deleteevenement = async (req, res) => {
    const { id } = req.params;
    const organisation = req.user.organisation;
  
    try {
      await evenementModel.delete({ _id: id, organisation });
      res.status(200).json({ success: true, message: 'Evénement supprimé avec succès.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  