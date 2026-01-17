# store.io - E-Commerce Application

A modern Next.js 16 application with Express.js backend for managing and viewing items, featuring a comprehensive 7-section landing page, authentication with database storage, and MongoDB persistence.

## Technologies

- **Frontend**: Next.js 16 (App Router), Tailwind CSS 4, Lucide React, React Hot Toast
- **Backend**: Express.js (Port 4000), MongoDB Native Driver, Bcrypt.js
- **Authentication**: NextAuth.js v5 (Mock Credentials, Database Credentials & Google OAuth)
- **Session Storage**: Cookies (via NextAuth.js)

## Setup & Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Database Setup**

   - Ensure MongoDB is running locally on `localhost:27017` or update `MONGODB_URI` in `.env.local`.
   - The application will automatically seed the `job-task` database with initial products if empty.

3. **Environment Variables**
   Create `.env.local` file in the root directory with:

   ```env
   AUTH_SECRET=your-secret-key-here-generate-a-random-string
   MOCK_EMAIL=admin@store.io
   MOCK_PASSWORD=admin123
   NEXT_PUBLIC_API_URL=http://localhost:4000
   MONGODB_URI=mongodb://localhost:27017
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   **Important Notes**: 
   - `AUTH_SECRET` is **REQUIRED** - Generate a random string (32+ characters). You can use: https://generate-secret.vercel.app/32
   - `MOCK_EMAIL` and `MOCK_PASSWORD` are for the primary mock login (defaults: admin@store.io / admin123)
   - Google OAuth credentials are optional - leave empty if not using Google login
   - **Without AUTH_SECRET, the app will not run!**

4. **Run Application**
   This command starts both the Next.js frontend (port 3000) and Express backend (port 4000) concurrently:

   ```bash
   npm run dev
   ```

5. **Access Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:4000/items`

## Routes Summary

| Route         | Access    | Description                                                     |
| ------------- | --------- | --------------------------------------------------------------- |
| `/`           | Public    | Landing page with 7 sections (Hero, Features, Popular Items, How It Works, Testimonials, FAQ, Newsletter). |
| `/login`      | Public    | Login page. Supports Mock Credentials, Database Credentials, and Google OAuth Sign-In. |
| `/register`   | Public    | Registration page to create a new account in MongoDB. |
| `/items`      | Public    | List of all items fetched from MongoDB via Express API. |
| `/items/[id]` | Public    | Detailed view of a single item with full product information. |
| `/add-item`   | Protected | Form to add new items. Redirects to login if not authenticated. |

## Features Implemented

### 1. Landing Page (7 Sections)
   - **Section 1: Hero** - Eye-catching hero section with call-to-action buttons
   - **Section 2: Features** - Three key features (Global Shipping, Secure Payments, Fast Delivery)
   - **Section 3: Popular Items Preview** - Trending products showcase
   - **Section 4: How It Works** - Three-step process explanation
   - **Section 5: Testimonials** - Customer reviews and testimonials
   - **Section 6: FAQ** - Frequently asked questions
   - **Section 7: Newsletter/CTA** - Newsletter subscription form
   - Includes Navbar with navigation links to Login and Items pages
   - Includes Footer with social links

### 2. Authentication System
   **Primary Method: Mock Login**
   - Hardcoded credentials stored in environment variables
   - Default: `admin@store.io` / `admin123`
   - Credentials stored in cookies via NextAuth.js
   - Mock users are automatically saved to database on first login

   **Database Authentication**
   - Users can register new accounts via `/register` page
   - Passwords are securely hashed using bcrypt
   - User data stored in MongoDB `users` collection
   - Supports email/password login via database

   **Optional: Google OAuth (Recommended)**
   - Social login using Google OAuth
   - OAuth users automatically saved to database
   - Seamless authentication flow

   **Session Management**
   - All authentication methods use cookies for session storage
   - Sessions managed by NextAuth.js
   - Protected routes redirect unauthenticated users to login
   - On successful login, users are redirected to `/items` page

### 3. Item Management
   - **MongoDB Integration**: All items stored in `products` collection
   - **Express API**: RESTful API endpoints for CRUD operations
   - **CORS Enabled**: Cross-origin requests supported
   - **Item List Page**: Responsive grid display of all items
   - **Item Details Page**: Full product information with images
   - **Add Item**: Protected form to create new items (requires authentication)
   - **Auto-seeding**: Initial products automatically added if database is empty

### 4. Protected Routes
   - `/add-item` route is protected by middleware
   - Unauthenticated users are automatically redirected to `/login`
   - Middleware uses NextAuth.js for authentication checks

### 5. Toast Notifications
   - Success notifications on item creation
   - Error handling with user-friendly messages
   - Loading states during form submissions
   - Implemented using `react-hot-toast`

### 6. Responsive Design
   - Fully responsive components using Tailwind CSS
   - Mobile-first approach
   - Modern UI with smooth transitions and hover effects

## API Endpoints

### Express Server (Port 4000)

- `GET /items` - Fetch all items
- `GET /items/:id` - Fetch single item by ID
- `POST /items` - Create new item (requires authentication)
- `POST /register` - Register new user
- `POST /login` - Authenticate user (database)
- `POST /save-oauth-user` - Save OAuth user to database

## Database Schema

### Collections

**products**
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String (URL)
}
```

**users**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  provider: String ('mock' | 'google' | 'credentials'),
  image: String (optional, for OAuth),
  createdAt: Date
}
```

## Brief Explanation of Features

### Authentication Flow
1. User visits `/login` page
2. Can choose between:
   - Mock login (hardcoded credentials)
   - Database login (registered users)
   - Google OAuth (social login)
3. Credentials validated and user stored in database if new
4. Session created and stored in cookies
5. User redirected to `/items` page

### Item Management Flow
1. Public users can view all items at `/items`
2. Clicking an item shows full details at `/items/[id]`
3. Authenticated users can access `/add-item` to create new items
4. New items are saved to MongoDB via Express API
5. Success toast notification shown on creation

### Route Protection
- Middleware checks authentication status for protected routes
- Uses NextAuth.js `auth()` function
- Automatically redirects to login if not authenticated
- Session persists across page refreshes via cookies

## Development

- **Frontend Dev Server**: `http://localhost:3000`
- **Backend API Server**: `http://localhost:4000`
- **Database**: MongoDB on `localhost:27017`

## Production Build

```bash
npm run build
npm start
```

## Notes

- Mock credentials are stored in environment variables for easy configuration
- All user data (mock, database, OAuth) is stored in MongoDB
- Sessions are stored in HTTP-only cookies for security
- The application supports both development and production environments
