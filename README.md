# Online Quiz Application

## Project Setup Guide

Follow these steps to set up the **Online Quiz Application** project.

---

### 1. Fork and Clone the Project
```bash
# Fork the project from GitHub
# Then clone it to your local machine
git clone <your_project_url>
cd <your_project_folder>
```

---

### 2. Install Dependencies
```bash
npm install
```

---

### 3. Setup Database
Open MySQL and create a database for the project:
```bash
mysql -u root -p
```
Enter you password
```sql
CREATE DATABASE onlineQuizApplication_db;
```

---

### 4. Configuration File
- Create a configuration file at `src/config/config.json`
- configure your database `username` and `password` in the `development` section.
```json
{
  "development": {
    "username": "your-db-username",
    "password": "your-db-password",
    "database": "onlineQuizApplication_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

---

### 5. Setup Environment Variables
Create a `.env` file in the root directory of your project:
```
PORT=3002
NODE_ENV=development
```

---

### 6. Run Migrations
Go to the `src` folder and run database migrations:
```bash
npx sequelize-cli db:migrate
```
---

### 7. Start the Project
Go back to root Folder and start the project
```bash
npm run start
```

---

### 8. Access the Application
Test the application in your web browser | postman:
- Methods: GET
- Endpoint: `http://localhost:3002/api/v1/info`
- Headers: Content-Type: application/json
```
{
  "success": true,
  "message": "Api is up",
  "error": {},
  "data": {}
}
```
---