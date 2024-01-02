const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Note = require('../src/models/Note');
const getSingleNote = require('../src/controllers/getSingleNote');


let mongod;

beforeAll(async () => {
    // Setting up MongoDB memory server
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);

    // Insert test data into the in-memory database for data retrieval
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
//sending get request to 'api/note/:id' which is endpoint to retrieve note with its id
app.get('/note/:id', getSingleNote);


describe('Get request to /api/note/:id', () => {
    it('Should retrieve an existing note with the given id', async () => {
        const existingNote = await Note.findOne()
        const noteId = existingNote._id;

        const response = await request(app)
            .get(`/note/${noteId}`)
            .expect(200)

        const noteRetrieve = response.body;
        expect(noteRetrieve.success).toBe(true); //Only one note should be retrieved

        // checking the structure of the Retrieved Data
        expect(noteRetrieve.data).toBeDefined();
        expect(noteRetrieve.data).toHaveProperty('title');
        expect(noteRetrieve.data).toHaveProperty('content');
        expect(noteRetrieve.data).toHaveProperty('createdAt');
        expect(noteRetrieve.data).toHaveProperty('updatedAt');
        expect(noteRetrieve.data.title).toBe(existingNote.title);
        expect(noteRetrieve.data.content).toBe(existingNote.content);
    });

    it('trying to retrieve an inexistent note', async() => {
        const noteId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/note/${noteId}`)
            .expect(404)   //no such note found

        const nonExistingNote = response.body;
        expect(nonExistingNote.success).toBe(false);
        expect(nonExistingNote.error).toBe('No note found :(');
    });
    
})