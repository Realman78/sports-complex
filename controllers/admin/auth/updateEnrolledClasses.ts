import { Request, Response } from 'express'
import Class from '../../../models/ClassSchema'
import User, { IUser } from '../../../models/UserSchema'


const updateEnrolledClasses = async (req: Request<{ id: string }, {}, { enrolledClasses: string[] }, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        let { enrolledClasses } = req.body
        //Ako nije nista passano u body, salji prazan array
        if (!enrolledClasses) enrolledClasses = []
        //Ako je samo 1 element, pretvori ga u single item array (modifikacija radi postmana)
        if (typeof enrolledClasses === 'string') {
            enrolledClasses = [enrolledClasses]
        }

        if (enrolledClasses.length > 2) return res.status(400).send({ message: 'You can\'t enroll in more than 2 classes.' })
        if (enrolledClasses.length === 2 && enrolledClasses[0] === enrolledClasses[1]) enrolledClasses = [enrolledClasses[0]]

        for (let ec of enrolledClasses){
            let classExists = await Class.exists({_id: ec})
            //if user puts dumb id solve
            if (!classExists || !classExists._id) return res.status(404).send({ message: `Class with ID: ${ec} not found.` })
        }

        const newUser: IUser | null = await User.findByIdAndUpdate(req.params.id, { enrolledClasses }, { new: true })
        if (!newUser) return res.status(400).send({ message: 'User not found.' })

        res.status(201).send({ message: 'User updated.', user: newUser })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default updateEnrolledClasses