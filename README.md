# Pet Tech Connect

This is a web application designed to connect pet owners with various pet-related services. It features a user-friendly interface and leverages modern web technologies to provide a seamless experience.

## Technologies Used

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS (assuming from `tailwind.config.js` in the initial directory listing)
*   **Routing:** React Router DOM
*   **API Integration:** Google Gemini API (based on `@google/genai` dependency)
*   **Data Visualization:** Recharts
*   **Unique IDs:** UUID

## Run Locally

**Prerequisites:** Node.js (LTS version recommended)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd pet-tech-connect
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Gemini API key:
    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    (Note: The actual variable name might be `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` based on Vite's environment variable handling. I'll use `VITE_GEMINI_API_KEY` as it's common with Vite.)
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Build for Production

To create a production-ready build of the application:

```bash
npm run build
```
This will generate optimized static assets in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
```
