import { Request, Response } from 'express'
import User, { IUser } from '../../../models/UserSchema';

type SearchObject = {
    sport?: string[];
    seniority?: string[];
}

const getUsers = async (req: Request<{}, {}, {}, { seniority: string }>, res: Response) => {
    try {
        let { seniority } = req.query

        const seniorityArr: string[] = seniority?.split(',')

        let searchObj: SearchObject = {}
        if (seniorityArr) searchObj.seniority = seniorityArr

        const users: IUser[] | null = await User.find(searchObj).select('-password')

        res.status(200).send({ message: 'Users fetched.', users: users || [] })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default getUsers