const express = require('express')
const router = express.Router()
const {
  uploadImage,
  checkAndDelete,
  uploadToCloudinary
} = require('../utils/utilities')

router.post('/', uploadImage(), (req, res) => {
  checkAndDelete()
  uploadToCloudinary(res)
})

module.exports = router
