# Tasmi App

This is a Next.js application for managing Tasmi (Quran memorization recitation) sessions, students, and teachers. It includes user authentication, admin functionalities, and subscription management.

## Features

-   **User Authentication**: Sign up, login, and user management using Firebase Authentication.
-   **Student Management**: Add, view, and manage student profiles.
-   **Penguji (Teacher) Management**: Add, view, and manage teacher profiles.
-   **Tasmi Session Tracking**: Record and track Tasmi sessions for students.
-   **Progress Tracking**: Monitor student progress in Quran memorization.
-   **Admin Panel**:
    -   User management (view, edit roles).
    -   Subscription management (view, approve upgrade requests).
    -   Pricing plan management (CRUD operations for subscription tiers).
    -   Action logs and debug information.
-   **Subscription System**:
    -   Tiered pricing plans (Free, Premium, Pro, Institution).
    -   Feature limits based on subscription tier (e.g., max students, max teachers).
    -   Upgrade request flow.
    -   Real-time synchronization of pricing data.
-   **Responsive Design**: Optimized for various screen sizes.
-   **Firebase Integration**: Utilizes Firebase Firestore for database and Firebase Authentication for user management.

## Technologies Used

-   Next.js (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   Shadcn/ui
-   Firebase (Authentication, Firestore)
-   Lucide React Icons

## Getting Started

### Prerequisites

-   Node.js (v18.x or later)
-   npm or Yarn
-   Firebase Project (see `FIREBASE_SETUP.md`)

### Installation

1.  **Clone the repository**:
    \`\`\`bash
    git clone [repository-url]
    cd tasmi-app
    \`\`\`

2.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Firebase Setup**:
    Follow the instructions in `FIREBASE_SETUP.md` to set up your Firebase project and configure environment variables.

4.  **Deploy Firebase Security Rules**:
    After setting up your Firebase project, deploy the security rules as described in `DEPLOY_RULES.md`.

### Running the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Building for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

This command builds the application for production to the `.next` folder.

### Deployment

The project is configured for deployment on Vercel. Simply push your changes to your Git repository (e.g., GitHub, GitLab, Bitbucket), and if connected to Vercel, it will automatically deploy.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Reusable React components, including UI components from shadcn/ui.
-   `contexts/`: React Context API for global state management (e.g., AuthContext).
-   `hooks/`: Custom React hooks for common logic.
-   `lib/`: Utility functions, Firebase initialization, and data fetching logic.
-   `public/`: Static assets like images.
-   `styles/`: Global CSS styles.
-   `firestore.rules`: Firebase Firestore security rules.

## Contributing

Feel free to fork the repository, make changes, and submit pull requests.

## License

[Specify your license here, e.g., MIT License]
\`\`\`
