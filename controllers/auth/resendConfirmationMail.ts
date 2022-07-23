import User, { IUser } from '../../models/UserSchema'
import jwt from 'jsonwebtoken'
import { sendConfirmationEmail } from '../../config/mailer'
import { Request, Response } from 'express'

const resendConfirmationMail = async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).send({ message: 'No user ID provided.' })
        const user: IUser | null = await User.findById(req.params.id)

        if (!user) return res.status(400).send({ message: 'User Not Found.' })
        if (user.status === 'Active') return res.status(400).send({ message: 'User already verified.' })

        const timestamp: number = new Date().getTime()
        const confirmationCode: string = jwt.sign({ mail: user.mail, timestamp }, process.env.TOKEN_KEY as string)

        user.confirmationCode = confirmationCode
        await user.save()

        sendConfirmationEmail(user.username, user.mail, confirmationCode)
        return res.send({ message: 'Verification e-mail sent.' })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default resendConfirmationMail