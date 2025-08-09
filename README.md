# React-Notion-DataBase

A React application built with Vite that integrates with Notion API to manage and display database content.

## About

This project provides a modern React frontend with a Node.js backend to interact with Notion databases. It features a clean, responsive UI built with Tailwind CSS and provides real-time data management capabilities.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend**: Node.js with Express
- **API**: Notion API integration

## Project Structure

```
vite-project/
├── src/                    # React frontend source code
│   ├── components/         # React components
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── notion-backend/         # Node.js backend server
│   └── server.js          # Express server with Notion API integration
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Notion API access token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YashpalLohan/React-Notion-DataBase.git
cd React-Notion-DataBase
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd notion-backend
npm install
```

4. Set up your Notion API credentials:
   - Copy `notion-backend/env.example` to `notion-backend/.env`
   - Get your Notion API token from [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Find your database ID from the URL when viewing your Notion database
   - Update the `.env` file with your actual credentials

5. Start the development servers:

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd notion-backend
node server.js
```

## Features

- Real-time Notion database integration
- Modern React components with hooks
- Responsive design with Tailwind CSS
- Fast development with Vite HMR
- RESTful API backend

## Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## License

This project is open source and available under the [MIT License](LICENSE).
