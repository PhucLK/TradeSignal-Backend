# TradeSignal Backend

## Overview
The TradeSignal Backend is a Node.js application that provides APIs for managing users, signals, notifications, and tokens. It is built using Express.js and MongoDB, and integrates with Firebase for push notifications.

## Project Structure
```
package.json
vercel.json
src/
    server.js
    models/
        Signal.js
        SignalStats.js
        Token.js
        User.js
    routes/
        auth.js
        health.js
        notification.js
        signals.js
        token.js
        user.js
    seeders/
        initDatabase.js
    services/
        firebaseNotification.js
        signalAnalyzer.js
```

### Key Directories
- **models/**: Contains Mongoose models for MongoDB collections.
- **routes/**: Defines API endpoints for authentication, notifications, signals, and more.
- **seeders/**: Scripts for initializing the database with default data.
- **services/**: Contains reusable service logic, such as Firebase notifications.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TradeSignal-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   FIREBASE_SERVICE_ACCOUNT=<path-to-your-firebase-service-account-json>
   ```

4. Run the database seeder:
   ```bash
   node src/seeders/initDatabase.js
   ```

## Usage

### Start the Server
To start the development server:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

### API Endpoints

#### Health

- **GET api/health**: Check the server status.

#### Authentication
- **POST api/auth/register**: Register a new user.
- **POST api/auth/login**: Log in a user.

#### Notifications
- **POST api/notification/noti**: Send a push notification.

#### Signals
- **GET api/signals**: Fetch trading signals.

#### Tokens
- **POST api/token**: Register or update a token.

## Deployment

This project is configured for deployment on Vercel. Ensure the `vercel.json` file is correctly set up for your deployment needs.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License.