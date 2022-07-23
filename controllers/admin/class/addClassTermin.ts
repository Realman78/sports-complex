import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'


const addClassTermin = async (req: Request<{ id: string }, {}, { termin: string }, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        let { termin } = req.body

        if (!termin || !Date.parse(termin))
            return res.status(400).send({ message: 'Invalid date format. Should be YYYY-MM-DDThh:mmZ (T and Z are constants -> you don\'t replace them with numbers)' })

        const newClass: IClass | null = await Class.findById(req.params.id)
        if (!newClass) return res.status(400).send({ message: 'Class not found.' })

        const date = new Date(termin)
        if (date.getTime() - (new Date()).getTime() < 0) return res.status(400).send({ message: 'You can\'t schedule a termin for a date that has passed.' })

        const timestamps = newClass?.termins?.map(t => t.getTime())
        if (timestamps && timestamps.includes(date.getTime())) return res.status(409).send({ message: 'Termin already exists' })

        newClass.termins?.push(date)
        await newClass.save()

        res.status(201).send({ message: 'Class updated.', class: newClass })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default addClassTermin