import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

const PlaceSchema = new mongoose.Schema({
  title: String,
  lat: Number,
  lng: Number,
  videoId: String,
})

const Place = mongoose.model('Place', PlaceSchema)

// 더미 데이터 (MongoDB 연결 실패 시 사용)
const dummyPlaces = [
  {
    _id: '1',
    title: '테스트 맛집 1',
    lat: 37.5665,
    lng: 126.9780,
    videoId: 'dQw4w9WgXcQ'
  },
  {
    _id: '2', 
    title: '테스트 맛집 2',
    lat: 37.5665,
    lng: 126.9780,
    videoId: 'dQw4w9WgXcQ'
  }
]

router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query
    // MongoDB 연결 상태 확인
    if (mongoose.connection.readyState === 1) {
      // MongoDB가 연결된 경우
      const places = await Place.find()
      res.json(places)
    } else {
      // MongoDB가 연결되지 않은 경우 더미 데이터 반환
      console.log('📝 Using dummy data (MongoDB not connected)')
      res.json(dummyPlaces)
    }
  } catch (error) {
    console.log('❌ Error fetching places:', (error as any).message)
    res.json(dummyPlaces)
  }
})

router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // MongoDB가 연결된 경우
      const place = await Place.findById(req.params.id)
      if (!place) return res.status(404).json({ error: 'Place not found' })
      res.json(place)
    } else {
      // MongoDB가 연결되지 않은 경우 더미 데이터 반환
      const dummyPlace = dummyPlaces.find(p => p._id === req.params.id)
      if (!dummyPlace) return res.status(404).json({ error: 'Place not found' })
      res.json(dummyPlace)
    }
  } catch (error) {
    console.log('❌ Error fetching place:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // MongoDB가 연결된 경우
      const place = new Place(req.body)
      await place.save()
      res.status(201).json(place)
    } else {
      // MongoDB가 연결되지 않은 경우 더미 응답
      console.log('📝 Cannot save to database (MongoDB not connected)')
      res.status(201).json({
        _id: Date.now().toString(),
        ...req.body,
        message: 'Saved to memory only (MongoDB not connected)'
      })
    }
  } catch (error) {
    console.log('❌ Error creating place:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
