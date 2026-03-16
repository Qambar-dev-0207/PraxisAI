# Praxis AI

![Status](https://img.shields.io/badge/System-Operational-emerald?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-amber?style=flat-square)

**Praxis AI** is a decentralized thought archive and agentic career co-pilot built on the **PathOS** architecture. It is designed to augment human intelligence by transforming passive memory into active cognitive navigation.

This project combines a high-fidelity cyberpunk aesthetic with functional AI tools for identity management, resume parsing, and career automation.

---

## ⚡ Core Systems

*   **Identity Record:** A digital dossier reflecting professional capabilities, skills, and history (The About Page).
*   **Decentralized Thought Archive:** (Planned) A neural network of interconnected notes and ideas.
*   **Agentic Co-Pilot:** AI-driven tools for resume optimization and job application automation.
*   **Immersive UI:** A "glitch-aesthetic" interface with 3D backgrounds, magnetic interactions, and responsive motion design.

## 🛠 Tech Stack

**Frontend**
*   **Next.js 15 (App Router):** The React framework for production.
*   **React 19:** Building the user interface.
*   **Tailwind CSS v4:** Utility-first styling with custom "cyberpunk" config.
*   **Framer Motion:** Complex animations (page transitions, scroll effects, magnetic buttons).
*   **Three.js / React Three Fiber:** 3D background elements (MantisScene).

**Backend / Services**
*   **NextAuth.js (v5 Beta):** Authentication logic.
*   **MongoDB:** NoSQL database for storing user profiles and thought nodes.
*   **Gemini API:** Generative AI for content intelligence.

## 🚀 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Qambar-dev-0207/PraxisAI.git
    cd PraxisAI
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add the following keys:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    AUTH_SECRET=your_auth_secret
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Ignite the System (Run Dev Server)**
    ```bash
    npm run dev
    ```
    Access the interface at `http://localhost:3000`.

## 📂 Project Structure

```
PraxisAI/
├── app/
│   ├── about/          # Identity Record Page
│   ├── components/     # Reusable UI (GlitchText, MagneticButton, etc.)
│   ├── manifesto/      # System Doctrine
│   ├── privacy/        # Data Protocol
│   ├── terms/          # Neural Link Agreement
│   ├── layout.tsx      # Root Layout
│   └── page.tsx        # Landing Page
├── public/             # Static Assets (Resume, SVGs)
└── lib/                # Database & Helper functions
```

## 📜 License

This project is licensed under the MIT License.

---

> *"We do not predict the future. We compile it."* — Mantis Protocol
