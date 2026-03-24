# 🚀 Quick Start Guide

## Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- npm or yarn

## 1️⃣ Backend Setup (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

Server will run on `http://localhost:5000`

### .env Configuration
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-management
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## 2️⃣ Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

App will open at `http://localhost:3000`

### .env Configuration
```
VITE_API_URL=http://localhost:5000/api
```

## ✅ Verify Installation

1. Register a new user at `http://localhost:3000/register`
2. Login with your credentials
3. Create your first task
4. Check Dashboard and Analytics

## 📚 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production

## 🔥 Features to Test

✅ Create/Edit/Delete tasks
✅ Search and filter tasks
✅ Mark tasks as complete
✅ Add task notes
✅ View activity history
✅ Check analytics dashboard
✅ Toggle dark mode
✅ Mobile responsiveness
✅ Task pagination
✅ Due date highlighting

## 🆘 Troubleshooting

**Backend won't start**
- Check if port 5000 is in use
- Verify MongoDB connection
- Check .env file is in backend folder

**Frontend won't connect to backend**
- Ensure backend is running on 5000
- Check .env file in frontend folder
- Clear browser cache and try again

**MongoDB connection error**
- Verify MongoDB is running
- Check connection string in .env
- If using MongoDB Atlas, whitelist your IP

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation.
