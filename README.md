# 🚀 ChatFlow – AI Chat & Image Generation Platform

ChatFlow is a **full-stack AI-powered application** that allows users to chat with an assistant, generate AI images, and publish selected images to a **Community gallery**.
It includes authentication, credits system, publishing controls, and a modern UI.

---

## ✨ Features

### 💬 AI Chat

* Text-based AI conversations
* Typing animation for assistant responses
* Code highlighting with Prism.js

### 🖼️ AI Image Generation

* Generate images from text prompts
* Image generation powered by **ImageKit AI**
* Images stored securely and served via CDN

### 🌍 Community Gallery

* Publish / unpublish generated images
* Public community feed
* Hover effects and responsive layout

### 🔐 Authentication & Security

* User authentication with protected routes
* Only owners can publish/unpublish their images
* Public access only to community images

### 💳 Credits System

* Credits deducted for image generation
* Prevents usage when credits are insufficient

---

## 🛠️ Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios
* React Hot Toast
* Prism.js

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

### Services

* ImageKit (AI image generation & storage)

---

## 📂 Project Structure

```
chatflow/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── assets/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

---

## ▶️ Running the Project

### 1️⃣ Backend

```bash
cd backend
npm install
npm run dev
```

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 API Routes

### Messages

| Method | Route                            | Description               |
| ------ | -------------------------------- | ------------------------- |
| PUT    | `/api/messages/publish`          | Publish / unpublish image |
| GET    | `/api/messages/published-images` | Get community images      |

### Image Generation

* Generates image from prompt
* Uploads to ImageKit
* Stores in chat messages

---

## 🧠 How Community Publishing Works

1. User generates an image
2. User clicks **Publish**
3. Image is marked as `isPublished: true`
4. Community page fetches published images
5. Image becomes visible to everyone

---

## 🎨 UI Highlights

* Smooth animations
* Responsive layout
* Dark mode support
* Toast notifications for actions

---

## 🚧 Upcoming Features

* ❤️ Likes on community images
* 🧱 Masonry layout
* 🔍 Search & filters
* ⏳ Infinite scrolling
* 📥 Image downloads

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a PR.

---


## 🙌 Author

**Vikas Gupta**
Built with ❤️ and lots of debugging ☕🔥
