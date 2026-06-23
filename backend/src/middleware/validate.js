const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

const validate = (req, res, next) => {

    const errors = validationResult(req);

    // isEmpty() returns true if no validation errors found
    if (!errors.isEmpty()) {
        // Format errors into a clean array of messages
        const extractedErrors = errors.array().map((err) => ({
            field: err.path,
            message: err.msg,
        }));

        return errorResponse(res, 400, 'Validation failed', extractedErrors);
    }
    
    next();
};

module.exports = validate;