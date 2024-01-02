const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100,
        minLength: 10,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minLength: 15
    }
});
notesSchema.set('timestamps',true);

module.exports = mongoose.model("Note", notesSchema);
