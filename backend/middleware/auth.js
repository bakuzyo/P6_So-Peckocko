const jwt = require('jsonwebtoken');        // Module jsonwebtoken pour configurer les système de jetons

module.exports = (req, res, next) => {
  try {                                                             // Si le jeton correspond  
    const token = req.headers.authorization.split(' ')[1];          // Token attribué à l'utilisateur
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);  // Token comparé 
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      req.user = userId;
      next();
    }
  } catch {                             // Le jeton ne correspond pas
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};
