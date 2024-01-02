const asyncHandler = require('express-async-handler')
const Note = require('../models/Note')
const { sendErrorResponse, sendSuccessResponse, handleServerError } = require('../middleware/errorHandling');

const getSingleNote = asyncHandler(async (req, res) => {
    try {
        const singleNote = await Note.findById(req.params.id);
        if (!singleNote) {
            return sendErrorResponse(res,404,"No note found :(");
        }
        return sendSuccessResponse(res,200,singleNote)
    } catch (error) {
        console.log('Internal Error',error);
        return handleServerError(error,res);
    }
});

module.exports = getSingleNote;