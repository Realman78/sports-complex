import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'
import User, { IUser } from '../../../models/UserSchema'
import { ObjectId } from 'mongoose'


const updateEnrolledUsers = async (req: Request<{ id: string }, {}, { users: string[] }, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        let { users } = req.body
        //Ako nije nista passano u body, salji prazan array
        if (!users) users = []
        //Ako je samo 1 element, pretvori ga u single item array (modifikacija radi postmana)
        if (typeof users === 'string') {
            users = [users]
        }

        const enrolledUsers: Set<ObjectId> = new Set<ObjectId>()
        const usersSet: Set<string> = new Set<string>(users)
        const usersSetMongo: Set<IUser> = new Set<IUser>()

        if (usersSet.size > 10) return res.status(400).send({ message: 'Max 10 users can be enrolled.' })

        const _class = await Class.findById(req.params.id).populate('enrolledUsers')
        if (!_class) return res.status(400).send({ message: 'Class not found.' })

        //Jesu li svi korisnici validni
        for (let user of usersSet) {
            const userExists: IUser | null = await User.findById(user)
            if (userExists && userExists._id) {
                if (userExists.seniority !== _class.seniority) return res.status(400).send({ message: `User with ID: ${user} isn\'t the appropriate age for this class.` })
                if (userExists.enrolledClasses?.length === 2) return res.status(400).send({ message: `User with ID: ${user} is already enrolled in 2 classes.` })

                enrolledUsers.add(userExists._id)
                usersSetMongo.add(userExists)
            }
            else return res.status(404).send({ message: `User with ID: ${user} not found.` })
        }

        //Brisi stare sudionike classa
        if (_class.enrolledUsers) {
            for (let enrolledUser of _class?.enrolledUsers) {
                if (enrolledUser instanceof User) {
                    enrolledUser.enrolledClasses = enrolledUser?.enrolledClasses?.filter(c => c === _class._id)
                    await enrolledUser.save()
                }
            }
        }

        //update
        for (let user of usersSetMongo) {
            await user.updateOne({ $addToSet: { enrolledClasses: _class._id } }, {new: true})
        }
        _class.enrolledUsers = Array.from(enrolledUsers)
        await _class.save()

        res.status(201).send({ message: 'Class updated.', class: _class })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default updateEnrolledUsers