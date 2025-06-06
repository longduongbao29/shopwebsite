# BUY ME SHOP

This repository contains a full-stack e-commerce application, including a web frontend, Android mobile app, and backend server. The project is organized as a monorepo with separate folders for each part of the stack.
![image](https://github.com/user-attachments/assets/84a34ad2-922f-476f-ac8c-7b909ba37698)

## Project Structure

```
.
├── android-app/   # React Native Android application
├── server/        # Python FastAPI
├── web/           # Next.js web frontend
├── docker-compose.yml
├── run.sh
```

---

## 1. Web Frontend (`web/`)
- **Framework:** Next.js (React, TypeScript)
- **Features:**
  - Product listing, cart, order, login/register, admin panel
  - Modern UI components (Add to Cart, Buy Now, Rating, etc.)
  - API integration with backend
  - Responsive design
- **Start locally:**
  ```powershell
  cd web
  npm install
  npm run dev
  ```

---

## 2. Android App (`android-app/`)
- **Framework:** React Native (TypeScript)
- **Features:**
  - Mobile shopping experience
  - Product browsing, cart, order, authentication
  - Shared logic/components with web where possible
- **Start locally:**
  ```powershell
  cd android-app
  npm install
  npx expo start
  ```

---

## 3. Backend Server (`server/`)
- **Framework:** Python (FastAPI)
- **Features:**
  - REST API for products, users, orders
  - Uses `db.json` for mock data (can be replaced with a real database)
- **Start locally:**
  ```powershell
  cd server
  npm install
  npm start
  ```

---

## 4. Docker Compose
- **Purpose:** Run all services (web, server) together for development or deployment.
- **Usage:**
  ```powershell
  docker-compose up --build
  ```

---

## Development Scripts
- `run.sh` — Helper script to start all services (Linux/macOS)
- `build.sh` — Build scripts for web and server

---

## Contributing
1. Fork the repo and create your branch.
2. Make your changes and add tests if needed.
3. Submit a pull request.

---

---

## Credits
- Built with [Next.js](https://nextjs.org/), [React Native](https://reactnative.dev/), and [Express](https://expressjs.com/).
