import { Request, Response } from 'express'
import User, { IUser } from '../../../models/UserSchema';
import { getSeniority } from '../../../utils/util'

type UserBody = {
    username: string;
    mail: string;
    seniority: string;
    role: string;
    status?: string;
}

const updateUser = async (req: Request<{ id: string }, {}, { username: string, mail: string, birthdate: string, role: string }, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        const user: IUser | null = await User.findById(req.params.id)
        if (!user) return res.status(404).send({ message: `No user found with ID: ${req.params.id}.` })

        const { username, mail, birthdate, role } = req.body

        const mailTaken = await User.exists({ mail: mail.toLowerCase() })
        if (mailTaken && mail !== user.mail) {
            return res.status(409).send({ message: 'E-mail already in use.' })
        }
        const usernameTaken = await User.exists({ username })
        if (usernameTaken && username !== user.username) {
            return res.status(409).send({ message: 'Username taken.' })
        }

        const seniority: string = getSeniority(new Date(birthdate))
        if (seniority === 'ERROR') return res.status(404).send({ message: 'Invalid date provided.' })

        const userBody: UserBody = {
            username, mail: mail.toLowerCase(), seniority, role
        }

        if (role === 'ADMIN') userBody.status = 'Active'

        const newUser: IUser | null = await User.findByIdAndUpdate(req.params.id, userBody, { new: true })

        res.status(201).send({ message: 'User updated.', user: newUser })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default updateUser