# 1.Technology Stack
Frontend: SvelteKit (with JavaScript), SASS, Tailwind CSS, Shadcn/UI

Backend: Node.js with Express.js (for API routes)

Deployment: Docker, Docker Compose, Azure Container Registry, Azure Web Apps

CI/CD: Azure Pipelines

# 2.Architecture
Microservices: Separate frontend (SvelteKit) and backend (Node.js/Express.js) applications.

SSR (Server-Side Rendering): SvelteKit provides this out-of-the-box for improved SEO and initial load times.

API: The backend will expose API endpoints for fetching typing text and potentially (if needed) for future features like user authentication or data persistence.

# 3.Project Structure
```
typing-app/
├── frontend/               # SvelteKit frontend
│   ├── src/
│   │   ├── routes/
│   │   ├── lib/
│   │   ├── app.html
│   │   └── ...
│   ├── package.json
│   └── ...
└── backend/                # Node.js/Express.js backend 
    ├── index.js 
    ├── package.json
    └── ...
```

# 4.Frontend (SvelteKit)

Installation:
```
Bash

npx sv create frontend 
{
    template: SvelteKit minimal, 
    type checking with Typescript: No,
    additions: prettier, vitest, tailwindcss,
    tailwind plugins: typography, forms, 
    package manager: npm
}

cd frontend
npm install
```
start the server and open the app in a new browser tab: `npm run dev -- --open`

Install Tailwind Css and SASS preprocessor: `npm install -D tailwindcss postcss autoprefixer sass`
Install Flowbite Svelte: `npm install flowbite-svelte`

# 5.Backend (Node.js/Express.js)

Installation:
```
Bash
mkdir backend
cd backend
npm init -y
npm install express cors
```

Create a shared package for the text generation so both frontend and backend need to install it as a dependency.
`npm install ../shared`