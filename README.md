# Fullstack Modern App

This is a full-stack budget tracker application built with Next.js, TypeScript, and MongoDB. It includes features such as user authentication, budget management, and CRUD operations for budget items.

## Table of Contents

- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing the Application](#testing-the-application)
- [Docker Setup](#docker-setup)
- [Author](#author)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sebxp/budget-tracker.git
   cd budget-tracker
   ```

2. **Install dependencies:**

   Ensure you have Node.js and npm installed. Then run:

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the following:

   ```plaintext
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

## Running the Application

1. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

2. **Build and start the production server:**

   ```bash
   npm run build
   npm start
   ```

## Testing the Application

1. **Run unit and integration tests:**

   Ensure you have Jest installed globally or use npx:

   ```bash
   npm test
   ```

   This will run all tests in the `__tests__` directory.

## Docker Setup

1. **Build the Docker image:**

   ```bash
   docker build -t budget-tracker .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -p 3000:3000 budget-tracker
   ```

3. **Using Docker Compose:**

   Ensure you have Docker Compose installed, then run:

   ```bash
   docker-compose up
   ```

   This will start both the application and the MongoDB service as defined in the `docker-compose.yml` file.

## Author

**Sebastián Pulgarín Yepes**

- Email: [sebxxxp@gmail.com](mailto:sebxxxp@gmail.com)
- LinkedIn: [https://www.linkedin.com/in/sebxxx/](https://www.linkedin.com/in/sebxxx/)
- Phone: +573177593050
- GitHub: [https://github.com/sebxp/](https://github.com/sebxp/)