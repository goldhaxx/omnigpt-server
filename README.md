# OmniGPT Server

OmniGPT Server is a robust backend service designed to facilitate interactions with multiple Large Language Model (LLM) APIs. The server enables the creation, management, and querying of user data, conversations, and API keys, while ensuring seamless communication with LLM providers such as OpenAI and Anthropic. The service is built using Node.js, Express, and various supporting libraries to ensure scalability, security, and ease of use.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Validation and Error Handling](#validation-and-error-handling)
- [Logging](#logging)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Create, update, delete, and manage users.
- **Conversation Management**: Handle conversations between users and LLMs, including message history.
- **API Provider Management**: Add, update, and delete API providers, allowing integration with multiple LLMs.
- **WebSocket Support**: Real-time communication and logging via WebSocket.
- **Input Validation**: Robust validation using `express-validator` to ensure the integrity of data.
- **Logging**: Comprehensive logging of all operations and requests for easy debugging and monitoring.

## Project Structure

![image](https://github.com/user-attachments/assets/fd164404-bdff-4734-9062-5fd9c07fe4b2)

```
├── README.md
├── package.json
├── server
│   ├── server.js                 # Server entry point
│   ├── messageBroker.js          # WebSocket message broker
├── controllers                   # Express controllers
│   ├── apiProviderController.js
│   ├── conversationController.js
│   ├── userController.js
│   ├── authController.js
│   ├── messageController.js
│   ├── userApiProviderController.js
├── routes                        # Express routes
│   ├── authRoutes.js
│   ├── userApiProviderRoutes.js
│   ├── messageRoutes.js
│   ├── userRoutes.js
│   ├── apiProviderRoutes.js
│   ├── conversationRoutes.js
├── services                      # Business logic and service functions
│   ├── userService.js
│   ├── apiKeyService.js
│   ├── userApiProviderService.js
│   ├── conversationService.js
│   ├── messageService.js
│   ├── apiProviderService.js
├── utils                         # Utility functions
│   ├── fileUtils.js
│   ├── logger.js
├── data                          # JSON data storage
│   ├── users.json
│   ├── conversations.json
│   ├── messages.json
│   ├── api_providers.json
│   ├── user_api_providers.json
│   ├── apiKeys.json
```

## Installation

### Prerequisites

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher)
- **Git** (for cloning the repository)

### Steps

1. **Clone the repository**:
    
    `git clone https://github.com/your-username/omnigpt-server.git cd omnigpt-server`
    
2. **Install dependencies**:
    
    `npm install`
    
3. **Start the server**:
    
    `npm start`
    
4. The server should now be running on `http://localhost:3001`.
    

## Configuration

### Environment Variables

You can configure the server using environment variables. Create a `.env` file in the root directory of the project:

env

`PORT=3001`
`NODE_ENV=development`

### Data Storage

The project stores data in JSON files located in the `data/` directory. These files include `users.json`, `conversations.json`, `messages.json`, `api_providers.json`, `user_api_providers.json`, and `apiKeys.json`. Ensure that these files are writable by the server process.

## API Endpoints

### Authentication

- **POST /api/login**
    - Logs in a user with their username and password.
    - Request body: `{ "username": "yourUsername", "password": "yourPassword" }`

### Users

- **POST /api/users**
    
    - Creates a new user.
    - Request body: `{ "username": "newUser", "email": "user@example.com", "password": "securePassword" }`
- **GET /api/users**
    
    - Fetches all users.
- **GET /api/users/**
    
    - Fetches a user by ID.
- **PUT /api/users/**
    
    - Updates user details by ID.
- **DELETE /api/users/**
    
    - Deletes a user by ID.

### Conversations

- **GET /api/conversations**
    
    - Fetches all conversations or conversations by a specific user using `?userId=USER_ID`.
- **POST /api/conversations**
    
    - Creates a new conversation.
    - Request body: `{ "title": "New Conversation", "userId": "USER_ID" }`
- **GET /api/conversations/**
    
    - Fetches a conversation by ID.
- **PUT /api/conversations/**
    
    - Updates a conversation's title by ID.
- **DELETE /api/conversations/**
    
    - Deletes a conversation by ID.

### Messages

- **POST /api/send-message**
    
    - Sends a message to an LLM API and stores the conversation.
    - Request body: `{ "conversationId": "CONVO_ID", "userInput": "Hello", "provider": "openai", "model": "gpt-4", "userId": "USER_ID" }`
- **GET /api/messages/**
    
    - Fetches all messages for a specific conversation.

### API Providers

- **POST /api/providers**
    
    - Adds a new API provider.
    - Request body: `{ "name": "ProviderName", "models": ["model1", "model2"] }`
- **GET /api/providers**
    
    - Fetches all API providers.
- **GET /api/providers/**
    
    - Fetches an API provider by ID.
- **PUT /api/providers/**
    
    - Updates the models for an API provider by ID.
- **DELETE /api/providers/**
    
    - Deletes an API provider by ID.

### User API Providers

- **POST /api/user-api-providers**
    
    - Associates a user with an API provider.
    - Request body: `{ "userId": "USER_ID", "providerId": "PROVIDER_ID", "apiKey": "API_KEY" }`
- **GET /api/user-api-providers**
    
    - Fetches all user API providers.
- **GET /api/user-api-providers/**
    
    - Fetches a user API provider by ID.
- **DELETE /api/user-api-providers/**
    
    - Deletes a user API provider by ID.

## Validation and Error Handling

- All user inputs are validated using `express-validator` to ensure data integrity.
- Comprehensive error handling is implemented across all services, with detailed logs stored in the `app.log` file.

## Logging

- The server uses the `winston` library for logging. Logs are output to both the console and a file (`data/app.log`).
- Log entries include timestamps, log levels, filenames, and detailed metadata for easy debugging.

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request. Ensure that your code adheres to the project's coding standards and is well-documented.

### How to Contribute

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes.
4. Commit your changes: `git commit -m 'Add new feature'`.
5. Push to the branch: `git push origin feature-branch-name`.
6. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
