import Class, { IClass } from '../../models/ClassSchema'
import { Request, Response } from 'express'
import Rating from '../../models/RatingSchema'


const rateClass = async (req: Request<{ id: string }, {}, { comment: string, rating: number }, {}>, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).send({ message: 'No valid ID provided.' })
        const userId = req.user?.userId
        const { comment, rating } = req.body

        const newClass: IClass | null = await Class.findById(req.params.id).populate('ratings').select('-createdBy')
        if (!newClass) return res.status(404).send({ message: 'Class not found.' })

        let newRatingGrade: number = 0;

        if (newClass && newClass.ratings) {
            for (let r of newClass.ratings) {
                if (r instanceof Rating) {
                    newRatingGrade += r.rating
                    if (r.user.toString() === userId)
                        return res.status(400).send({ message: 'Class already rated.' })
                }
            }
        }

        newRatingGrade += rating
        if (newClass && newClass.ratings) 
            newRatingGrade = Math.round((newRatingGrade / (newClass?.ratings?.length + 1)) * 100) / 100

        const newRating = await Rating.create({ comment, rating, user: userId, class: newClass._id })
        await newClass.updateOne({$addToSet: {ratings: newRating._id}, rating: newRatingGrade})

        res.status(201).send({ message: 'Class updated.', rating: newRating })
    } catch (e: any) {
        console.log(e)
        return res.status(500).send({ message: "Error occured. Please try again.", error: e.message })
    }
}
export default rateClass