import { Request, Response } from 'express'
import User, { IUser } from '../../../models/UserSchema'

const getUser = async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).send({ message: 'No ID provided.' })

        const user: IUser | null = await User.findById(req.params.id).select('-password')

        if (!user) return res.status(404).send({ message: 'No User found.' })

        res.status(200).send({ message: 'User fetched.', user })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default getUser