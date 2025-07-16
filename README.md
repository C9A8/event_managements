

# Event Management API
This repository contains the backend API for an Event Management system. It's built with Node.js, Express, and uses PostgreSQL as its database.

# Setup Instructions
Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository
First, clone the repository to your local machine:
```
git clone https://github.com/C9A8/event_managements.git
cd event_managements

```
### 2. Install Dependencies
Install the necessary Node.js packages:
```
npm install
```

### 3. Database Setup

a. Create a new PostgreSQL database

CREATE DATABASE event_management_db;


b. Environment Variables

Create a .env file

# Database Configuration
DATABASE_URL=""
#PORT
PORT=3000 # Port for the API server


```

   ### 4. Start the Application
Once the dependencies are installed and the database is configured, you can start the API server:
```
npm run dev
```

The API server should now be running, typically on http://localhost:3000/api
