# Node.js E-Commerce API

This is the backend for a Node.js-based E-Commerce application built using the Express framework.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication with JSON Web Tokens (JWT)
- Password hashing with bcrypt
- Express middleware for handling asynchronous operations
- Validation with express-validator
- MongoDB integration with Mongoose
- Image processing with Sharp
- File uploading with Multer
- Email sending with Nodemailer
- Payment processing with Stripe
- CORS handling
- Logging with Morgan
- Environment variables management with dotenv
- Slug generation with Slugify
- Compression for response payloads
- UUID generation

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- MongoDB (or your preferred database)
- Stripe account for payment processing

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/node-js-ecommerce-api.git


Navigate to the project directory:

cd node-js-ecommerce-api
Install dependencies:


npm install

Configuration
Create a .env file in the root directory:
PORT=8000
NODE_ENV=development
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=your-stripe-secret-key


Replace the placeholder values with your specific configuration.

Usage
To start the development server, run:
npm run start:dev

For production:
npm run start:prod

The API will be accessible at http://localhost:8000 by default.

Scripts
start:dev: Start the development server using nodemon.
start:prod: Start the production server.

Dependencies
bcrypt
colors
compression
cors
dotenv
express
express-async-handler
express-validator
jsonwebtoken
mongoose
morgan
multer
nodemailer
sharp
slugify
stripe
uuid
Dev Dependencies
cross-env
eslint
eslint-config-airbnb
eslint-config-prettier
eslint-plugin-import
eslint-plugin-jsx-a11y
eslint-plugin-node
eslint-plugin-prettier
eslint-plugin-react
nodemon
prettier
Contributing
Feel free to contribute to this project. Fork and create a pull request with your improvements.
