import { eq, ilike } from "drizzle-orm";
import { db } from "./db/index.js";
import { todosTable } from "./db/schema.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';
import readlineSync from 'readline-sync';

// Load API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("Error: Missing GEMINI_API_KEY in environment variables.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-pro",
});

const generationConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
};

// Database Operations with Error Handling
async function getAllTodos() {
    try {
        return await db.select().from(todosTable);
    } catch (error) {
        console.error("Error fetching todos:", error);
        throw error;
    }
}

async function createTodo(todo) {
    try {
        const [newTodo] = await db.insert(todosTable).values({ todo }).returning({ id: todosTable.id });
        return newTodo?.id;
    } catch (error) {
        console.error("Error creating todo:", error);
        throw error;
    }
}

async function searchTodo(search) {
    try {
        return await db.select().from(todosTable).where(ilike(todosTable.todo, `%${search}%`));
    } catch (error) {
        console.error("Error searching todos:", error);
        throw error;
    }
}

async function deleteTodoById(id) {
    try {
        await db.delete(todosTable).where(eq(todosTable.id, id));
        return true;
    } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
    }
}

const tools = {
    getAllTodos,
    createTodo,
    searchTodo,
    deleteTodoById,
};

const systemPrompt = `You are an AI Todo Assistant. Respond in JSON format only. Do not add any plain text responses.

IMPORTANT INSTRUCTION: For any todo creation, you MUST follow this two-step process:
1. First ask for specific details about the todo
2. Only create the todo after receiving those details

Example flows:

For grocery todo:
User: "add a grocery todo"
AI: {"type": "output", "output": "What items would you like to add to your grocery list?"}
User: "milk, eggs, bread"
AI: {"type": "action", "function": "createTodo", "input": "Buy groceries: milk, eggs, bread"}

For study todo:
User: "add a study todo"
AI: {"type": "output", "output": "What subject or topic would you like to study?"}
User: "math"
AI: {"type": "action", "function": "createTodo", "input": "Study math"}

Available functions:
- getAllTodos(): Returns all todos
- createTodo(todo: string): Creates a new todo
- searchTodo(query: string): Searches todos
- deleteTodoById(id: string): Deletes a todo

Response formats:
1. For asking questions: {"type": "output", "output": "your question here"}
2. For creating todos: {"type": "action", "function": "createTodo", "input": "todo text"}
3. For showing error: {"type": "error", "error": "error message"}

Never create a todo without first asking for specific details about it.`;

async function processAIResponse(response) {
    try {
        const action = JSON.parse(response);
        
        if (action.type === "output") {
            console.log("\nAI:", action.output);
            return true;
        } 
        else if (action.type === "action") {
            const result = await tools[action.function](action.input);
            console.log("\nAI: Successfully created todo:", action.input);
            return true;
        }
        else if (action.type === "error") {
            console.log("\nAI Error:", action.error);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error processing response:", error);
        return false;
    }
}

async function run() {
    console.log("AI Todo Assistant Started!");
    let chatHistory = [
        { role: "user", parts: [{ text: systemPrompt }] }
    ];

    while (true) {
        const input = readlineSync.question("\nYou: ");
        if (input.toLowerCase() === "exit") {
            console.log("Exiting AI Todo Assistant.");
            break;
        }

        try {
            // Add user input to history
            chatHistory.push({
                role: "user",
                parts: [{ text: input }]
            });

            // Get AI response
            const result = await model.generateContent({
                contents: chatHistory,
                generationConfig
            });

            const response = result.response.text();
            
            // Process the response
            const validResponse = await processAIResponse(response);
            
            if (validResponse) {
                // Add AI response to history
                chatHistory.push({
                    role: "model",
                    parts: [{ text: response }]
                });
            } else {
                console.log("\nAI: Sorry, I couldn't process that request. Please try again.");
            }

        } catch (error) {
            console.error("\nError:", error.message);
            console.log("Please try again.");
        }
    }
}

run();