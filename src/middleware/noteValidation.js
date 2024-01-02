const { body } = require('express-validator');

const NoteValidator = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .escape()
        .withMessage('Title must be between 5 and 100 characters'),

    body('content')
    .trim().isLength({ min: 15 })
    .escape()
    .withMessage('Content must not be less than 15 characters'),
];

module.exports = NoteValidator;
