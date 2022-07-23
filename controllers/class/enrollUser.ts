import Class, { IClass } from '../../models/ClassSchema'
import { Request, Response } from 'express'
import User, { IUser } from '../../models/UserSchema'


const enrollUser = async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).send({ message: 'No valid ID provided.' })
        const userId = req.user?.userId

        const newClass: IClass | null = await Class.findById(req.params.id).select('-createdBy')
        if (!newClass) return res.status(400).send({ message: 'Class not found.' })
        if (!newClass.enrolledUsers || newClass.enrolledUsers.length === 10) return res.status(400).send({ message: 'Class full (10 users max).' })

        const userExists: IUser | null = await User.findById(userId).select('-password')
        if (!userExists) return res.status(404).send({ message: `No user with ID: ${userId} found.` })
        if (userExists.enrolledClasses?.length === 2) return res.status(400).send({ message: `User with ID: ${userExists._id} is already enrolled in 2 classes.` })
        if (userExists.seniority !== newClass.seniority) return res.status(400).send({ message: `User with ID: ${userExists._id} isn\'t the appropriate age for this class.` })
        if (newClass.enrolledUsers?.includes(userExists._id) || userExists.enrolledClasses?.includes(newClass._id)) return res.status(409).send({ message: 'User already enrolled.' })

        userExists.enrolledClasses?.push(newClass._id)
        await userExists.save()

        newClass.enrolledUsers?.push(userExists._id)
        await newClass.save()

        res.status(201).send({ message: 'Class updated.', class: newClass, user: userExists })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default enrollUser