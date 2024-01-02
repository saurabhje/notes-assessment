const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const bodyParser = require('body-parser');
const createNote = require('../src/controllers/createNote');
const mongoose = require('mongoose');
const isAuth = require('../src/middleware/basicAuth');

//using testing database to test the validation failure and success 
let mongod
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

const app = express();
app.use(bodyParser.json());
app.post('/create-note', isAuth, createNote);

describe('This API endpoint create new notes, it is protected using baasic Auth', () => {

    test('Checking authorization header', async () => {
        const response = await request(app)
            .post('/create-note')
            .send({
                title: 'xyz',
                content: 'Test Content'
            })
            .expect(401); //No  header is provided

        const authErros = response.body;
        expect(authErros.success).toBe(false);
        expect(authErros.error).toBe('Authorization header missing')

    });

    test('Checking authorization header value', async () => {
        const response = await request(app)
            .post('/create-note')
            .set('Authorization', 'Basic ' + Buffer.from('admin:wrongpw').toString('base64'))
            .send({
                title: 'abc',
                content: 'Saurabh Je content 2'
            })
            .expect(401);

        const authErros = response.body;
        expect(authErros.success).toBe(false);
        expect(authErros.error).toBe('Unauthorized') //Header is provided with wrong credentials
    });

    test('Correct authorization but validation error due to short title', async () => {
        const response = await request(app)
            .post('/create-note')
            .set('Authorization','Basic ' + Buffer.from('admin:wan1ting').toString('base64'))
            .send({
                title: 'Je',
                content: 'Test Content to check if Note creation endpoint works'
            })
            .expect(400); //Validation Error

        const savedNote = response.body;
        expect(savedNote.success).toBe(false);
        expect(savedNote.error).toBe('Title must be between 5 and 100 characters');
    });

    test('Correct authorization but validation error due to short title and content', async () => {
        const response = await request(app)
            .post('/create-note')
            .set('Authorization','Basic ' + Buffer.from('admin:wan1ting').toString('base64'))
            .send({
                title: 'Je',
                content: 'short Content'
            })
            .expect(400); //Validation Error

        const savedNote = response.body;
        expect(savedNote.success).toBe(false);
        expect(savedNote.error).toBe('Title must be between 5 and 100 characters, Content must not be less than 15 characters');
    });

    test('Correct authorization, sanitized and validated data', async () => {
        const response = await request(app)
            .post('/create-note')
            .set('Authorization','Basic ' + Buffer.from('admin:wan1ting').toString('base64'))
            .send({
                title: 'This should be saved',
                content: 'Je is writing content so it will pass validation, Real'
            })
            .expect(201); //Data saved successfully

        const savedNote = response.body;
        expect(savedNote.success).toBe(true);
        expect(savedNote.data.title).toBe('This should be saved');
        expect(savedNote.data.content).toBe('Je is writing content so it will pass validation, Real');
    });
});
