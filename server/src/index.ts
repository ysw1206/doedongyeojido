import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import placesRouter from './routes/places'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/places', placesRouter)

// MongoDB 연결 문자열 (Docker 환경 - 포트 27018)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27018/doedong?authSource=admin'

// MongoDB 연결을 선택적으로 처리
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    console.log('📊 Database: doedong')
    console.log('📋 Collection: places')
  })
  .catch((error) => {
    console.log('⚠️  MongoDB connection failed, running without database')
    console.log('   Error:', error.message)
    console.log('   You can still test the API endpoints with dummy data')
    console.log('   To start MongoDB: docker-compose up -d')
  })

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`)
  console.log(`📡 API available at http://localhost:${port}/places`)
})
