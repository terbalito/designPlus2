const express = require('express');
const app = express();
const path = require('path');

// Configurer le sous-domaine admin
app.use('/admin', express.static(path.join(__dirname, 'admin')));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});