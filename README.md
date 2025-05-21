# Goal Tracker Application

A full-stack application for tracking personal and professional goals with a hierarchical structure, allowing users to organize goals with parent-child relationships. This application features user authentication, private and public goals, and a clean, responsive interface.

## Tech Stack Summary

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: RESTful API
- **Containerization**: Docker & Docker Compose

### Frontend
- **Framework**: Angular 19
- **Language**: TypeScript
- **UI Components**: Angular Material, Bootstrap
- **Authentication**: JWT with interceptors
- **CSS**: Component-scoped styles

## Database Choice Explanation

**PostgreSQL** was chosen for the following reasons:

1. **Relational Data Model**: The application's data has clear relationships (users-goals, goals-subgoals) which maps well to a relational database.

2. **Data Integrity**: PostgreSQL enforces constraints and relationships, ensuring data consistency for the hierarchical goal structure.

3. **Scalability**: Capable of handling large amounts of data with efficient indexing on frequently queried fields (like public goals).

4. **TypeORM Integration**: Seamless integration with NestJS through TypeORM, providing type-safe database operations.

5. **Transactional Support**: Ensures atomic operations when updating complex goal hierarchies.

6. **JSON Support**: PostgreSQL's robust JSON support allows for flexible data structures if future feature expansions are needed.

## Setup Instructions

### Prerequisites
- Node.js (v20+ recommended)
- Docker and Docker Compose
- Git

### Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdallahhany/goal-tracker
   cd goal-tracker
   ```

2. **Backend Setup with Docker (Recommended)**
   ```bash
   cd backend
   docker-compose up -d
   ```
   This will start both the NestJS backend and PostgreSQL database in Docker containers.

3. **Backend Setup without Docker**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file with the following variables:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=goaltracker
   JWT_SECRET=your_secure_secret
   JWT_EXPIRATION=1h
   ```
   
   Then start the backend:
   ```bash
   npm run start:dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   
   The Angular application will be available at `http://localhost:4200`

## Key Decisions and Trade-offs

1. **Hierarchical Goal Structure**
   - **Decision**: Implemented a self-referencing relation in the Goal entity to allow for nested goals.
   - **Trade-off**: Increases query complexity but provides better organization capabilities for users.

2. **TypeORM with PostgreSQL**
   - **Decision**: Used TypeORM with PostgreSQL for data modeling.
   - **Trade-off**: More setup overhead compared to NoSQL solutions, but better data integrity and relationship management.

3. **JWT Authentication**
   - **Decision**: Implemented JWT for stateless authentication.
   - **Trade-off**: Simpler to scale but requires careful handling of token expiration and refresh strategies.

4. **Containerization with Docker**
   - **Decision**: Provided Docker setup for easier development and deployment.
   - **Trade-off**: Additional complexity for developers unfamiliar with Docker, but ensures consistent environments.

5. **Angular Material & Bootstrap**
   - **Decision**: Combined Angular Material components with Bootstrap utilities.
   - **Trade-off**: Larger bundle size but improved UI consistency and development speed.

6. **Public Goal Sharing**
   - **Decision**: Implemented a public goal feature with a separate viewing interface.
   - **Trade-off**: Added complexity to permissions management but enhanced the social aspect of goal tracking.

## Known Limitations and Pending Features

### Current Limitations
- Limited goal visualization options (no charts or progress tracking)
- Basic permission system (goals are either private or public)
- No real-time collaboration features
- No offline support
- No mobile application (responsive web only)

### Pending Features
1. **Goal Analytics Dashboard**
   - Visual progress tracking
   - Completion rate statistics
   - Timeline views

2. **Enhanced Collaboration**
   - Shared goals between multiple users
   - Comments and feedback
   - Activity feeds

3. **Advanced Goal Management**
   - Recurring goals
   - Templates for common goal hierarchies
   - Milestones and checkpoints
   - File attachments

4. **Notifications System**
   - Deadline reminders
   - Achievement celebrations
   - Goal update notifications

5. **Mobile Applications**
   - Native iOS and Android apps
   - Offline capability with synchronization

6. **Third-party Integrations**
   - Calendar integration (Google Calendar, etc.)
   - Task manager integration (Todoist, etc.)
   - Social media sharing

## Video Demonstration
A video demonstration of the application can be found [here](https://drive.google.com/file/d/1DG7XzdH6djKSr2Za5K-qOvTuzDF1zlxM/view?usp=sharing).