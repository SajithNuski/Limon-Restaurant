# Deployment Guide: Limón Restaurant on Vercel

This guide outlines the steps required to deploy the Limón Restaurant MERN-stack website on Vercel as a single application, utilizing **Vercel Serverless Functions** for the backend API and **Vercel Static Hosting** for the Vite React frontend.

---

## 🏗️ Architecture Overview

The repository is structured as a monorepo:
* **`/frontend`**: React client powered by Vite & Tailwind CSS.
* **`/backend`**: Express REST API.
* **`/api`**: Vercel Serverless function entrypoint (`/api/index.js`) that imports the Express app from the backend.
* **`vercel.json`**: Root configuration specifying static build outputs, API routing, and single-page application (SPA) routing.
* **`package.json`**: Root configuration utilizing npm workspaces to manage dependencies for both directories and execute builds.

---

## 📦 Local Configuration Changes Applied

The following changes have been made to support Vercel and optimize local development:
1. **API Relative Routing**: All hardcoded frontend endpoints (`http://localhost:5000/api/...`) have been converted to relative paths (`/api/...`).
2. **Vite Development Proxy**: Configured `/api` requests to proxy to `http://localhost:5000` during local development in `frontend/vite.config.js`. This guarantees that local development still behaves normally without changing front-end code.
3. **Conditional Server Listener**: Restructured `backend/index.js` to only run `app.listen()` when `process.env.VERCEL` is absent, allowing Vercel to handle the HTTP server wrapper.
4. **Vercel Rewrite Rules**: Redirects `/api/*` requests to the Serverless entry point `/api/index.js`, while routing all other traffic to `/index.html` to support React Router navigation.

---

## 🚀 Step 1: Set Up MongoDB Atlas (Recommended)

Since Vercel Serverless Functions operate on a read-only, ephemeral filesystem, the local fallback JSON database (`fallback_db.json`) cannot persist data across requests. It is highly recommended to use a free MongoDB Atlas instance in production.

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new shared cluster (free tier).
3. Under **Network Access**, add IP address `0.0.0.0/0` to allow connections from Vercel's dynamic IP addresses.
4. Under **Database Access**, create a user with read/write permissions and copy their password.
5. In your cluster dashboard, click **Connect** -> **Drivers** and copy your **connection string** (it looks like `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`).
6. Replace `<username>` and `<password>` with your database user credentials.

---

## 🧪 Step 2: Seed the Production Database

To populate your MongoDB Atlas database with the initial menu items and the administrator user:

1. Locate the `.env` file inside your `/backend` directory (create one if it does not exist).
2. Add your Atlas connection string to the `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/limon_restaurant?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   ```
3. Open a terminal in the root of the project and run the seed script:
   ```bash
   npm run seed --workspace=backend
   ```
   This will connect to your MongoDB Atlas database and insert the default menu items and create the default admin account:
   * **Username**: `admin`
   * **Password**: `password123`

---

## ☁️ Step 3: Deploy to Vercel

You can deploy the site using the **Vercel Dashboard** (connected to GitHub/GitLab) or using the **Vercel CLI**.

### Method A: Via Vercel Dashboard (Recommended)

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
3. Select your repository.
4. Configure the project settings:
   * **Framework Preset**: `Other` (or select `Vite` - Vercel will automatically detect the configuration in `vercel.json`).
   * **Root Directory**: Keep as the project root (leave empty/dot `./`).
   * **Build Command**: `npm run build`
   * **Output Directory**: Vercel will read this from `vercel.json` (`frontend/dist`), so leave this default or blank.
5. Open the **Environment Variables** section and add:
   * `MONGODB_URI`: *Your MongoDB Atlas connection string*
   * `JWT_SECRET`: *A secure random string (e.g., `8d2f5a8c9e...`)*
6. Click **Deploy**. Vercel will install the workspaces, build the Vite frontend, compile the serverless functions, and serve your application.

### Method B: Via Vercel CLI

If you prefer using the terminal:

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Log in and initiate deployment in the project root:
   ```bash
   vercel
   ```
3. Follow the prompts:
   * Set up and deploy: **Yes**
   * Scope: *Your personal or team account*
   * Link to existing project: **No**
   * Project name: `limon-restaurant`
   * Directory: `./`
   * Modify settings: **No** (Vercel reads configuration from `vercel.json` and `package.json` automatically).
4. Set the environment variables in the Vercel dashboard or via CLI:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```
5. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Local Development Workflow

After applying these changes, running the app locally remains simple:

1. Start the backend Express server:
   ```bash
   npm run dev --workspace=backend
   ```
2. Start the Vite React frontend:
   ```bash
   npm run dev --workspace=frontend
   ```
3. Open your browser to `http://localhost:5173`. Any API calls to `/api/...` will automatically route to your backend server running on port `5000` via Vite's configured dev proxy.
