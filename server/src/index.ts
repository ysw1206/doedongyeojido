import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import placesRouter from './routes/places'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/places', placesRouter)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/doedong'

// MongoDB 연결을 선택적으로 처리
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
  })
  .catch((error) => {
    console.log('⚠️  MongoDB connection failed, running without database')
    console.log('   Error:', error.message)
    console.log('   You can still test the API endpoints')
  })

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`)
  console.log(`📡 API available at http://localhost:${port}/places`)
})
