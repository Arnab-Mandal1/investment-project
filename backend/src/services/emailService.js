const { Resend } = require('resend');
const env = require('../config/env');

const resend = new Resend(env.RESEND_API_KEY);

const sendPasswordResetEmail = async (toEmail, resetToken, userName) => {
    const resetURL = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
        from: 'Pro Investment <onboarding@resend.dev>',
        to: toEmail,
        subject: 'Reset Your Password — Pro Investment',
        html: `
            <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f9ff; border-radius: 12px;">
                <h2 style="color: #0b1c30; margin-bottom: 8px;">Password Reset Request</h2>
                <p style="color: #45464d;">Hi ${userName},</p>
                <p style="color: #45464d;">Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
                <a href="${resetURL}" style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: #006a61; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                    Reset Password
                </a>
                <p style="color: #76777d; font-size: 13px;">If you didn't request this, ignore this email. Your password won't change.</p>
                <p style="color: #76777d; font-size: 12px;">Link: ${resetURL}</p>
            </div>
        `,
    });
};

module.exports = { sendPasswordResetEmail };