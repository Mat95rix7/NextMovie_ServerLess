// utils/error-handler.js
function errorHandler(res, error) {
    console.error("Détail de l'erreur:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message || "Une erreur est survenue"
    });
  }
  
  module.exports = errorHandler;