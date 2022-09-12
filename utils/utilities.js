const multer = require('multer')
const winston = require('winston')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const uploadImage = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images')
    },
    filename: (req, file, cb) => {
      winston.info(file)
      const uniqueFileName = Date.now() + path.extname(file.originalname)
      cb(null, uniqueFileName)
    }
  })

  const upload = multer({ storage: storage })

  return upload.single('avatar')
}

const checkAndDelete = () => {
  const file = fs.readdirSync('images')
  if (file.length > 1) {
    fs.unlinkSync(`./images/${file[0]}`)
  }
}

const uploadToCloudinary = async res => {
  try {
    const file = fs.readdirSync('images')
    const lastFile = file[file.length - 1]
    const result = await cloudinary.uploader.upload(`./images/${lastFile}`)
    res.send(result.secure_url)
  } catch (ex) {
    winston.error(ex)
    res.send(ex)
  }
}

module.exports = { uploadImage, checkAndDelete, uploadToCloudinary }
