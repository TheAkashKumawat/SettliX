# 💸 SettliX — Smart Peer-to-Peer Expense Splitter

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2.35-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.19-blue?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

**SettliX** is a premium, mobile-first web application designed to simplify group expenses. Built with Next.js, Tailwind CSS, and MongoDB, SettliX allows friends, roommates, and travel groups to log expenses, calculate optimal settlements, and clear debts instantly using dynamically generated peer-to-peer **UPI QR codes**.

---

## ✨ Key Features

*   **👥 Smart Group Management:** Organize trips, shared housing, or events. Add members and assign custom UPI IDs to enable quick settlements.
*   **💰 Advanced Expense Splitting:**
    *   **Equally:** Distribute costs evenly among all selected group members.
    *   **Unequally:** Define exact custom rupee amounts for each member.
    *   **Percentage:** Split expenses by specifying percentage shares.
*   **⚡ Dynamic UPI Integration:** SettliX automatically constructs instant peer-to-peer UPI checkout links and QR codes pre-populated with exact settlement values, recipient names, and group references.
*   **⚖️ Optimized Debt Minimization:** Uses a transaction-minimization algorithm (minimum cash flow solver) to simplify balances, ensuring groups settle up in the fewest steps possible.
*   **📊 Data Export & Print:** Download group logs, transaction histories, and active debt ledgers directly as a **CSV** file or print optimized summaries to **PDF**.
*   **🎨 Premium Glassmorphic UI:** Smooth, native-feeling micro-animations powered by **Framer Motion** combined with responsive modern typography.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** (Pages Router) & React | Hybrid page rendering & API routes |
| **Styling** | **Tailwind CSS v3** & Headless UI | Modern glassmorphic styles & transitions |
| **Animations** | **Framer Motion** | Premium, tactile user interactions |
| **Database** | **MongoDB** & Mongoose | Group, expense, and transaction persistence |
| **Payments** | **Dynamic UPI Protocol** | Direct P2P mobile routing (GPay, PhonePe, Paytm) |

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and [npm](https://www.npmjs.com/) installed on your machine.

### 2. Installation
Clone the repository and install the project dependencies:
```bash
git clone https://github.com/TheAkashKumawat/SettliX.git
cd expense-splitter
npm install
```

### 3. Environment Variables Configuration
Create a `.env.local` file in the root of the project directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/settlix?retryWrites=true&w=majority

# Optional: Add Google Client ID to enable real Google SSO Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 4. Running the App Locally
Start the Next.js development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your web browser to access the local environment.

---

## 🔒 Security & Privacy First
* **Zero Funds Custody:** SettliX is 100% peer-to-peer. It never handles, touches, or holds your money.
* **Direct Handshake:** Payments are executed securely through your own bank's UPI app using the generated QR codes. SettliX merely registers the transaction logs for transparency.

---

## ☁️ Deployment

### Database (MongoDB Atlas)
1. Provision a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user and whitelist connections (`0.0.0.0/0`) under Network Access.
3. Retrieve your connection URI and configure it under `MONGODB_URI`.

### Frontend & Backend API (Vercel)
1. Push your code to GitHub.
2. Link your repository in **[Vercel](https://vercel.com/)**.
3. Add `MONGODB_URI` (and optionally `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) to the environment variables under Project Settings.
4. Click **Deploy** to publish the app.
