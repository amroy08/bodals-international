# BODALS INTERNATIONAL — Full-Stack Website

Premium Indian merchant export company website with admin panel.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MySQL (mysql2 package, no Prisma)
- **Auth**: JWT + bcrypt

## Setup Instructions

### 1. Create MySQL Database
Open MySQL Workbench and run:
```sql
CREATE DATABASE bodals_international;
```

### 2. Configure Backend
```bash
cd server
cp .env .env.local  # optional backup
```
Edit `server/.env` and set your MySQL password:
```
DB_PASSWORD=your_actual_mysql_password
```

### 3. Install & Seed
```bash
cd server
npm install
npm run seed
```
You should see success messages for all tables and seed data.

### 4. Start Backend
```bash
cd server
npm run dev
```
Backend runs on http://localhost:5000

### 5. Start Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Default Admin Login
- **Email**: admin@bodalsinternational.com
- **Password**: Admin@123

## Project Structure
```
Bodal/
├── client/          # React frontend
│   └── src/
│       ├── api/     # API service files
│       ├── contexts/ # React contexts
│       └── app/
│           └── components/
│               ├── admin/  # Admin panel sub-components
│               └── ...     # Public site components
├── server/          # Express backend
│   ├── database/    # SQL schema + seed script
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Auth + Upload
│   │   ├── routes/       # API routes
│   │   └── utils/        # Helpers
│   └── uploads/     # Uploaded files
└── README.md
```
