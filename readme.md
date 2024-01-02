# Notes Assessment
Simple Note-Taking RESTful API Documentation

### Project Structure
```
Notes-Assessment
│
├── src
│   ├── controllers
│   │   ├── CreateNote.js 
|   |   ├── deleteNote.js
|   |   ├── getAllNotes.js
|   |   ├── getSingleNote.js
│   │   └── updateNote.js
│   │
│   ├── models
│   │   └── Note.js
│   │
│   ├── routes
│   │   └── noteRoutes.js
│   │
│   ├── middleware  
│   │   ├── basicAuth.js
│   │   ├── noteValidation.js
│   │   └── errorHandlingMiddleware.js
│   │
│   │
│   └── app.js
│  
├── tests
│   ├── CreateNote.test.js 
|   ├── deleteNote.test.js
|   ├── getAllNotes.test.js
|   ├── getSingleNote.test.js
│   └── updateNote.test.js
│
├── server.js
├── .env
└── package.json 
```

## Run locally

1. Clone the repo:
```git clone https://github.com/your-username/Notes-Assessment.git```

2. Navigate to project directory:
```cd notes-assessment```

3. Install Dependencies:
```npm install```

4. Create Environment File:
```cp .env.example .env```
  MONGODB_URI = your mongodb connection 

5. Run the Application:
```npm start```

6. Access the api at http://localhost:3000


## Note Schema

The structure of a note in the API is defined by the following schema:

```json
{
  "_id": "string",
  "title": "string",
  "content": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Additional Information

- MongoDB is used as the database.
- Timestamps (`createdAt` and `updatedAt`) are automatically generated for each note.


## Endpoints

### 1. Create Note

- **Endpoint:**
  - `POST /create-note`

- **Request:**
  - Headers:
    - `Content-Type: application/json`
    - `Authorization: Basic base64(username:password)` (Optional)

  - Body:
    ```json
    {
      "title": "Note Title",
      "content": "Note Content"
    }
    ```
- **Response:**
  - Status Code: `201 Created`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "_id": "note-id",
        "title": "Note Title",
        "content": "Note Content",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```
    
### 2. Retrieve Notes
    this endpoint is used to retrieve all the notes from the database
- **Endpoint:**
  - `GET /notes`

  - **Response:**
  - Body:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "note-id",
          "title": "Note Title",
          "content": "Note Content",
          "createdAt": "timestamp",
          "updatedAt": "timestamp"
        },
        // ... additional notes
      ]
    }
    ```
### 3. Retrieve Single Note

- **Endpoint:**
  - `GET /notes/:id`


- **Response:**
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "_id": "note-id",
        "title": "Note Title",
        "content": "Note Content",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```

### 4. Update Note

- **Endpoint:**
  - `PUT /notes/:id`

- **Request:**
  - Headers:
    - `Content-Type: application/json`
    - `Authorization: Basic base64(username:password)` (Optional)

  - Body:
    ```json
    {
      "title": "Updated Title",
      "content": "Updated Content"
    }
    ```
- **Response:**
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "_id": "note-id",
        "title": "Updated Title",
        "content": "Updated Content",
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    }
    ```


### 5. Delete Note

- **Endpoint:**
  - `DELETE /notes/:id`

- **Request:**
  - Headers:
    - `Authorization: Basic base64(username:password)` (Optional)

- **Response:**
  - Status Code: `200 OK`
  - Body:
    ```json
    {
      "success": true,
      "data": "Note deleted"
    }
    ```

## Authentication

Basic-Auth is used securing endpoints 
`/api/create-note` 
`/api/delete/:id`
`/api/update/:id`

Credentials
    Username: admin
    Password: wan1ting


## Error Handling

The API returns appropriate error responses for different scenarios. Detailed error messages can be found in the `error` field of the response.

- **Status Code: `400 Bad Request`**
  - Invalid input or validation failure.

- **Status Code: `401 Unauthorized`**
  - Authorization header missing or incorrect credentials.

- **Status Code: `404 Not Found`**
  - Attempt to access or modify a non-existent note.

- **Status Code: `500 Internal Server Error`**
  - General server error.


## Testing

For testing the endpoints, the following libraries are utilized:
1. Jest
2. SuperTest - It enables the making of HTTP requests and assertion of responses
3. MongoDB-memory-server - MongoDB-memory-server is a utility utilized for creating an in-memory MongoDB database, serving as a mock for saving, deleting, and retrieving data during tests. 

