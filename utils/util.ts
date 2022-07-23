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

export const sendPasswordReset = async (name: string, email: string, password: string) => {
    try {
        const res = await transporter.sendMail({
            from: user,
            to: email,
            subject: "Password Reset",
            html: `<h1>Password Reset</h1>
              <h2>Hello ${name}</h2>
              <p>Your new password: ${password}</p>
              </div>`,
        })
        return res
    } catch (e: any) {
        console.log(e)
    }
}

export const randomizer = (length: number) => {
    let result: string = '';
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const getSeniority = (birthday: Date) => {
    const ageDifMs: number = Date.now() - birthday.getTime()
    const ageDate: Date = new Date(ageDifMs)
    const age: number = Math.abs(ageDate.getUTCFullYear() - 1970)
    if (age < 0 || age > 200) return 'ERROR'
    if (age < 15) return 'Children'
    if (age < 18) return 'Youth'
    if (age < 24) return 'Young Adults'
    return 'Adults'
}