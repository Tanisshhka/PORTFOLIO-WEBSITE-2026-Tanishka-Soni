const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'thstanu13@gmail.com',
            pass: 'vitfbqagvnqabwgm'
        }
    });

    const mailOptions = {
        from: `"Portfolio Contact" <thstanu13@gmail.com>`,
        to: 'thstanu13@gmail.com',
        replyTo: email,
        subject: `Portfolio: ${subject || 'Message from ' + name}`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                <div style="background:linear-gradient(135deg,#7c3aed,#2563eb,#0891b2);padding:30px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:22px;">New Message from Portfolio</h1>
                </div>
                <div style="padding:30px;">
                    <p style="font-size:14px;color:#666;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">From</p>
                    <p style="font-size:16px;background:#f8f9ff;padding:12px;border-radius:8px;border-left:3px solid #7c3aed;">${name}</p>
                    
                    <p style="font-size:14px;color:#666;margin-bottom:8px;margin-top:20px;text-transform:uppercase;letter-spacing:1px;">Email</p>
                    <p style="font-size:16px;background:#f8f9ff;padding:12px;border-radius:8px;border-left:3px solid #7c3aed;">${email}</p>
                    
                    ${subject ? `<p style="font-size:14px;color:#666;margin-bottom:8px;margin-top:20px;text-transform:uppercase;letter-spacing:1px;">Subject</p>
                    <p style="font-size:16px;background:#f8f9ff;padding:12px;border-radius:8px;border-left:3px solid #7c3aed;">${subject}</p>` : ''}
                    
                    <p style="font-size:14px;color:#666;margin-bottom:8px;margin-top:20px;text-transform:uppercase;letter-spacing:1px;">Message</p>
                    <div style="background:#f8f9ff;padding:20px;border-radius:8px;border:1px solid #e5e7eb;">${message.replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        `
    };

    const autoReply = {
        from: `"Tanishka Soni" <thstanu13@gmail.com>`,
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                <div style="background:linear-gradient(135deg,#7c3aed,#2563eb,#0891b2);padding:30px;text-align:center;">
                    <h1 style="color:#fff;margin:0;font-size:22px;">Hey ${name}!</h1>
                </div>
                <div style="padding:30px;">
                    <p style="font-size:15px;color:#4a4a6a;line-height:1.8;">Thank you for reaching out through my portfolio! I've received your message and will get back to you soon.</p>
                    <p style="font-size:15px;color:#4a4a6a;line-height:1.8;">Meanwhile, feel free to connect with me on:</p>
                    <p style="margin:20px 0;">
                        <a href="https://github.com/Tanisshhka" style="display:inline-block;margin:0 8px;padding:10px 20px;background:#f8f9ff;border-radius:8px;color:#7c3aed;text-decoration:none;font-size:14px;border:1px solid #e5e7eb;">GitHub</a>
                        <a href="https://www.linkedin.com/in/tanishka-soni-194631347/" style="display:inline-block;margin:0 8px;padding:10px 20px;background:#f8f9ff;border-radius:8px;color:#7c3aed;text-decoration:none;font-size:14px;border:1px solid #e5e7eb;">LinkedIn</a>
                    </p>
                    <p style="font-size:15px;color:#4a4a6a;line-height:1.8;">Best regards,<br><strong style="color:#7c3aed;">Tanishka Soni</strong></p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(autoReply);
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({ success: false, error: 'Failed to send message.' });
    }
};
