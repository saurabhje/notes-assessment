const Note = require('../models/Note');
const NoteValidator = require("../middleware/noteValidation");
const asyncHandler = require("express-async-handler");
const { sendSuccessResponse, handleServerError, handleValidationErrors} = require('../middleware/errorHandling');

const createNote = [
    NoteValidator,
    handleValidationErrors,
    asyncHandler(async (req, res) => {
    const newNote = new Note({
        title: req.body.title,
        content: req.body.content
    });
    try {
        const savedNote = await newNote.save();
        return sendSuccessResponse(res, 201, savedNote);
    } catch (error) {
        console.error('Error in Creating Note:', error);
        return handleServerError(error, res);
    }
})
];

module.exports = createNote;
