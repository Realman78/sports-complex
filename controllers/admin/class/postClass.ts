import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'

type ClassBody = {
    sport: string;
    seniority: string;
    description: string;
    duration: string;
    createdBy?: string;
}

const postClass = async (req: Request<{},{},{sport: string, seniority: string, description: string, duration: string},{}>, res: Response) => {
    try {
        const { sport, seniority, description, duration } = req.body

        const classExists = await Class.exists({ sport, seniority })
        if (classExists) {
            return res.status(409).send({ message: 'Class already exists.' })
        }

        const classBody: ClassBody = {
            sport, seniority, description, duration, createdBy: req.user?.userId
        }

        const newClass: IClass | null = await Class.create(classBody)

        res.status(201).send({message: 'Class created.', class: newClass})
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default postClass