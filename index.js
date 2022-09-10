const express = require('express')
const app = express()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
require('dotenv').config()
const cloudinary = require('cloudinary').v2
const cors = require('cors')
const helmet = require("helmet");
const compression = require('compression')

app.use(compression())
app.use(helmet());
app.use(cors())
app.use(express.static('dist'))

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

const uploads = [{ genre1: 'Comedy' }, { genre2: 'Action' }]

app.get('*', (req, res) => {
  res.sendFile(`${__dirname}\\dist\\index.html`)
})

app.post('/uploads', upload.single('avatar'), async (req, res) => {
  checkAndDelete()

  try {
    const file = fs.readdirSync('images')[0]
    const result = await cloudinary.uploader.upload(
      `${__dirname}\\images\\${file}`
    )
    res.send(result.secure_url)
  } catch (ex) {
    console.log(ex)
  }
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
