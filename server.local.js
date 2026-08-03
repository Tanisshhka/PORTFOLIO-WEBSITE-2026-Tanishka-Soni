const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Contact form endpoint
app.post('/api/send-message', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
    }

    // Create transporter using Gmail
    // IMPORTANT: Use App Password, not regular password
    // Go to: Google Account > Security > 2-Step Verification > App Passwords
    // Generate an app password and paste it below
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'thstanu13@gmail.com',
            pass: 'fpre ozvv cdqv hwqo'
        }
    });

    // Email to Tanishka
    const mailOptions = {
        from: `"Portfolio Contact Form" <thstanu13@gmail.com>`,
        to: 'thstanu13@gmail.com',
        replyTo: email,
        subject: `Portfolio Inquiry: ${subject || 'New Message from ' + name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f7; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                    .header { background: linear-gradient(135deg, #7c3aed, #2563eb, #0891b2); padding: 30px; text-align: center; }
                    .header h1 { color: #fff; margin: 0; font-size: 22px; }
                    .header p { color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 13px; }
                    .content { padding: 30px; }
                    .field { margin-bottom: 20px; }
                    .field-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #7c3aed; font-weight: 600; margin-bottom: 6px; }
                    .field-value { font-size: 15px; color: #1a1a2e; line-height: 1.6; background: #f8f9ff; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #7c3aed; }
                    .message-box { background: #f8f9ff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 10px; }
                    .footer { padding: 20px 30px; background: #f8f9ff; text-align: center; border-top: 1px solid #e5e7eb; }
                    .footer p { margin: 0; font-size: 12px; color: #999; }
                    .btn-reply { display: inline-block; background: linear-gradient(135deg, #7c3aed, #2563eb); color: #fff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📬 New Message from Portfolio</h1>
                        <p>You have received a new message through your portfolio contact form</p>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="field-label">From</div>
                            <div class="field-value">${name}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">Email</div>
                            <div class="field-value">${email}</div>
                        </div>
                        ${subject ? `
                        <div class="field">
                            <div class="field-label">Subject</div>
                            <div class="field-value">${subject}</div>
                        </div>
                        ` : ''}
                        <div class="field">
                            <div class="field-label">Message</div>
                            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
                        </div>
                        <a href="mailto:${email}?subject=Re: ${subject || 'Your Portfolio Inquiry'}" class="btn-reply">Reply to ${name}</a>
                    </div>
                    <div class="footer">
                        <p>Sent from Tanishka Soni's Portfolio Contact Form</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    // Auto-reply to the sender
    const autoReplyOptions = {
        from: `"Tanishka Soni" <thstanu13@gmail.com>`,
        to: email,
        subject: `Thanks for reaching out, ${name}! 🎉`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f7; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
                    .header { background: linear-gradient(135deg, #7c3aed, #2563eb, #0891b2); padding: 30px; text-align: center; }
                    .header h1 { color: #fff; margin: 0; font-size: 22px; }
                    .content { padding: 30px; }
                    .content p { font-size: 15px; color: #4a4a6a; line-height: 1.8; }
                    .highlight { color: #7c3aed; font-weight: 600; }
                    .footer { padding: 20px 30px; background: #f8f9ff; text-align: center; border-top: 1px solid #e5e7eb; }
                    .footer p { margin: 0; font-size: 12px; color: #999; }
                    .social-links { margin: 20px 0; }
                    .social-links a { display: inline-block; margin: 0 8px; padding: 8px 16px; background: #f8f9ff; border-radius: 8px; color: #7c3aed; text-decoration: none; font-size: 13px; border: 1px solid #e5e7eb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Hey ${name}! 👋</h1>
                    </div>
                    <div class="content">
                        <p>Thank you so much for reaching out through my portfolio! I really appreciate your interest.</p>
                        <p>I've received your message and will get back to you as soon as possible. In the meantime, feel free to connect with me on:</p>
                        <div class="social-links">
                            <a href="https://github.com/Tanisshhka">GitHub</a>
                            <a href="https://www.linkedin.com/in/tanishka-soni-194631347/">LinkedIn</a>
                        </div>
                        <p>Looking forward to connecting with you!</p>
                        <p>Best regards,<br><span class="highlight">Tanishka Soni</span><br>Full Stack Developer | AI Enthusiast</p>
                    </div>
                    <div class="footer">
                        <p>This is an auto-reply from Tanishka Soni's Portfolio</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        // Send email to Tanishka
        await transporter.sendMail(mailOptions);

        // Send auto-reply to sender
        await transporter.sendMail(autoReplyOptions);

        res.json({ success: true, message: 'Message sent successfully! Check your email for confirmation.' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 Tanishka's Portfolio Server Running!`);
    console.log(`🌐 Open: http://localhost:${PORT}`);
    console.log(`📬 Contact form ready to receive messages\n`);
});
