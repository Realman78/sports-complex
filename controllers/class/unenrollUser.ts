import Class, { IClass } from '../../models/ClassSchema'
import { Request, Response } from 'express'
import User, { IUser } from '../../models/UserSchema'


const unenrollUser = async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        const userId = req.user?.userId

        const newClass: IClass | null = await Class.findById(req.params.id).select('-createdBy')
        if (!newClass) return res.status(400).send({ message: 'Class not found.' })

        const user: IUser | null = await User.findById(userId).select('-password')
        if (!user) return res.status(404).send({ message: `No user with ID: ${userId} found.` })
        if (!newClass.enrolledUsers?.includes(user._id)) return res.status(404).send({ message: `No user with ID: ${userId} found in this class.` })

        newClass.enrolledUsers = newClass.enrolledUsers?.filter(u => u.toString() !== user._id.toString())
        user.enrolledClasses = user.enrolledClasses?.filter(c => c.toString() !== newClass._id.toString())
        await newClass.save()
        await user.save()

        res.status(200).send({ message: 'Class updated.', class: newClass, user })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default unenrollUser