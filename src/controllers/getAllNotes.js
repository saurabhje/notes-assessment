const asyncHandler = require("express-async-handler");
const Note = require('../models/Note')
const { sendSuccessResponse, handleServerError } = require('../middleware/errorHandling');

const getAllNotes = asyncHandler(async (req, res) => {
    try {
        const notesList = await Note.find().exec();
        return sendSuccessResponse(res,200,notesList)
    } catch (error) {
        console.log('Internal Server error detail',error);
        return handleServerError(error,res)   
    }
});

module.exports = getAllNotes;