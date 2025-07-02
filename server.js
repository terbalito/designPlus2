// server.js
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 1) CORS — autorise TOUTES origines en DEV
app.use(cors({ origin: '*' }));  // :contentReference[oaicite:3]{index=3}

// 2) JSON parsing
app.use(express.json());

// 3) Configuration SMTP pour Gmail (port 465, SSL/TLS implicite)
const transporter = nodemailer.createTransport({
  host:       process.env.SMTP_HOST,                  // smtp.gmail.com
  port:       Number(process.env.SMTP_PORT),          // 465
  secure:     process.env.SMTP_SECURE === 'true',     // true pour SSL :contentReference[oaicite:4]{index=4}
  auth: {
    user:     process.env.SMTP_USER,                  // ton.compte@gmail.com
    pass:     process.env.SMTP_PASS                   // mot de passe d’app Google
  },
  tls: { rejectUnauthorized: false }                   // pour éviter les problèmes de certificat auto-signé
});

// Vérifie la connexion SMTP dès le démarrage
transporter.verify()
  .then(() => console.log('✅ SMTP configuré correctement'))
  .catch(err => console.error('❌ Erreur SMTP:', err));

// 4) Route de test
app.get('/', (req, res) => {
  res.json({ success: true, message: 'API Contact OK' });
});

// 5) Route d’envoi de mail
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Tous les champs sont requis.' });
    }

    const mailOptions = {
      from:    `"${name}" <${email}>`,
      to:      process.env.CONTACT_EMAIL,
      subject: `[Contact Form] ${subject}`,
      text:    `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html:    `<p><strong>Nom:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>`
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Votre message a été envoyé avec succès.' });
  } catch (err) {
    console.error('Erreur envoi mail:', err);
    return res.status(500).json({ success: false, error: "Échec de l'envoi du message. Réessayez plus tard." });
  }
});

// 6) Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
