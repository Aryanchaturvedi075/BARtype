# BARtype: Real-time Typing Test Application

## Overview

BARtype is a modern, server-side rendered typing test application that provides real-time feedback and performance metrics for users practicing their typing skills. Built with Fastify and SvelteKit, the application emphasizes performance, reliability, and a seamless user experience through WebSocket communication and efficient state management.

## Key Features

The application delivers essential typing test functionality with a focus on accuracy and real-time feedback:

- Instantaneous character-by-character validation
- Real-time performance metrics calculation
- Words per minute (WPM) tracking
- Accuracy percentage measurement
- Error highlighting and feedback
- Session-based progress tracking

## Technical Architecture

BARtype employs a robust technical stack designed for optimal performance and maintainability:

### Backend Technology

- Fastify for high-performance HTTP server
- WebSocket integration for real-time communication
- Zod for runtime validation
- Efficient text processing and analysis

### Frontend Technology

- SvelteKit with SSR optimization
- Flowbite-Svelte for UI components
- TailwindCSS for styling
- Real-time WebSocket client integration

## Project Structure

```
bartype/
├── backend/
│   └── src/
│       ├── config/
│       ├── core/
│       │   ├── session/
│       │   └── typing/
│       ├── middleware/
│       ├── routes/
│       └── websocket/
├── frontend/
│   └── src/
│       ├── lib/
│       │   ├── components/
│       │   └── utils/
│       └── routes/
└── tests/
    ├── integration/
    └── e2e/
```

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Modern web browser with WebSocket support

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Aryanchaturvedi075/BARtype.git
cd bartype
```

2. Install root dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Install frontend dependencies:

```bash
cd frontend
npm install
```

## Development

Start the development servers:

```bash
# From the project root
npm run dev
```

This command starts both the backend server (port 3001) and frontend development server (port 3000).

## Testing

BARtype implements comprehensive testing across different levels:

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run all tests
npm test
```

## Building for Production

```bash
# Build both frontend and backend
npm run build

# Start production servers
npm start
```

## Docker Deployment

The application includes Docker configuration for containerized deployment:

```bash
# Build and start containers
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## CI/CD Integration

The project includes configurations for both Azure Pipelines and GitHub Actions:

- GitHub Actions: `.github/workflows/test.yml`
- Azure Pipelines: `.azure/azure-pipelines.yml`

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## Development Standards

- All components must have corresponding unit tests
- Integration tests should cover feature workflows
- End-to-end tests must verify critical user journeys
- Follow the existing code style and organization
- Maintain SSR optimization practices

## Architecture Decisions

The application's architecture emphasizes:

- Server-side rendering for optimal performance
- Real-time communication through WebSocket
- Comprehensive error handling
- Efficient state management
- Clear separation of concerns

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Authors

- Basel A.
- Aryan C.
- Rafi L.

## Acknowledgments

Special thanks to the SvelteKit and Fastify communities for their excellent documentation and support.

---

For more information or support, please submit an issue through the project's issue tracker.
