// Handling all the successful and error-Resulting operations structurally
const {validationResult} = require('express-validator');

const sendSuccessResponse = (res, statuscode, data) => {
    return res.status(statuscode).json({
        success: true,
        data: data
    });
};

const sendErrorResponse = (res, statuscode, message) => {
    return res.status(statuscode).json({
        success: false,
        error: message 
    });
};

const handleServerError = (err,res) => {
    return sendErrorResponse(res, 500, err.message);
};

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return sendErrorResponse(res, 400, errorMessages.join(', '));
    }
    next();
};

module.exports = {
    sendErrorResponse,
    sendSuccessResponse,
    handleServerError,
    handleValidationErrors
};
