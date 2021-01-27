const multer = require('multer');             // Package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP

const MIME_TYPES = {                // On définis les formats authorisés 
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({            // Fonction diskStorage pour enregistrer sur le disk
  destination: (req, file, callback) => {       // Element expliquant dans quelle dossier enregistrer les fichiers
    callback(null, 'images');
  },
  filename: (req, file, callback) => {          // Element expliquant quelle nom de fichier utiliser
    const extension = MIME_TYPES[file.mimetype];    // Création de l'extension du fichier correspondant au minetype envoyé par le frontend
    callback(null, 'sauceImg' + Date.now() + '.' + extension);    // Nom du fichier + l'heure et la date d'enregistrement (pour rendre le fichier unique) + son extension
  }
});

module.exports = multer({storage: storage}).single('image');    // On exporte notre middlewares 
