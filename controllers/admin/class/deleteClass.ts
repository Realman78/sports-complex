import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'

const deleteClass = async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    try {
        let { id } = req.params

        const classToDelete: IClass | null = await Class.findByIdAndDelete(id)
        if (!classToDelete) return res.status(404).send({ message: `No class found with ID: ${id}` })

        res.status(200).send({ message: 'Class deleted.', class: classToDelete })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default deleteClass