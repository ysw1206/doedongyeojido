import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

// MongoDB 스키마 정의
const PlaceSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  address: String,
  lat: Number,
  lng: Number,
  phone: String,
  businessHours: Object,
  priceRange: String,
  parkingInfo: String,
  atmosphereTags: [String],
  mainMenu: [String],
  features: [String],
  images: [String],
  youtuberCount: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const CategorySchema = new mongoose.Schema({
  name: String,
  displayName: String,
  icon: String,
  color: String,
  sortOrder: Number,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: String,
  nickname: String,
  profileImage: String,
  phone: String,
  birthDate: Date,
  gender: String,
  locationPreference: Object,
  notificationSettings: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  createdAt: { type: Date, default: Date.now }
})

const VisitHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  visitedAt: { type: Date, default: Date.now }
})

const YoutubeVideoSchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  videoId: String,
  title: String,
  description: String,
  youtuberName: String,
  youtuberChannelId: String,
  viewCount: String,
  uploadDate: Date,
  thumbnailUrl: String,
  duration: String,
  createdAt: { type: Date, default: Date.now }
})

// 모델 생성
const Place = mongoose.model('Place', PlaceSchema)
const Category = mongoose.model('Category', CategorySchema)
const User = mongoose.model('User', UserSchema)
const Favorite = mongoose.model('Favorite', FavoriteSchema)
const VisitHistory = mongoose.model('VisitHistory', VisitHistorySchema)
const YoutubeVideo = mongoose.model('YoutubeVideo', YoutubeVideoSchema)

// ========================================
// 맛집 관련 API
// ========================================

// 전체 맛집 목록 조회
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const places = await Place.find({ isActive: true }).sort({ createdAt: -1 })
      res.json(places)
    } else {
      res.json([])
    }
  } catch (error) {
    console.log('❌ Error fetching places:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 특정 맛집 상세 조회
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const place = await Place.findById(req.params.id)
      if (place) {
        res.json(place)
      } else {
        res.status(404).json({ error: 'Place not found' })
      }
    } else {
      res.status(404).json({ error: 'Database not connected' })
    }
  } catch (error) {
    console.log('❌ Error fetching place:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 카테고리별 맛집 조회
router.get('/category/:category', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const places = await Place.find({ 
        category: req.params.category, 
        isActive: true 
      }).sort({ createdAt: -1 })
      res.json(places)
    } else {
      res.json([])
    }
  } catch (error) {
    console.log('❌ Error fetching places by category:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ========================================
// 카테고리 관련 API
// ========================================

// 카테고리 목록 조회
router.get('/categories', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 })
      if (categories.length > 0) {
        res.json(categories)
      } else {
        // 카테고리가 없으면 더미 데이터 반환
        res.json([
          { name: 'korean', displayName: '한식', icon: '🍚', color: '#FF6B6B' },
          { name: 'japanese', displayName: '일식', icon: '🍣', color: '#4ECDC4' },
          { name: 'chinese', displayName: '중식', icon: '🥢', color: '#45B7D1' },
          { name: 'western', displayName: '양식', icon: '🍝', color: '#96CEB4' },
          { name: 'dessert', displayName: '디저트', icon: '🍰', color: '#FFEAA7' },
          { name: 'cafe', displayName: '카페', icon: '☕', color: '#DDA0DD' },
          { name: 'bar', displayName: '술집', icon: '🍺', color: '#98D8C8' }
        ])
      }
    } else {
      res.json([
        { name: 'korean', displayName: '한식', icon: '🍚', color: '#FF6B6B' },
        { name: 'japanese', displayName: '일식', icon: '🍣', color: '#4ECDC4' },
        { name: 'chinese', displayName: '중식', icon: '🥢', color: '#45B7D1' },
        { name: 'western', displayName: '양식', icon: '🍝', color: '#96CEB4' },
        { name: 'dessert', displayName: '디저트', icon: '🍰', color: '#FFEAA7' },
        { name: 'cafe', displayName: '카페', icon: '☕', color: '#DDA0DD' },
        { name: 'bar', displayName: '술집', icon: '🍺', color: '#98D8C8' }
      ])
    }
  } catch (error) {
    console.log('❌ Error fetching categories:', (error as any).message)
    // 에러가 발생해도 더미 데이터 반환
    res.json([
      { name: 'korean', displayName: '한식', icon: '🍚', color: '#FF6B6B' },
      { name: 'japanese', displayName: '일식', icon: '🍣', color: '#4ECDC4' },
      { name: 'chinese', displayName: '중식', icon: '🥢', color: '#45B7D1' },
      { name: 'western', displayName: '양식', icon: '🍝', color: '#96CEB4' },
      { name: 'dessert', displayName: '디저트', icon: '🍰', color: '#FFEAA7' },
      { name: 'cafe', displayName: '카페', icon: '☕', color: '#DDA0DD' },
      { name: 'bar', displayName: '술집', icon: '🍺', color: '#98D8C8' }
    ])
  }
})

// ========================================
// 찜하기 관련 API
// ========================================

// 사용자 찜한 맛집 목록 조회
router.get('/favorites/:userId', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const favorites = await Favorite.find({ userId: req.params.userId })
        .populate('placeId')
        .sort({ createdAt: -1 })
      res.json(favorites.map(fav => fav.placeId))
    } else {
      res.json([])
    }
  } catch (error) {
    console.log('❌ Error fetching favorites:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 찜하기 추가/제거
router.post('/favorites', async (req, res) => {
  try {
    const { userId, placeId } = req.body
    if (mongoose.connection.readyState === 1) {
      const existingFavorite = await Favorite.findOne({ userId, placeId })
      if (existingFavorite) {
        await Favorite.findByIdAndDelete(existingFavorite._id)
        res.json({ message: 'Favorite removed', isFavorite: false })
      } else {
        await Favorite.create({ userId, placeId })
        res.json({ message: 'Favorite added', isFavorite: true })
      }
    } else {
      res.status(500).json({ error: 'Database not connected' })
    }
  } catch (error) {
    console.log('❌ Error toggling favorite:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ========================================
// 방문기록 관련 API
// ========================================

// 사용자 방문기록 조회
router.get('/history/:userId', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const history = await VisitHistory.find({ userId: req.params.userId })
        .populate('placeId')
        .sort({ visitedAt: -1 })
      res.json(history.map(h => h.placeId))
    } else {
      res.json([])
    }
  } catch (error) {
    console.log('❌ Error fetching history:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 방문기록 추가
router.post('/history', async (req, res) => {
  try {
    const { userId, placeId } = req.body
    if (mongoose.connection.readyState === 1) {
      await VisitHistory.create({ userId, placeId })
      res.json({ message: 'Visit history added' })
    } else {
      res.status(500).json({ error: 'Database not connected' })
    }
  } catch (error) {
    console.log('❌ Error adding visit history:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ========================================
// 유튜브 영상 관련 API
// ========================================

// 맛집의 유튜브 영상 목록 조회
router.get('/:placeId/videos', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const videos = await YoutubeVideo.find({ placeId: req.params.placeId })
        .sort({ uploadDate: -1 })
      res.json(videos)
    } else {
      res.json([])
    }
  } catch (error) {
    console.log('❌ Error fetching videos:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ========================================
// 검색 관련 API
// ========================================

// 맛집 검색
router.get('/search/:query', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const query = req.params.query
      const places = await Place.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ],
        isActive: true
      }).sort({ createdAt: -1 })
      res.json(places)
    } else {
      res.json([])
    }
  } catch (error) {
    console.log('❌ Error searching places:', (error as any).message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
