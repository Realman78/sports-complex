import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'


const updateClassTermins = async (req: Request<{ id: string }, {}, { termins: string[] }, {}>, res: Response) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send({ message: 'No valid ID provided.' })
        let { termins } = req.body
        //Ako nije nista passano u body, salji prazan array
        if (!termins) termins = []
        //Ako je samo 1 element, pretvori ga u single item array (modifikacija radi postmana)
        if (typeof termins === 'string') {
            termins = [termins]
        }
        //unikatnost i provjera je li termin prosao
        const terminTimestamps: Set<number> = new Set<number>()
        for (let t of termins) {
            if (Date.parse(t)) {
                if (Date.parse(t) - (new Date()).getTime() < 0) return res.status(400).send({ message: 'You can\'t schedule a termin for a date that has passed.' })
                terminTimestamps.add((new Date(t)).getTime())
            } else return res.status(400).send('Invalid date format. Should be YYYY-MM-DDThh:mmZ (T and Z are constants -> you don\'t replace them with numbers)')
        }

        const terminDates = Array.from(terminTimestamps).map(t => new Date(t))


        const newClass: IClass | null = await Class.findByIdAndUpdate(req.params.id, { termins: terminDates }, { new: true })
        if (!newClass) return res.status(400).send({ message: 'Class not found.' })

        res.status(201).send({ message: 'Class updated.', class: newClass })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default updateClassTermins