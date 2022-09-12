const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
require('dotenv').config()
const cloudinary = require('cloudinary').v2
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// cloudinary.config({ 
//   cloud_name: 'bluebberies', 
//   api_key: '264113968858469', 
//   api_secret: 'BY97Eajo0tSZxWi2rqOre_voW9c' 
// });

// console.log(process.env.CLOUDINARY_CLOUD_NAME)

app.use(compression())
app.use(helmet())
app.use(cors())

function checkAndDelete () {
  const file = fs.readdirSync('images')
  if (file.length > 1) {
    fs.unlinkSync(`./images/${file[0]}`)
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    console.log(file)
    const uniqueFileName = Date.now() + path.extname(file.originalname)
    cb(null, uniqueFileName)
  }
})

const upload = multer({ storage: storage })
const uploads = [{ genre1: 'horrrpo' }]
app.get('/', (req, res) => {
  res.send(uploads)
})

app.post('/', upload.single('avatar'), async (req, res) => {
  checkAndDelete()

  try {
    const file = fs.readdirSync('images')[0]
    const result = await cloudinary.uploader.upload(
      // `${__dirname}\\images\\${file}`
      `./images/${file}`
    )
    res.send(result.secure_url)
  } catch (ex) {
    console.log(ex)
    res.send(ex)
  }
})

// const file = fs.readdirSync('images')[0]
// cloudinary.uploader
//   .upload(`${__dirname}\\images\\${file}`)
//   .then(result => console.log(result.secure_url))
//   .catch(ex => console.log(ex))

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
