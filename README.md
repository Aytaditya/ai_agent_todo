# Todo Assistant with AI Agent

An intelligent todo list application using an AI agent built with Google's Gemini Pro model and Drizzle ORM for database management. The application provides a natural language interface to manage your todos through an interactive command-line interface.

## 🚀 Features

- Natural language todo management
- Intelligent AI agent interactions
- Persistent storage using PostgreSQL
- Interactive command-line interface
- Support for:
  - Creating todos with detailed descriptions
  - Searching todos
  - Deleting todos
  - Viewing all todos

## 🛠️ Tech Stack

- Node.js
- Google Gemini Pro AI
- PostgreSQL (via Docker)
- Drizzle ORM
- Docker for database containerization

## 📋 Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Google Cloud Platform account with Gemini API access

## 🔧 Setup

### 1. Database Setup with Docker

Create a `docker-compose.yml` file:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: your_username
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: todo_db
    ports:
      - "5431:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start the database:
```bash
docker-compose up -d
```

### 2. Install Dependencies

```bash
npm install drizzle-orm pg @google/generative-ai dotenv readline-sync
npm install -D drizzle-kit @types/pg
```

### 3. Environment Setup

Create a `.env` file:
```env
DATABASE_URL="postgres://your_username:your_password@localhost:5431/todo_db"
GEMINI_API_KEY="your_gemini_api_key"
```

### 4. Database Schema

Create a schema file at `db/schema.js`:
```javascript
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: serial("id").primaryKey(),
  todo: text("todo").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});
```

### 5. Database Migration

1. Generate the migration:
```bash
npx drizzle-kit generate:pg
```

2. Run the migration (using your database connection setup)

## 🚀 Usage

1. Start the application:
```bash
node index.js
```

2. Available Commands:
   - Add a todo: `add a todo`
   - Add a specific todo: `add a grocery todo`
   - Search todos: `search todo`
   - Delete todo: `delete todo`
   - Exit: `exit`

Example interaction:
```
Todo Assistant Started!

You: add a grocery todo
AI: What items would you like to add to your grocery list?

You: milk, eggs, and bread
AI: Successfully created todo: Buy groceries: milk, eggs, and bread
```

## 📁 Project Structure

```
.
├── db/
│   ├── index.js           # Database connection setup
│   └── schema.js          # Database schema definition
├── drizzle/
│   └── migrations/        # Generated migrations
├── .env                   # Environment variables
├── docker-compose.yml     # Docker configuration
├── index.js              # Main application file
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🔑 Important Notes

- Keep your API keys secure and never commit them to version control
- The application uses Docker for database management, ensure Docker is running before starting the application
- The AI agent requires an internet connection to function
- Always backup your database before running migrations