import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'

type ClassBody = {
    sport: string;
    seniority: string;
    description: string;
    duration: string;
    createdBy?: string;
}

const updateClass = async (req: Request<{ id: string }, {}, { sport: string, seniority: string, description: string, duration: string }, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        const _class: IClass | null = await Class.findById(req.params.id)
        if (!_class) return res.status(404).send({ message: 'No class found with that ID.' })

        const { sport, seniority, description, duration } = req.body

        const classBody: ClassBody = {
            sport, seniority, description, duration
        }

        const classExists = await Class.exists({ sport, seniority })

        if (classExists && classExists?._id?.toString() !== _class._id.toString()) {
            return res.status(409).send({ message: 'Class already exists.' })
        }

        const newClass = await Class.findByIdAndUpdate(req.params.id, classBody, { new: true })


        res.status(201).send({ message: 'Class updated.', class: newClass })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default updateClass