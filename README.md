# Time Management App

A comprehensive full-stack application designed for time management and task tracking. This project demonstrates a modern microservices architecture with a React frontend and multiple backend services.

## 🏗 Architecture

The solution consists of three main components:

1.  **Frontend**: A Single Page Application (SPA) built with React.
2.  **Auth Service (.NET)**: A robust authentication and user management service.
3.  **Backend Service (Python)**: A lightweight service for additional functionality (e.g., alternative auth/data processing).

## 🚀 Technologies

### Frontend (`/frontend`)
*   **Framework**: React 18 + TypeScript + Vite
*   **UI Libraries**: Material UI (MUI) v5 + PrimeReact v10
*   **Routing**: React Router v6 (Nested Routes)
*   **State Management**: Context API
*   **Testing**: Vitest + React Testing Library
*   **E2E Testing**: Playwright
*   **Key Features**:
    *   Dark/Light Theme switching (synced between MUI and PrimeReact)
    *   Responsive Sidebar Drawer (Desktop/Mobile layouts)
    *   Role-based Access Control (RBAC)
    *   Breadcrumb navigation
*   Configuration: YAML-based settings

### Backend - .NET Core (`/backend_netCore_service`)
*   **Framework**: ASP.NET Core 9.0 Web API
*   **Database**: MongoDB (via Entity Framework Core)
*   **Authentication**: JWT (JSON Web Tokens)
*   **Testing**: xUnit + WebApplicationFactory (Integration Tests)
*   **Configuration**: YAML-based settings
*   **Swagger**: API Documentation with Swagger

### Backend - Python (`/backend_python_service`)
*   **Framework**: FastAPI
*   **Database**: MongoDB (via Motor(Async MongoDB), Beanie ODM)
*   **Authentication**: JWT
*   Configuration: YAML-based settings
*   **Testing**: Pytest + TestClient
*   **Swagger**: API Documentation with Swagger

## 📂 Project Structure

```
root/
├── frontend/                 # React Application
├── backend_netCore_service/  # ASP.NET Core Web API
├── backend_python_service/   # FastAPI Service
└── README.md                 # This file
```

## 🛠 Getting Started

Each service has its own detailed setup instructions. Please refer to the respective README files:

*   [Frontend Setup](./frontend/README.md)
*   [.NET Backend Setup](./backend_netCore_service/README.md)
*   [Python Backend Setup](./backend_python_service/readme.md)

## ✨ Recent Updates

*   **UI Overhaul**: Integrated PrimeReact components into the Material UI shell.
*   **Theming**: Implemented a synchronized Dark/Light mode across all UI components.
*   **Navigation**: Enhanced sidebar navigation with active state logic and breadcrumbs.
*   **Routing**: Improved deep-linking capabilities for "About Me" and other nested pages.



## Main Page

<img width="1692" height="1496" alt="image" src="https://github.com/user-attachments/assets/54f149ee-3565-4e59-bc7a-5145bd1d9bf9" />

## Track Status

<img width="2262" height="1440" alt="image" src="https://github.com/user-attachments/assets/edb01bb2-1155-4b27-9ff3-44f66a0bd4a6" />

## Board page

<img width="2089" height="1387" alt="image" src="https://github.com/user-attachments/assets/547d7f14-a20c-4ea7-abe0-4866011828ef" />

## Ligth mode

<img width="2275" height="1438" alt="image" src="https://github.com/user-attachments/assets/62f68e96-2479-4454-8793-2ceaaca71be9" />

## Mobile mode

<img width="1118" height="1351" alt="image" src="https://github.com/user-attachments/assets/2ade3bf7-80fa-46b7-8980-40e415415040" />
