import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import placesRouter from './routes/places'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/places', placesRouter)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doedong'
mongoose.connect(MONGODB_URI)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
