It provides API endpoints for user authentication, cart management, and dish management. It's built with Node.js, Express, and MongoDB.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [API Documentation](#api-documentation)

## Installation

1. Clone the repository to your local machine.
   ```bash
   git clone https://github.com/immy458/opstech-backend.git
   ```
2. cd backend
3. npm install

## Environment Variables

To run the backend, you need to create a .env file in the backend's root directory with the following environment variables:

1. MONGO_CONNECTION_STRING: Connection string for MongoDB.
2. SALT_ROUNDS: Number of rounds for hashing passwords.
3. APP_PORT: The port on which the backend server runs.
4. SECRET_STRING: Secret key signing JWT.
5. CLIENT_URL: The frontend application URL (used for redirects & cors).
6. GMAIL_APP_PASSWORD: App-specific password for Gmail for sending email.
7. EMAIL_ID: Email address for sending emails.

## Development

To start the backend in development mode, use:

1. npm start

## API Documentation

The API documentation is located in the docs folder. You can explore the available endpoints using Swagger UI or other tools compatible with OpenAPI.
