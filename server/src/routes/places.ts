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

router.get('/', async (req, res) => {
  const { lat, lng } = req.query
  // Simplified query ignoring radius
  const places = await Place.find()
  res.json(places)
})

router.get('/:id', async (req, res) => {
  const place = await Place.findById(req.params.id)
  if (!place) return res.status(404).end()
  res.json(place)
})

router.post('/', async (req, res) => {
  const place = new Place(req.body)
  await place.save()
  res.status(201).json(place)
})

export default router
