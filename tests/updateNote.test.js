const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Note = require('../src/models/Note');
const isAuth = require('../src/middleware/basicAuth');
const updateNote = require('../src/controllers/updateNote');

let mongod;
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    const testData = [
        { title: 'Note 1 Note 1', content: 'Test content 1 for retrieving purpose' },
        { title: 'Note 2 Note 2', content: 'Test content 2 for fetching purpose' },
        { title: 'Note 3 Note 2', content: 'Test content 3 for fetching purpose' },
    ];
    await Note.insertMany(testData);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

const app = express();
app.use(bodyParser.json());
//sending patch request to 'api/update/:id' which is endpoint to access, update and then return a note with the id
app.patch('/update/:id', isAuth, updateNote);

describe('Stimulating patch request /api/update/:id', () => {

    it('Should result in error failing authorization, with no header', async () => {
        const id = new mongoose.Types.ObjectId();
        const response = await request(app)
            .patch(`/update/${id}`)
            .send({
                title: 'xyz',
                content: 'Test Content'
            })
            .expect(401);

        const result = response.body;
        expect(result.success).toBe(false);
        expect(result.error).toBe('Authorization header missing');
    });

    it('Should result in error failing authorization, wrong credentials', async () => {
        const id = new mongoose.Types.ObjectId();
        const response = await request(app)
            .patch(`/update/${id}`)
            .set('Authorization', 'Basic ' + Buffer.from('admin:wrongpw').toString('base64'))
            .send({
                title: 'xyz',
                content: 'Test Content'
            })
            .expect(401);

        const result = response.body;
        expect(result.success).toBe(false);
        expect(result.error).toBe('Unauthorized');
    });

    it('Accessing non existing note', async () => {
        const id = new mongoose.Types.ObjectId();
        console.log(id)
        const response = await request(app)
            .patch(`/update/${id}`)
            .set('Authorization', 'Basic ' + Buffer.from('admin:wan1ting').toString('base64'))
            .send({
                title: 'XYZZZZZZZZ',
                content: 'Test ContentTTTTTTTTTTTTTTTTT'
            })
            .expect(404);

        const result = response.body;
        expect(result.success).toBe(false);
        expect(result.error).toBe('No note found with that id');
    });

    it('Validation Error', async () => {
        const existing_note = await Note.findOne();
        const id = existing_note._id;
        const response = await request(app)
            .patch(`/update/${id}`)
            .set('Authorization', 'Basic ' + Buffer.from('admin:wan1ting').toString('base64'))
            .send({
                title: 'XZZ',
                content: 'Test ContentTTTTTTTTTTTTTTTTT'
            })
            .expect(400);

        const result = response.body;
        expect(result.success).toBe(false);
        expect(result.error).toBe('Title must be between 5 and 100 characters');
    });

    it('Successful updation after authorization, validation', async () => {
        const existing_note = await Note.findOne();
        const id = existing_note._id;
        const response = await request(app)
            .patch(`/update/${id}`)
            .set('Authorization', 'Basic ' + Buffer.from('admin:wan1ting').toString('base64'))
            .send({
                title: 'This is funny',
                content: 'This should be the changed content'
            })
            .expect(200);

        const existingNoteBeforeUpdate = response.body;
        expect(existingNoteBeforeUpdate.success).toBe(true);
        expect(existingNoteBeforeUpdate.data).toBeDefined();
        expect(existingNoteBeforeUpdate.data.title).toBe('This is funny');
        //the title and content should be different than the existing one
        expect(existingNoteBeforeUpdate.data.title).not.toBe(existing_note.title);
        expect(existingNoteBeforeUpdate.data.content).not.toBe(existing_note.content);
    });

})