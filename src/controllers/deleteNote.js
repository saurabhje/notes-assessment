const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const { sendErrorResponse, sendSuccessResponse, handleServerError } = require('../middleware/errorHandling');

const deleteNote = asyncHandler(async (req, res) => {
    try {
        const result = await Note.findByIdAndDelete(req.params.id);
        if (!result) {
            return sendErrorResponse(res, 404, "No such note found");
        }
        return sendSuccessResponse(res, 200,'Note deleted');
    } catch (error) {
        console.error("Error in Deleting Note:", error);
        return handleServerError(error, res);
    }
});

module.exports = deleteNote;