const express = require('express');   // Express facilite la création de l'API
const bodyParser = require('body-parser');    // Pour extraire les informations des requêtes et les rendre utilisables
const mongoose = require('mongoose');     // Pour gérer notre base de donnée
const app = express();
const path = require('path');     // Pour gérer nos images
const rateLimit = require('express-rate-limit');  // Pour limiter les attaques brute
const helmet = require ('helmet');   

const saucesRoutes = require('./routes/sauces.js');   // Récupération des routes
const userRoutes = require('./routes/user.js');     

require('dotenv').config();      // protéger les clés du serveur mongoDB

const limiteur = rateLimit({
  windowMs: 15 * 60 * 1000,                       // 15 minutes
  max: 100,                                       // limite chaque IP à 3 requêtes par fenêtre
  message: "Vous avez été bloqué parceque vous vous êtes trompé 3 fois. Réessayer dans 15 minutes !"
});

app.use(limiteur);

mongoose.connect(process.env.DATABASE_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB Atlas réussie ! ʕ•ᴥ•ʔ'))
  .catch(() => console.log('Connexion à MongoDB Atlas échouée !'));
  
mongoose.set('useCreateIndex', true);   // Empeche le warning généré par la console



  app.use((req, res, next) => {     // Donne l'accès du backend au frontend  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
  });

app.use(helmet());

app.use(bodyParser.json());   //Transforme le corp de la requête en object Javascript utilisable 

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;
