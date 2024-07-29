const path = require("path");
var multer = require('multer')

const targetPath = path.join(__dirname, "../public/images/why_choose");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, targetPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var whyChooseUpload = multer({ storage: storage })

  module.exports = whyChooseUpload;