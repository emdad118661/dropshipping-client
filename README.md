# Dropshipping Client

A modern e-commerce storefront and admin dashboard for a dropshipping business, built with React 19 and Vite. It includes product browsing, category filtering, a full checkout flow, and role-based admin/superadmin panels for managing products, orders, and users.

## ✨ Features

- 🛍️ **Product Catalog** — browse all products, filter by category, and view detailed product pages with image carousels
- 🔐 **Authentication & Roles** — login, registration, and cookie/session-based auth with route guards for guests, authenticated users, admins, and superadmins
- 🛒 **Checkout Flow** — checkout page with order placement and an order success confirmation screen
- 🧑‍💼 **Admin Panel** — add, edit, and manage products, and view/manage customer orders
- 👤 **Account Management** — view and edit account details, admin-created user registration
- 🎨 **Responsive UI** — built with Tailwind CSS, DaisyUI, and Flowbite React components
- 🔔 **Alerts & Notifications** — SweetAlert2 for confirmations and feedback
- 🌐 **Client-side Routing** — React Router v7 with nested routes, loaders, and protected routes

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 7
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS, DaisyUI, Flowbite / Flowbite React
- **Icons:** React Icons
- **Utilities:** localforage, match-sorter, sort-by
- **Alerts:** SweetAlert2
- **Linting:** ESLint

## 📁 Project Structure
```
src/
├── Admin-panel/          # Admin views: add/edit/manage products, orders
├── Checkout/             # Checkout and order success pages
├── Choose-By-Category/   # Category-filtered product listing
├── CommonComponents/     # Navbar, Footer, shared UI components
├── Home/                 # Homepage sections (banner, best sellers, new arrivals)
├── login-registration/   # Login, registration, and account management
├── Products/             # Product listing, cards, and detail pages
├── routes/                # Route guards (RequireAuth, AdminOnly, GuestOnly, etc.)
├── App.jsx               # Root layout (Navbar + Outlet + Footer)
└── main.jsx               # Router configuration and app entry point
```


## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository
```bash
   git clone <your-repo-url>
   cd dropshipping-client
```

2. Install dependencies
```bash
   npm install
```

3. Configure environment variables

   Create a `.env` file in the root directory:
```env
   VITE_API_URL=http://localhost:3000
```
   Replace this with your backend API URL.

4. Start the development server
```bash
   npm run dev
```

## 📜 Available Scripts

| Command           | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start the development server         |
| `npm run build`    | Build the app for production         |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Run ESLint on the codebase           |

## 🔑 User Roles & Route Protection

The app uses route guards to control access:

- **Guest-only routes** (`/login`, `/register`) — redirect logged-in users away
- **Authenticated routes** (`/account`, `/checkout`, `/products/:id`) — require login
- **Admin routes** (`/admin/products`, `/orderlist`) — require admin privileges
- **Superadmin routes** (`/admin-register`) — require superadmin privileges

## 🔗 Backend

https://dropshipping-server-rs3y.onrender.com checkout
