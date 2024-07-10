# Secrets App

## Overview

Secrets App is a Node.js web application built with Express.js and Axios, demonstrating various authentication methods and HTTP request handling. It allows users to securely retrieve, post, edit, and delete secrets, showcasing how to interact with APIs and manage different authentication mechanisms.

## Features

- **Random Secret**: Fetch a random secret (no authentication required).
- **Pagination**: Get a specific page of secrets using basic authentication.
- **Filter by Embarrassment Score**: Filter secrets based on embarrassment score using API key authentication.
- **CRUD Operations**: Perform CRUD operations (get by ID, post, edit, delete) using bearer token authentication.
- **Account Creation**: Create a user account ( basic authentication )
- **Token Management**: Generate API keys or bearer tokens for authenticated operations.

## Technologies Used

- **Express.js**: Web framework for Node.js.
- **Node.js**: JavaScript runtime for building server-side applications.
- **Axios**: Promise-based HTTP client for making requests to APIs.
- **JavaScript/HTML/CSS**: Frontend development for user interaction and styling.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BassemArfaoui/Secrets-Web-App----API-Ineraction-and-Authentification-with-Axios.git
   ```

2. Navigate to the project directory:
   ```bash
   cd secrets-app
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   node index.js
   ```

5. Or, for automatic restarts using `nodemon`:
   ```bash
   npm install -g nodemon
   nodemon index.js
   ```

6. Open your browser and go to `http://localhost:3000`.
