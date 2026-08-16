# Step-by-Step Deployment Guide: Separate Backend & Frontend on Vercel

This guide explains how to deploy the Limón Restaurant application on Vercel as two separate services:
1. **Backend API**: Running as Express serverless functions.
2. **Frontend React Client**: Running as a static Vite application.

---

## 🏗️ Architecture Design & Changes Applied

To support separate deployments:
* **Dynamic API URL (`VITE_API_URL`)**: The frontend now uses `import.meta.env.VITE_API_URL` to prefix all fetch calls.
  - If undefined (e.g., during local development), it defaults to relative paths (`/api/...`), allowing Vite's dev proxy to work seamlessly.
  - In production, it uses the backend Vercel URL you specify in the environment variables.
* **Permissive CORS configuration**: The backend's CORS is configured to reflect the request origin (`origin: true`) automatically. This prevents any CORS blockages once the frontend is deployed.
* **Individual Vercel Configs**:
  - `/backend/vercel.json` routes all routes to `index.js` via `@vercel/node`.
  - `/frontend/vercel.json` handles Single Page Application (SPA) routing for the React frontend, preventing 404 errors on page reloads.

---

## 🗄️ Step 1: Set Up MongoDB Atlas

Since Vercel's serverless functions are ephemeral, you must use a cloud database (like MongoDB Atlas) to persist menus, reservations, and orders.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account/cluster.
2. **Network Access**: Add IP address `0.0.0.0/0` (required because Vercel uses dynamic IP addresses).
3. **Database Access**: Create a database user with read/write permissions.
4. **Get Connection String**: Click **Connect** -> **Drivers** and copy the URI (e.g., `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/limon_restaurant?retryWrites=true&w=majority`).
5. Replace `<username>` and `<password>` with your database user credentials.

---

## ☁️ Step 2: Deploy the Backend First

You can deploy the backend using the **Vercel Dashboard** or the **Vercel CLI**.

### Method A: Via Vercel Dashboard (Recommended)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
3. Select your repository.
4. Configure the project:
   * **Project Name**: `limon-restaurant-backend` (or similar)
   * **Framework Preset**: `Other`
   * **Root Directory**: Select **`backend`**
   * **Build Command**: Keep empty (leave default)
   * **Output Directory**: Keep empty (leave default)
5. Open **Environment Variables** and add:
   * `MONGODB_URI`: *Your MongoDB Atlas connection string*
   * `JWT_SECRET`: *A secure random string (e.g., `super_secret_jwt_key`)*
6. Click **Deploy**.
7. Once deployed, **copy your backend deployment URL** (e.g., `https://limon-restaurant-backend.vercel.app`).

### Method B: Via Vercel CLI
1. Open a terminal in the `/backend` folder:
   ```bash
   cd backend
   ```
2. Run the vercel command:
   ```bash
   vercel
   ```
3. Follow the prompts:
   * Link to existing project? **No**
   * Project Name: `limon-restaurant-backend`
   * Directory: `./`
   * Modify settings? **No**
4. Add environment variables:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   ```
5. Deploy to production:
   ```bash
   vercel --prod
   ```
6. **Copy the production URL** provided at the end of the deployment.

---

## 🧪 Step 3: Seed the Production Database (Optional)

To populate your MongoDB Atlas database with default menu items and the admin user:

1. Create a `.env` file inside your `/backend` directory.
2. Add your connection string and JWT secret:
   ```env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=super_secret_jwt_key
   ```
3. Open a terminal in the root of the project and run the seed script:
   ```bash
   npm run seed --workspace=backend
   ```
   * **Default Admin Username**: `admin`
   * **Default Admin Password**: `password123`

---

## ☁️ Step 4: Deploy the Frontend

Now that you have the backend URL, you can deploy the frontend.

### Method A: Via Vercel Dashboard
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Select the same repository.
3. Configure the project:
   * **Project Name**: `limon-restaurant` (or similar)
   * **Framework Preset**: `Vite` (Vercel should auto-detect this)
   * **Root Directory**: Select **`frontend`**
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Open **Environment Variables** and add:
   * `VITE_API_URL`: *Your backend Vercel URL (e.g., `https://limon-restaurant-backend.vercel.app`)*
     > [!IMPORTANT]
     > Ensure there is **no trailing slash** at the end of the URL (e.g., use `https://example.vercel.app` instead of `https://example.vercel.app/`).
5. Click **Deploy**.

### Method B: Via Vercel CLI
1. Open a terminal in the `/frontend` folder:
   ```bash
   cd frontend
   ```
2. Run the vercel command:
   ```bash
   vercel
   ```
3. Follow the prompts:
   * Link to existing project? **No**
   * Project Name: `limon-restaurant-frontend`
   * Directory: `./`
   * Modify settings? **No**
4. Add the backend environment variable:
   ```bash
   vercel env add VITE_API_URL
   ```
   *(Enter your backend Vercel URL when prompted)*
5. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Local Development Workflow

Running the project locally remains unchanged and simple:

1. Start the backend:
   ```bash
   npm run dev --workspace=backend
   ```
2. Start the frontend:
   ```bash
   npm run dev --workspace=frontend
   ```
3. Open `http://localhost:5173`. Any API calls will route to `http://localhost:5000` via Vite's dev proxy because `VITE_API_URL` is undefined locally.
