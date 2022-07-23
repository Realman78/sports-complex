import Class, { IClass } from '../../../models/ClassSchema'
import { Request, Response } from 'express'

type SearchObject = {
    sport?: string[];
    seniority?: string[];
}

const getClasses = async (req: Request<{}, {}, {}, { sports: string, age: string }>, res: Response) => {
    try {
        let { sports, age } = req.query

        const sportsArr: string[] = sports?.split(',')
        const ageArr: string[] = age?.split(',')

        let searchObj: SearchObject = {}
        if (sportsArr) searchObj.sport = sportsArr
        if (ageArr) searchObj.seniority = ageArr


        const filter = req.user?.role === 'ADMIN' ? '' : '-enrolledUsers -createdBy -ratings'
        const classes: IClass[] | null = await Class.find(searchObj).populate('ratings').select(filter)

        res.status(200).send({ message: 'Classes fetched.', classes: classes || [] })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default getClasses