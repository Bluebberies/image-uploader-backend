const uploads = require('../routes/upload')

module.exports = function (app) {
  app.use('/', uploads)
}
