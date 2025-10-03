# Online Quiz Application

![Project Banner](./assets/banner.png)

## About

This project is an **Online Quiz Application** designed to enable creating, managing, and taking quizzes featuring various question types such as single choice, multiple choice, and text input. 

Built with Node.js, Express, and MySQL (via Sequelize ORM), the application provides a scalable backend API with features including:

- Robust quiz and question management
- Accurate scoring with support for partial credit and negative marking
- Transaction-safe operations ensuring data integrity
- Clear separation of concerns with repository, service, and controller layers
- Comprehensive input validation and global error handling
- Automated tests covering critical functionalities

This system is ideal for educational tools, corporate training, or interactive online quizzes, aiming to deliver a reliable and extensible foundation for quiz platforms.

## Important Links

- **Database Diagram:** [Open Database diagram](https://dbdocs.io/vivektarun1234/Online-Quiz-Application?view=relationships)
- **SQL Query Runner:** [RunSql](https://runsql.com/r/c7dc9e5e75f6eaea)
- **Sequence Diagram:** [Download Sequence Diagram](./assets/sequence-diagram.svg)
- **Flow Diagram:** [Download Add Question Flow Diagram](./assets/add-question-flow-diagram.svg)
- **Flow Diagram:** [Download Submission Flow Diagram](./assets/Submission-flow-diagram.svg)
- **Canvas:** [Download Canvas](https://github.com/yourusername/your-repo-name/blob/main/LICENSE)




## Project Setup Guide

Follow these steps to set up the **Online Quiz Application** project.

### 1. Fork and Clone the Project
```bash
# Fork the project from GitHub
# Then clone it to your local machine
git clone <your_project_url>
cd <your_project_folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
Open MySQL and create a database for the project using root or any other user with sufficient privileges.
```bash
mysql -u root -p
```
Enter you password
```sql
CREATE DATABASE online_quiz_application_db;
```

### 4. Configuration File
- Create a configuration file at `src/config/config.json`
- configure your database `username` and `password` in the `development` section.
```json
{
  "development": {
    "username": "your-db-username",
    "password": "your-db-password",
    "database": "online_quiz_application_db",
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

### 5. Setup Environment Variables
Create a `.env` file in the root directory of your project:
```
PORT=3002
NODE_ENV=development
```

### 6. Run Migrations
Go to the `src` folder and run database migrations:
```bash
npx sequelize-cli db:migrate
```

### 7. Start the Project
Go back to root Folder and start the project
```bash
npm run start
```

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

## Important APIs

### 1. Create Quiz
- Methods: POST
- Endpoint: `/api/v1/quizzes`
- Headers: Content-Type: application/json
```json
{
  "title": "Programming Concepts Quiz"
}
```
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "id": 1,
    "title": "General Knowledge Quiz",
    "createdAt": "2025-10-01T01:00:00.000Z",
    "updatedAt": "2025-10-01T01:00:00.000Z"
  },
  "error": {}
}
```
### 2. Create Question
- Methods: POST
- Endpoint: `/api/v1/questions`
- Headers: Content-Type: application/json

**Single choice Question**

Request
```json
{
  "quizId": 1,
  "text": "Which keyword is used to define a constant in JavaScript?",
  "type": "single_choice",
  "points": 2,
  "negativePoints": 1,
  "answers": [
    { "text": "let", "isCorrect": false },
    { "text": "const", "isCorrect": true },
    { "text": "var", "isCorrect": false }
  ]
}
```
Response
```json
{
    "success": true,
    "message": "Question created successfully",
    "data": {
        "id": 2,
        "quizId": 1,
        "text": "Which keyword is used to define a constant in JavaScript?",
        "type": "single_choice",
        "points": "2.00",
        "negativePoints": "1.00",
        "createdAt": "2025-10-01T14:57:30.000Z",
        "updatedAt": "2025-10-01T14:57:30.000Z",
        "answers": [
            {
                "id": 1,
                "text": "let",
                "isCorrect": false
            },
            {
                "id": 2,
                "text": "const",
                "isCorrect": true
            },
            {
                "id": 3,
                "text": "var",
                "isCorrect": false
            }
        ]
    },
    "error": {}
}
```
**Multiple choice Question**

Request
```json
{
  "quizId": 1,
  "text": "Which of the following are valid variable names in Python?",
  "type": "multiple_choice",
  "points": 4,
  "negativePoints": 2,
  "answers": [
    { "text": "first_name", "isCorrect": true }, 
    { "text": "1_variable", "isCorrect": false }, 
    { "text": "_var", "isCorrect": true },        
    { "text": "var_2", "isCorrect": true }        
  ]
}
```
Response
```json
{
    "success": true,
    "message": "Question created successfully",
    "data": {
        "id": 3,
        "quizId": 1,
        "text": "Which of the following are valid variable names in Python?",
        "type": "multiple_choice",
        "points": "4.00",
        "negativePoints": "2.00",
        "createdAt": "2025-10-01T15:02:10.000Z",
        "updatedAt": "2025-10-01T15:02:10.000Z",
        "answers": [
            {
                "id": 4,
                "text": "first_name",
                "isCorrect": true
            },
            {
                "id": 5,
                "text": "1_variable",
                "isCorrect": false
            },
            {
                "id": 6,
                "text": "_var",
                "isCorrect": true
            },
            {
                "id": 7,
                "text": "var_2",
                "isCorrect": true
            }
        ]
    },
    "error": {}
}
```
**Text Input Question**

Request
```json
{
  "quizId": 1,
  "text": "What is the typeof value for an array in JavaScript?",
  "type": "text",
  "points": 2,
  "negativePoints": 1,
  "answers": [
    { "text": "object", "isCorrect": true }
  ]
}
```
Response
```json
{
    "success": true,
    "message": "Question created successfully",
    "data": {
        "id": 4,
        "quizId": 1,
        "text": "What is the typeof value for an array in JavaScript?",
        "type": "text",
        "points": "2.00",
        "negativePoints": "1.00",
        "createdAt": "2025-10-01T15:05:14.000Z",
        "updatedAt": "2025-10-01T15:05:14.000Z",
        "answers": [
            {
                "id": 8,
                "text": "object",
                "isCorrect": true
            }
        ]
    },
    "error": {}
}
```
### 3. Get All Question with `quizId`
- Methods: GET
- Endpoint: `/api/v1/questions?quizId=1`
- Headers: Content-Type: application/json

Response
```json
{
    "success": true,
    "message": "Questions with answers fetched successfully",
    "data": [
        {
            "id": 2,
            "quizId": 1,
            "text": "Which keyword is used to define a constant in JavaScript?",
            "type": "single_choice",
            "points": "2.00",
            "negativePoints": "1.00",
            "createdAt": "2025-10-01T14:57:30.000Z",
            "updatedAt": "2025-10-01T14:57:30.000Z",
            "answers": [
                {
                    "id": 1,
                    "text": "let"
                },
                {
                    "id": 2,
                    "text": "const"
                },
                {
                    "id": 3,
                    "text": "var"
                }
            ]
        },
        {
            "id": 3,
            "quizId": 1,
            "text": "Which of the following are valid variable names in Python?",
            "type": "multiple_choice",
            "points": "4.00",
            "negativePoints": "2.00",
            "createdAt": "2025-10-01T15:02:10.000Z",
            "updatedAt": "2025-10-01T15:02:10.000Z",
            "answers": [
                {
                    "id": 4,
                    "text": "first_name"
                },
                {
                    "id": 5,
                    "text": "1_variable"
                },
                {
                    "id": 6,
                    "text": "_var"
                },
                {
                    "id": 7,
                    "text": "var_2"
                }
            ]
        },
        {
            "id": 4,
            "quizId": 1,
            "text": "What is the typeof value for an array in JavaScript?",
            "type": "text",
            "points": "2.00",
            "negativePoints": "1.00",
            "createdAt": "2025-10-01T15:05:14.000Z",
            "updatedAt": "2025-10-01T15:05:14.000Z"
        }
    ],
    "error": {}
}
```

### 4. Submission
- Methods: POST
- Endpoint: `/api/v1/submissions`
- Headers: Content-Type: application/json

Request
```json
{
  "quizId": 1,
  "answers": [
    { "questionId": 2, "selectedAnswerId": 2 },
    { "questionId": 3, "selectedAnswerId": [4,6] },
    { "questionId": 4, "textAnswer": "object" }
  ]
}
```
Response
```json
{
    "success": true,
    "message": "Submission recorded successfully",
    "data": {
        "quizId": 1,
        "totalScore": 8,
        "ScoreObtained": 6.666666666666666
    },
    "error": {}
}
```
### 5. List of All available Quizzes
- Methods: GET
- Endpoint: `/api/v1/quizzes`
- Headers: Content-Type: application/json

Response
```json
{
    "success": true,
    "message": "Quizzes fetched successfully",
    "data": [
        {
            "id": 1,
            "title": "Programming Concepts Quiz",
            "createdAt": "2025-10-01T08:47:44.000Z",
            "updatedAt": "2025-10-01T08:47:44.000Z"
        },
        {
            "id": 2,
            "title": "Shell Scripting quiz",
            "createdAt": "2025-10-01T17:22:31.000Z",
            "updatedAt": "2025-10-01T17:22:31.000Z"
        }
    ],
    "error": {}
}
```