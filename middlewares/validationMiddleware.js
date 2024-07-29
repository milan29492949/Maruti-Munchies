const {check, validationResult} = require('express-validator');

function UserValidation() {
    return [
      check('name')
        .isLength({ min: 4 })
        .withMessage('username must be at least 4 chars long')
    ]
      
  }

  module.exports = UserValidation;