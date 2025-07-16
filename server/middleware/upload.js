import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Créer le dossier s'il n'existe pas
const uploadFolder = './uploads';
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configuration de stockage == générer un nom de fichier unique pour chaque fichier uploadé avec Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); //Indique à multer d’enregistrer tous les fichiers dans le dossier uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); //extract l'extension du fichier original
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

//creer un middleware multer
const upload = multer({ storage }); //On dit à multer d’utiliser notre configuration de storage personnalisée.

export default upload;

/* 
`cb` = **callback function** : C’est une fonction que Multer **attend que tu appelles** pour lui dire :
        - Où stocker le fichier (dans `destination`)
        - Comment nommer le fichier (dans `filename`) 
    *cb(error, result)
        - cb(new Error('Message')) : si une erreur s’est produite pendant le stockage du fichier
        - cb(null, valeur) : `result` : si tout s’est bien passé, c’est le chemin du fichier stocké sur le disque

*/