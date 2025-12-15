# MyCalendar

MyCalendar is a modern web app for managing calendar tasks. Built with Next.js, React, Firebase, and Tailwind CSS, it provides a seamless, secure, and responsive experience for organizing your schedule.

**Live Demo:** [https://my-calendar-o7ye.vercel.app](https://my-calendar-o7ye.vercel.app)

## Features

- 📅 Interactive calendar with task management
- 🔒 Secure authentication (Firebase)
- 👤 User profile management
- 📱 Responsive design for all devices
- ✅ Create, edit, and delete tasks

## Technology Stack

- **Frontend:** Next.js 16, React 19
- **Styling:** Tailwind CSS 4
- **Backend:** Firebase (Authentication & Firestore)
- **Icons:** React Icons (Feather)
- **Testing:** Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn/pnpm/bun)
- A Firebase project (for authentication and Firestore)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JakubCzajor/my_calendar
   cd my_calendar
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Firebase Configuration

Before running the app, you need to set up the following environment variables. Create a `.env` file in the root of the project and add your Firebase project credentials:

```env
NEXT_PUBLIC_API_KEY="<api-key-value>"
NEXT_PUBLIC_AUTH_DOMAIN="<auth-domain-value>"
NEXT_PUBLIC_PROJECT_ID="<project-id-value>"
NEXT_PUBLIC_STORAGE_BUCKET="<storage-bucket-value>"
NEXT_PUBLIC_MESSAGING_SENDER_ID="<messaging-sender-id-value>"
NEXT_PUBLIC_APP_ID="<app-id-value>"
```

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

This project uses Playwright for end-to-end testing.

To run all tests:

```bash
npx playwright test
```

## Folder Structure

- `app/` — Main application code (pages, components, styles)
- `tests/` — Playwright test scripts
