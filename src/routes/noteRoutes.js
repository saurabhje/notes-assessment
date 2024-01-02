const express = require('express');
const router = express.Router();
const createNote = require('../controllers/createNote');
const deleteNote = require('../controllers/deleteNote');
const getSingleNote = require('../controllers/getSingleNote');
const updateNote = require('../controllers/updateNote');
const getAllNotes = require('../controllers/getAllNotes');
const isAuth = require('../middleware/basicAuth')

// protected endpoint to create a note
router.post('/create-note', isAuth, createNote);

// Endpoint to get all notes
router.get('/notes', getAllNotes);

// Endpoint to get a specific note with id
router.get('/note/:id', getSingleNote);

// protected endpoint to update the notes with a specific id
router.patch('/update/:id', isAuth, updateNote);

// protected ndpoint to delete the notes with a specific id
router.delete('/delete/:id', isAuth, deleteNote);

module.exports = router;
