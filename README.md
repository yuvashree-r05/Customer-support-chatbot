# Customer Support Chatbot

An AI-powered customer support chatbot built with JavaScript, React, Node.js, LangChain, Groq, Gemini Embeddings, Pinecone, and MongoDB.

The chatbot helps customers get answers to frequently asked questions, check their order status, and verify refund eligibility through an interactive chat interface.

## Features

### AI Chat Assistant
- Answers customer questions using an LLM.
- Uses LangChain and Groq for AI responses.
- Provides clear fallback responses when relevant information is unavailable.

### Retrieval-Augmented Generation (RAG)
- Stores FAQ knowledge using vector embeddings.
- Uses Gemini Embeddings to convert FAQ content into numerical vectors.
- Stores and retrieves vectors using Pinecone.
- Retrieves relevant FAQ information before generating responses.

### Order Management
- Checks order status using an order ID.
- Retrieves estimated delivery information.
- Checks refund eligibility based on delivery date and product damage status.
- Restricts order access to the authenticated customer.

### Authentication and Security
- Customer registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected API routes.
- User-specific chat history and order access.
- Request rate limiting.
- Centralized error handling.

### Chat History
- Saves customer conversations in MongoDB.
- Retrieves previous conversations for the logged-in customer.

## Tech Stack

**Frontend**
- React.js
- JavaScript
- CSS
- Axios
- React Router
- React Markdown
- Lucide React
- Parcel

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- LangChain.js
- Groq API
- Gemini Embeddings
- Pinecone
- JWT
- bcrypt

## Project Structure

```text
Customer Support Chatbot/
|
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- styles/
|   |   |-- App.js
|   |   |-- index.js
|   |-- index.html
|   |-- package.json
|
|-- server/
|   |-- data/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- scripts/
|   |-- services/
|   |-- tools/
|   |-- index.js
|   |-- package.json
|   |-- .env
|
|-- .gitignore
|-- README.md
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB database
- Groq API key
- Google AI API key
- Pinecone API key

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd "Customer Support Chatbot"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the server folder.

Add the following environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

Start the backend:

```bash
node index.js
```

### 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm start
```

The frontend runs at:

http://localhost:1234

The backend runs at:

http://localhost:5000

## Sample Data

The project includes:

- 12 FAQ knowledge-base entries for RAG.
- 12 sample customer orders.
- Two sample customer accounts for testing order ownership.

To seed FAQ data:

```bash
node scripts/seedFaqs.js
```

To seed sample orders:

```bash
node scripts/seedOrders.js
```

Run these commands from the server directory.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Register a customer |
| POST | /api/auth/login | Log in a customer |
| POST | /api/chat | Send a chat message |
| GET | /api/history | Retrieve chat history |

Protected endpoints require a valid JWT.

## Security Notes

- Never commit `.env` files.
- Keep API keys and database credentials private.
- Use authenticated user IDs to restrict access to customer data.
- Validate user input before processing requests.

## Future Improvements

- Improve the knowledge base with additional FAQs.
- Add more advanced customer support capabilities.

## Author

Yuvashree Ramesh

GitHub: https://github.com/yuvashree-r05
