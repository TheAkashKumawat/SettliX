# 💸 Smart Expense Splitter with UPI Integration

A premium, responsive web application built using Next.js and MongoDB to help friends, roommates, and travel groups split bills seamlessly, calculate optimal settlements, and pay instantly using dynamically generated UPI QR codes.

---

## ✨ Features

- **👥 Group Management**: Create custom groups with multiple members for tracking trips, shared housing, or events.
- **💰 Smart Expense Logging**: Log expenses with detailed splits:
  - **Equally**: Split the total cost evenly among all selected members.
  - **Unequally**: Specify exact custom shares per member.
  - **Percentage**: Distribute cost using custom percentage shares.
- **⚡ Dynamic UPI Integration**: Generates instant, scan-and-pay UPI QR codes featuring exact settlement amounts, recipient UPI IDs, and descriptions.
- **⚖️ Optimized Settlement Engine**: Calculates exactly who owes whom using the minimum number of transactions.
- **📊 CSV Data Export**: Download your group's transaction history and expense logs with a single click.
- **🎨 Premium UI/UX**: Designed with a sleek, mobile-first glassmorphic aesthetic using Framer Motion animations and Headless UI.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (Pages Router)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Interactive UI**: [@headlessui/react](https://headlessui.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed.

### 2. Installation
Clone your repository and navigate to the project directory:
```bash
cd expense-splitter
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root of the project and add your MongoDB connection string (local or cloud-based MongoDB Atlas):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/expense_splitter?retryWrites=true&w=majority
```

### 4. Running Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ☁️ Deployment

### Database (MongoDB Atlas)
1. Set up a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and white-list access from anywhere (`0.0.0.0/0`) under **Network Access**.
3. Obtain the connection string and replace `<db_password>` with your user's password.

### Frontend & API (Vercel)
1. Push this codebase to **GitHub**.
2. Import the project into **[Vercel](https://vercel.com/)**.
3. Add the `MONGODB_URI` environment variable under your Vercel project settings.
4. Click **Deploy**. Vercel will host your web app globally for free!
