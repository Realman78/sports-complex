import { Request, Response } from 'express'
import User, { IUser } from '../../../models/UserSchema'


const updateStatus = async (req: Request<{ id: string }, {}, { status: string }, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        let { status } = req.body

        const newUser: IUser | null = await User.findByIdAndUpdate(req.params.id, { status }, { new: true })
        if (!newUser) return res.status(400).send({ message: 'User not found.' })

        res.status(201).send({ message: 'User updated.', user: newUser })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default updateStatus