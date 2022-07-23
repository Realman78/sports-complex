import { Request, Response } from 'express'
import User, { IUser } from '../../../models/UserSchema'

const deleteUser = async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    try {
        let { id } = req.params

        const userToDelete: IUser | null = await User.findByIdAndDelete(id)
        if (!userToDelete) return res.status(404).send({ message: `No user found with ID: ${id}` })

        res.status(200).send({ message: 'User deleted.', user: userToDelete })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default deleteUser