import express from 'express'
import cors from 'cors'
require('dotenv').config()
import connectDB from './config/db'

//routes
import authRoutes from './routes/authRouter'
import adminRoutes from './routes/adminRouter'
import classesRouter from './routes/classesRouter'

const PORT = process.env.PORT || 3000

import os from 'os'
import cluster from 'cluster'
cluster.schedulingPolicy = cluster.SCHED_RR


// if (cluster.isPrimary) {
//     for (let i = 0; i < os.cpus().length; i++) {
//         cluster.fork()
//     }
// } else {
    const app = express()

    app.use(express.json())
    app.use(cors())
    app.use(express.urlencoded({ extended: false }))

    //Routers
    app.use('/api/admin', adminRoutes)
    app.use('/api/auth', authRoutes)
    app.use('/api/classes', classesRouter)


    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`)
        })
    }).catch((e: any) => {
        console.log(e)
    })
// }