const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Note = require('../src/models/Note');
const getAllNotes = require('../src/controllers/getAllNotes');

let mongod;

beforeAll(async () => {
  // Set up MongoDB memory server
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);

  // Insert test data into the in-memory database
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
app.get('/notes', getAllNotes);

// Test suite for the '/notes' endpoint
describe('GET /notes', () => {
  it('should get all notes', async () => {
    const response = await request(app)
      .get('/notes')
      .expect(200);

    const notesList = response.body;
    expect(notesList.success).toBe(true);
    expect(notesList.data).toHaveLength(3);
    expect(notesList.data[0].title).toBe('Note 1 Note 1')
    expect(notesList.data[0].content).toBe('Test content 1 for retrieving purpose')
  });

  it('should return an empty array when there are no notes', async () => {
    // Clearing the database to simulate no notes
    await Note.deleteMany({});

    const response = await request(app)
      .get('/notes')
      .expect(200);

    const notesList = response.body;
    expect(notesList.success).toBe(true);
    expect(notesList.data).toHaveLength(0);
  });

  it('should handle internal server error', async () => {
    // Disconnect the MongoDB connection to simulate an internal server error
    await mongoose.disconnect();
  
    const response = await request(app)
      .get('/notes')
      .expect(500);
  
    const errorResponse = response.body;
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.error).toBeDefined();
  
  });
  
});


