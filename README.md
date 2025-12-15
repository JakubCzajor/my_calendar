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
