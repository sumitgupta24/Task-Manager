# 📋 MERN Stack Task Management Application

A complete, production-ready task management web application built with the MERN stack (MongoDB, Express.js, React, Node.js). Features JWT authentication, real-time task management, analytics dashboard, and a beautiful dark mode UI.

## 🎯 Key Features

### ✅ Authentication
- User registration with validation
- Secure JWT-based login
- Password hashing with bcryptjs
- Protected API routes
- Auto-logout support

### ✅ Task Management (Full CRUD)
- Create, read, update, and delete tasks
- Task status tracking (Todo, In Progress, Done)
- Priority levels (Low, Medium, High)
- Due date management
- one-click task completion
- Task notes/comments with timestamps

### ✅ Filtering & Search
- Live search by task title (debounced)
- Filter by status and priority
- Combined filtering support
- Clear filters button

### ✅ Analytics Dashboard
- Task statistics cards (Total, Completed, Pending, Overdue)
- Pie chart - Tasks by Status
- Bar chart - Tasks by Priority
- Completion percentage tracking
- Overdue task tracking
- Due today indicator

### ✅ UI/UX Features
- Dark mode toggle (persistent)
- Fully responsive design (mobile + desktop)
- Loading spinners
- Error toast notifications
- Empty state messaging
- Pagination (10 tasks per page)
- Sorting options (Due Date, Priority, Created Date)
- Color-coded priority and status badges
- Overdue task highlighting

### ✅ Bonus Features
- Task activity log tracking
- Task notes/comments system
- Overdue indicators with badges
- Due today badges
- URL query parameter state management
- Beautiful animations and transitions

## 🔧 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📁 Project Structure

```
Task Management/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── TaskActivity.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── TaskModal.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Tasks.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── Analytics.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   ├── helpers.js
    │   │   └── dateFormatter.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection string)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (.env):**
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (.env):**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:3000`

## 📚 API Endpoints

| Method | Route | Description | Auth Required |
|--------|-------|-------------|----------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/tasks` | Get all tasks for user | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |
| PATCH | `/api/tasks/:id/complete` | Mark task as done | Yes |
| GET | `/api/tasks/:id/activity` | Get task activity history | Yes |
| POST | `/api/tasks/:id/notes` | Add a note to task | Yes |
| DELETE | `/api/tasks/:id/notes/:noteId` | Delete a task note | Yes |
| GET | `/api/tasks/analytics` | Get analytics data | Yes |
| GET | `/api/tasks/overdue` | Get overdue tasks | Yes |

## 🎨 Design Decisions

### 1. **JWT Authentication**
- Stateless authentication for scalability
- Tokens stored in localStorage for persistence
- Automatic token refresh via interceptors
- Secure logout with token removal

### 2. **MongoDB Indexing**
- Indexes on `user`, `status`, `priority`, and `dueDate` fields
- Optimizes query performance for common filters
- Improves search efficiency for large datasets

### 3. **React Context API**
- Centralized authentication state management
- Eliminates prop drilling
- Simple implementation without additional libraries
- Excellent for this app's scale

### 4. **Pagination**
- 10 tasks per page for better UX
- Reduces initial load time
- Improves app responsiveness
- Query parameter state preservation

### 5. **Debounced Search**
- 300ms delay prevents excessive API calls
- Better performance with live search
- Smoother user experience

### 6. **Dark Mode**
- localStorage persistence
- Tailwind's dark mode utility classes
- Smooth transitions
- System preference detection optional

### 7. **Error Handling**
- Global error middleware in Express
- Consistent JSON error responses
- Client-side toast notifications
- Form validation on both frontend and backend

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String,
  status: enum ['Todo', 'In Progress', 'Done'],
  priority: enum ['Low', 'Medium', 'High'],
  dueDate: Date,
  user: ObjectId (ref: User),
  notes: [{
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### TaskActivity Model
```javascript
{
  task: ObjectId (ref: Task),
  user: ObjectId (ref: User),
  action: enum ['created', 'updated', 'status_changed', 'priority_changed', 'deleted'],
  changedFields: Map,
  createdAt: Date
}
```

## 🚀 Building for Production

### Backend
```bash
cd backend
npm install
# Ensure MONGO_URI and JWT_SECRET are set properly
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
# Serve the dist folder
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs with salt rounds
- **CORS Protection** - Configured for frontend origin
- **Input Validation** - express-validator on backend, client-side validation
- **Error Handling** - No sensitive information in errors
- **Environment Variables** - No hardcoded secrets

## 📊 Performance Optimizations

- **Database Indexes** - Optimized query performance
- **Pagination** - Prevents loading too many tasks
- **Debounced Search** - Reduces API calls
- **Component Code Splitting** - Lazy loading with React Router
- **Tailwind CSS Purging** - Optimized CSS in production
- **Compression** - gzip compression ready

## 🐛 Troubleshooting

### Backend Connection Issues
- Check MongoDB connection string
- Ensure MongoDB is running
- Verify PORT is not in use
- Check firewall settings

### Frontend Connection Issues
- Verify backend is running on 5000
- Check VITE_API_URL in .env
- Clear browser cache
- Check CORS configuration

### Dark Mode Not Working
- Clear localStorage
- Refresh page
- Check browser dev tools for errors

## 📝 Future Enhancements

- Email notifications for due tasks
- Task templates
- Task sharing with other users
- Task attachments
- Recurring tasks
- Time tracking
- Integration with Google Calendar
- Mobile app version
- Export to CSV/PDF
- Advanced analytics

## 📄 License

This project is open source and available for educational and commercial use.

## 👨‍💻 Contributing

Feel free to fork, modify, and use this project as a foundation for your own applications.

## 📞 Support

For issues and questions, create an issue in the repository or contact the developers.

---

**Made with ❤️ using MERN Stack**
