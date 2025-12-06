const { createTransporter, testEmailConnection } = require('../utils/emailService');

async function checkEmail(req, res) {
  try {
    const ok = await testEmailConnection();
    if (ok) {
      return res.json({ success: true, message: 'Email server connection verified' });
    }
    return res.status(500).json({ success: false, message: 'Email server connection failed' });
  } catch (err) {
    console.error('checkEmail error:', err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
}

module.exports = { checkEmail };

// Send a test email to the provided address (useful for debugging)
async function sendTestEmail(req, res) {
  try {
    const { email, code } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const testCode = code || Math.floor(100000 + Math.random() * 900000).toString();
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@incidentreporting.com',
      to: email,
      subject: 'Test Email from iReporter',
      html: `<p>This is a test email. Your test code is <strong>${testCode}</strong>.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Test email sent', info });
  } catch (err) {
    console.error('sendTestEmail error:', err);
    return res.status(500).json({ success: false, error: err?.message || String(err) });
  }
}

module.exports.sendTestEmail = sendTestEmail;
