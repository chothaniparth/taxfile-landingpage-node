# Taxfile Landing Page Backend

## Overview

The **taxfile-landingpage-node** project is a Node.js Express backend that serves the landing page and API for Taxfile Invosoft Pvt. Ltd. It provides routes for various resources such as users, products, vacancies, news, and more.

## Tech Stack

- **Node.js** (v14+)
- **Express** – Web framework
- **Helmet** – Security headers
- **CORS** – Cross‑origin resource sharing
- **Body‑Parser** – JSON & URL‑encoded payloads
- **Cookie‑Parser** – Cookie handling
- **Express‑Session** – Session management
- **dotenv** – Environment variables

## Setup

1. **Clone the repository**
   ```bash
   git https://github.com/chothaniparth/taxfile-landingpage-node.git
   cd taxfile-landingpage-node
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create a `.env` file** (see `.env.example` for required variables)
   ```text
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your_secret_here
   ```

## Running the Server

```bash
npm run dev   # starts the server with nodemon (if configured)
# or
node src/index.js   # start directly
```
The server will be available at `http://localhost:<PORT>`.

## API Endpoints

All API routes are mounted under the `/api` prefix.

| Route Prefix | Description |
|--------------|-------------|
| `/users` | User management (login, registration, profile) |
| `/carousel` | Carousel data |
| `/documents` | Document management |
| `/subcategory` | Sub‑category listings |
| `/faqs` | Frequently asked questions |
| `/ytvideos` | YouTube video links |
| `/aboutus` | About‑us information |
| `/news` | News articles |
| `/team` | Team member details |
| `/clients` | Client testimonials |
| `/product` | Product catalogue |
| `/vacancy` | Job vacancy listings |
| `/branch` | Branch information |
| `/inquiries` | Customer inquiries |
| `/impdates` | Important dates |
| `/category` | Category listings |
| `/vacencyApply` | Vacancy application submission |
| `/textContents` | Text content blocks |
| `/empSetting` | Employee settings |
| `/newsLetter` | Newsletter subscription |
| `/content` | Content mast management |
| `/complaint` | Complaint handling |
| `/sendOTP/:MobileNumber` | Send OTP to a mobile number |

Each route forwards requests to its respective controller in `src/controllers`.

## Architecture Flow Diagram

![Project Flow Diagram](file:///C:/Users/TEXFILE/.gemini/antigravity/brain/4d501402-7c43-49a0-aeca-7e92a5eef3bd/project_flow_diagram_1763959787001.png)

*The diagram visualises server initialization, middleware stack, routing hierarchy, and controller flow.*

## License

This project is proprietary to **Taxfile Invosoft Pvt. Ltd.**
