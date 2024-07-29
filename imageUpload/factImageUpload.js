const path = require("path");
var multer = require('multer')

const targetPath = path.join(__dirname, "../public/images/fact");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, targetPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var factUpload = multer({ storage: storage })

  module.exports = factUpload;