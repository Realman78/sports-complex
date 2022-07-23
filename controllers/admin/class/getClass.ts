import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'

const getClass = async (req: Request<{id: string},{},{},{}>, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).send({message: 'No ID provided.'})
        const filter = req.user?.role === 'ADMIN' ? '' : '-enrolledUsers -createdBy -ratings'
        const _class: IClass | null = await Class.findById(req.params.id).populate('ratings').select(filter)

        if (!_class) return res.status(404).send({message: 'No classes found.'})

        res.status(200).send({message: 'Class fetched.', class: _class})
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default getClass