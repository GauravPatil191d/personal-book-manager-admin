# Personal Book Manager

## Overview

Personal Book Manager is a full-stack MERN application built using **Next.js**, **Node.js**, **Express.js**, **MongoDB**, and **JWT Authentication**.

The application allows users to maintain their own personal digital library where they can organize books, upload cover images, manage reading progress, write notes, and track their reading journey.

Each user has an independent library, ensuring that all books and personal data remain private to their account.

---

# Features

## Authentication

- User Registration
- Secure Login
- Logout
- JWT Authentication
- Protected Routes
- User-specific Library

---

## Personal Library

Users can:

- Add new books
- Upload book cover images
- Edit book information
- Delete books
- Add personal notes
- Add tags
- Organize books by reading status

Supported reading statuses:

- Reading
- Plan to Read
- Completed

---

# Dashboard

The dashboard provides a quick overview of the user's reading collection.

It includes:

- Total Books
- Books Read
- Books Pending
- Recently Added Books
- Personal Bookshelf
- Search Functionality

---

# User Interface

The application was designed with a clean and modern interface focused on usability and readability.

AI-assisted design tools were used during the UI ideation and refinement process to enhance the overall visual experience, while the frontend implementation, backend APIs, authentication flow, database integration, and application logic were developed as part of this project.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Context API
- Axios
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (Image Upload)

## Database

- MongoDB Atlas

## Deployment

- Vercel

---

# Demo Credentials

You can either create your own account or use the demo account below.

**Email**

```
gaurav@gmail.com
```

**Password**

```
123456
```

---

# Create Your Own Account

If you prefer, click **Create One** on the login screen to register a new account.

Each registered user receives an independent personal library.

---

# Environment Variables

Create a `.env` file using the values from `.env.example`.

## Backend

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

## Frontend

```env
NEXT_PUBLIC_URL=http://localhost:8000
```

---

# Project Structure

## Backend

```
src/
├── config/
├── middleware/
├── modules/
│   ├── login/
│   ├── users/
│   └── books/
├── uploads/
└── index.ts
```

## Frontend

```
src/
├── app/
├── components/
├── context/
├── services/
├── types/
└── public/
```

---

# Running the Project

## Backend

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Backend URL

```
http://localhost:8000
```

---

## Frontend

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Frontend URL

```
http://localhost:3000
```

---

# Project Highlights

- Secure JWT Authentication
- User-specific Personal Library
- Image Upload Support
- Dashboard Analytics
- Reading Progress Tracking
- Personal Notes
- Book Tags
- RESTful APIs
- MongoDB Integration
- Responsive User Interface
- Clean Modular Architecture

---

# Acknowledgement

Thank you for taking the time to review this project.

This application was developed with a focus on clean architecture, user experience, secure authentication, and maintainable code. I hope it provides a clear demonstration of my full-stack development skills.
