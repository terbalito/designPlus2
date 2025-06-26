// server.js
// ---------------------------
// Journalisation maximale pour debug complet

console.log('🟢 [START] server.js démarre');

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Création de l'app Express
const app = express();
app.use(cors());
app.use(express.json());

// Transporteur Nodemailer (Ethereal)
let transporter;
nodemailer.createTestAccount()
  .then(testAccount => {
    console.log('🛠️ [SMTP] Compte de test créé:', testAccount.user);
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('✅ [SMTP] Transporteur configuré');
  })
  .catch(err => {
    console.error('❌ [SMTP] Erreur création compte de test:', err);
  });

// Point d'entrée santé
app.get('/', (req, res) => {
  console.log('🔍 [GET /] Health check reçu');
  res.send('🟢 API Contact en ligne');
});

// Route POST /api/contact
app.post('/api/contact', async (req, res) => {
  console.log('✉️ [POST /api/contact] Requête reçue:', req.body);
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    console.warn('⚠️ [POST /api/contact] Données incomplètes');
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: 'contact@designplus.cd',
      subject: `[FORM TEST] ${subject}`,
      text: message,
      html: `<p>${message.replace(/\n/g,'<br>')}</p><hr><p>Expéditeur: ${name} (${email})</p>`
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('📨 [MAIL SENT] Message envoyé. Preview URL:', previewUrl);
    res.json({ success: true, previewUrl });
  } catch (err) {
    console.error('❌ [MAIL ERROR] Échec envoi mail:', err);
    res.status(500).json({ error: 'Impossible d\'envoyer le message.' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 [LISTEN] Serveur démarré sur http://localhost:${PORT}`);
});
