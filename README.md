# Fromagerie Alioui - Invoice Management System

A full-stack invoice management application for Fromagerie Alioui built with React, Node.js, and MongoDB.

## Features

- 📋 Create, edit, and manage invoices
- 👥 Client management system
- 🖨️ Print invoices directly from browser
- 📄 Generate and download PDF invoices
- 🔐 User authentication and authorization
- 📱 Responsive design for mobile and desktop
- 📌 Pin important invoices
- 👨‍💼 Admin user management

## Tech Stack

### Frontend

- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- PDF generation with Puppeteer
- Security middleware (Helmet, CORS, Rate limiting)

## Project Structure

```
project/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables (see backend/.env.example)

5. Start the development servers:

   Backend:

   ```bash
   cd backend
   npm start
   ```

   Frontend:

   ```bash
   cd frontend
   npm run dev
   ```

## Deployment

The application is configured for deployment on:

- Frontend: Vercel, Netlify, or Railway
- Backend: Vercel, Railway, or Render

See the respective README files in `/frontend` and `/backend` directories for detailed deployment instructions.

## License

Private project for Fromagerie Alioui
