import User, { IUser } from '../../models/UserSchema'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

const postLogin = async (req: Request<{}, {}, { password: string, mail: string }, {}>, res: Response) => {
    try {
        const { password, mail } = req.body
        const user: IUser | null = await User.findOne({
            $or: [{ username: mail }, { mail }]
        })

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                userId: user._id,
                mail,
                role: user.role,
                status: user.status
            }, process.env.TOKEN_KEY as string, { expiresIn: '30d' })

            return res.status(200).json({
                userDetails: {
                    mail: user.mail,
                    token,
                    username: user.username,
                    role: user.role,
                    _id: user._id
                },
            })
        }
        return res.status(400).send({ message: 'Invalid credentials.' })

    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default postLogin