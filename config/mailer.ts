import nodemailer from "nodemailer"

const user: string = process.env.USER as string;
const pass: string = process.env.PASS as string;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user, pass
    },
});

export const sendConfirmationEmail = async (name: string, email: string, confirmationCode: string) => {
    try {
        const res = await transporter.sendMail({
            from: user,
            to: email,
            subject: "Confirm your account",
            html: `<h1>Email Confirmation</h1>
              <h2>Hello ${name}</h2>
              <p>Thank you for creating an account at Sports-Complex! Please confirm your email by clicking on the following link</p>
              <a href=http://localhost:3000/api/auth/confirm/${confirmationCode}> Click here</a>
              </div>`,
        })
        return res
    } catch (e: any) {
        console.log(e)
    }
}