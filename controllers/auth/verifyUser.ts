import User, { IUser } from '../../models/UserSchema'
import { Request, Response } from 'express'

const verifyUser = async (req: Request<{ code: string }, {}, {}, {}>, res: Response) => {
    try {
        if (!req.params.code) return res.status(400).send({ message: 'No code provided.' })
        const user: IUser | null = await User.findOneAndUpdate({ confirmationCode: req.params.code }, { status: 'Active' })

        if (!user) return res.status(404).send({ message: "User not found. Code not valid or expired." });
        return res.send({ message: 'User verified successfully. Please log in.' })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default verifyUser