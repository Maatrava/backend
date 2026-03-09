export const sendResetPasswordEmail = async (email, token) => {
    console.log(`[EMAIL SERVICE] Sending reset password email to ${email}`);
    console.log(`[EMAIL SERVICE] Reset link: http://localhost:5173/reset-password?token=${token}`);
    // In a real app, use nodemailer or SendGrid here
    return true;
};
