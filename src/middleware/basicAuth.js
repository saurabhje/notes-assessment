const { sendErrorResponse } = require("./errorHandling");

// Hardcoded username and password
const expectedUsername = 'admin';
const expectedPassword = 'wan1ting';

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const credentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
    const [username, password] = decodedCredentials.split(':');
    if (username === expectedUsername && password === expectedPassword) {
      next();
    } else {
      return sendErrorResponse(res, 401, 'Unauthorized');
    }
  } else {
    return sendErrorResponse(res, 401, 'Authorization header missing');
  }
}

module.exports = isAuth;
