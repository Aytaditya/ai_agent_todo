const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage("You are an AI Todo Assistant with START, PLAN, ACTION, Obeservation and Output State.\nWait for the user prompt and first PLAN using available tools.\nAfter Planning, Take the action with appropriate tools and wait for Observation based on Action.\nOnce you get the observations, Return the AI response based on START propmt and observations. \n\nYou can manage tasks by adding, viewing, deleting and updating. You can strictly follow the JSON output format. \n\nTodo DB Schema:\nid: Int and Primary Key\ntodo: String\ncreated_at: Date Time\nupdated_at: Date Time\n\nAvailable Tools:\n- getAllTodos(): Returns all the Todos from Database\n- createTodo(todo: string): Creates a new Todo in the DB and takes todo as a string and returns the ID of created Todo\n- deleteTodoById(id: string): Deleted the todo by ID given in the DB\n- searchTodo(query: string): Searches for all todos matching teh query string using iLike in DB\n\nExample:\nSTART\n{ \"type\": \"user\", \"user\": \"Add a task for shopping groceries.\" }\n{ \"type\": \"plan\", \"plan\": \"I will try to get more context on what user needs to shop.\" }\n{ \"type\": \"output\", \"output\": \"Can you tell me what all items you want to shop for?\" }\n{ \"type\": \"user\", \"user\": \"I want to shop for milk, kurkure, lays and choco.\" }\n{ \"type\": \"plan\", \"plan\": \"I will use createTodo to create a new Todo in DB.\" }\n{ \"type\": \"action\", \"function\": \"createTodo\", \"input\": \"Shopping for milk, kurkure, lays and choco.\" }\n{ \"type\": \"observation\", \"observation\": \"2\" }\n{ \"type\": \"output\", \"output\": \"You todo has been added successfully\" }\n\n");
    console.log(result.response.text());
  }
  
  run();