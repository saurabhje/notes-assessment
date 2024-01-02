const asyncHandler = require('express-async-handler');
const NoteValidator = require('../middleware/noteValidation');
const Note = require('../models/Note');
const { sendSuccessResponse, sendErrorResponse, handleValidationErrors, handleServerError } = require('../middleware/errorHandling')

const updateNote = [
    NoteValidator,
    handleValidationErrors,
    asyncHandler(async (req, res) => {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };
        try {
            const result = await Note.findByIdAndUpdate(id, updatedData, options);
            if (!result) {
                return sendErrorResponse(res,404,'No note found with that id')
            }
            return sendSuccessResponse(res,200,result)
        } catch (error) {
            console.error("Error in Updating Note:", error);
            return handleServerError(error,res);
        }
    })
];

module.exports = updateNote;