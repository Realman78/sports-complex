import User, { IUser } from '../../models/UserSchema'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendConfirmationEmail } from '../../config/mailer'
import { Request, Response } from 'express'
import { getSeniority } from '../../utils/util'


type UserBody = {
    username: string;
    password: string;
    mail: string;
    confirmationCode?: string;
    seniority: string;
    role: string;
    status?: string;
}

const postRegister = async (req: Request<{}, {}, { username: string, password: string, mail: string, birthdate: string, role: string | null }, {}>, res: Response) => {
    try {
        let { username, password, mail, birthdate, role } = req.body
        if (role === 'ADMIN' && !req.user) return res.status(401).send({ message: 'Permission for creating an admin account not granted.' })
        if (role !== 'ADMIN') role = 'USER'
        const mailTaken = await User.exists({ mail: mail.toLowerCase() })
        if (mailTaken) {
            return res.status(409).send({ message: 'E-mail already in use.' })
        }
        const usernameTaken = await User.exists({ username })
        if (usernameTaken) {
            return res.status(409).send({ message: 'Username taken.' })
        }

        const encryptedPassword: string = await bcrypt.hash(password, 10)
        const timestamp: number = new Date().getTime()
        const confirmationCode: string = jwt.sign({ mail, timestamp }, process.env.TOKEN_KEY as string)
        const seniority = getSeniority(new Date(birthdate))
        if (seniority === 'ERROR') return res.status(404).send({ message: 'Invalid date provided.' })

        const userBody: UserBody = {
            username, password: encryptedPassword, mail: mail.toLowerCase(), confirmationCode, seniority, role
        }
        if (role === 'ADMIN') {
            userBody.status = 'Active'
            delete userBody.confirmationCode
        }

        const user: IUser | null = await User.create(userBody)

        if (role !== 'ADMIN') sendConfirmationEmail(username, mail, confirmationCode)

        const token = jwt.sign({
            userId: user._id,
            mail,
            role,
            status: user.status
        }, process.env.TOKEN_KEY as string, { expiresIn: '30d' })

        res.status(201).json({
            userDetails: {
                mail: user.mail,
                token,
                role,
                username: user.username,
                _id: user._id
            },
        })

    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default postRegister