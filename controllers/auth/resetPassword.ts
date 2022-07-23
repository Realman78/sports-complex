import User, { IUser } from '../../models/UserSchema'
import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { randomizer, sendPasswordReset } from '../../utils/util'

const resetPassword = async (req: Request, res: Response) => {
    try {
        const user: IUser | null = await User.findById(req.user?.userId)
        if (!user) return res.status(400).send({ message: 'User Not Found.' })

        const newPassword: string = randomizer(10)
        const encryptedPassword: string = await bcrypt.hash(newPassword, 10)

        sendPasswordReset(user.username, user.mail, newPassword)

        user.password = encryptedPassword
        await user.save()
        
        return res.send({ message: 'Password reset E-mail sent.' })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default resetPassword