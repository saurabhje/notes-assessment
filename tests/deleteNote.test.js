const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Note = require('../src/models/Note');
const isAuth = require('../src/middleware/basicAuth');
const deleteNote = require('../src/controllers/deleteNote');

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
//sending get request to 'api/delete/:id' which is endpoint to access, delete a note with the given id
app.delete('/delete/:id', isAuth, deleteNote);

describe('Testing /api/delete/:id method', () => {
    it('Deleting a note with given id', async() => {
        const existentNote = await Note.findOne()  //extracting the id of an existing note
        const id = existentNote._id
        const response = await request(app)
            .delete(`/delete/${id}`)
            .set('Authorization', 'Basic ' + Buffer.from('admin:wan1ting').toString('base64'))
            .expect(200);

        const result = response.body;
        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();
        expect(result.data).toBe('Note deleted')
        const deletedNote = await Note.findById(id);
        expect(deletedNote).toBeNull(); // Note should not exist in Database after deletion
    }); 

    it('Trying to delete a note without Authorization', async() => {
        const id= new mongoose.Types.ObjectId();
        const response = await request(app)
            .delete(`/delete/${id}`)
            .expect(401);

        const result = response.body;
        expect(result.success).toBe(false);
        expect(result.error).toBe('Authorization header missing');
    }); 

    it('Trying to delete a non existend note', async() => {
        const id= new mongoose.Types.ObjectId();
        const response = await request(app)
            .delete(`/delete/${id}`)
            .set('Authorization', 'Basic ' + Buffer.from('admin:wan1ting').toString('base64'))
            .expect(404);

        const result = response.body;
        expect(result.success).toBe(false);
        expect(result.error).toBe('No such note found');
    }); 

    
})