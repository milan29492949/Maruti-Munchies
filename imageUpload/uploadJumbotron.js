const path = require("path");
var multer = require('multer')

const targetPath = path.join(__dirname, "../public/images/jumbotron/");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, targetPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var jumbotronUpload = multer({ storage: storage })

  module.exports = jumbotronUpload;