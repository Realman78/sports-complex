import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'
import User, { IUser } from '../../../models/UserSchema'


const addEnrolledUser = async (req: Request<{ id: string }, {}, { userId: string }, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        let { userId } = req.body

        if (!userId) return res.status(400).send({ message: 'No user ID provided.' })

        const newClass: IClass | null = await Class.findById(req.params.id)
        if (!newClass) return res.status(400).send({ message: 'Class not found.' })

        let userExists: IUser | null = await User.findById(userId).select('-password')
        if (!userExists) return res.status(404).send({ message: `No user with ID: ${userId} found.` })

        if (userExists.enrolledClasses?.length === 2) return res.status(400).send({ message: `User with ID: ${userExists._id} is already enrolled in 2 classes.` })
        if (userExists.seniority !== newClass.seniority) return res.status(400).send({ message: `User with ID: ${userExists._id} isn\'t the appropriate age for this class.` })
        if (newClass.enrolledUsers?.includes(userExists._id)) return res.status(409).send({ message: 'User already enrolled.' })
        if (!newClass.enrolledUsers || newClass.enrolledUsers.length === 10) return res.status(400).send({ message: 'Class full (10 users max).' })

        await userExists.updateOne({ $addToSet: { enrolledClasses: newClass?._id } }, { new: true })

        newClass.enrolledUsers?.push(userExists?._id)
        await newClass.save()

        res.status(201).send({ message: 'Class updated.', class: newClass })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default addEnrolledUser