# Crystal Wall Art

A modern **E-commerce web application** for browsing and purchasing premium crystal wall art.
Built using **Next.js App Router**, **Tailwind CSS**, and modern frontend best practices.

---

# 🚀 Tech Stack

* **Framework:** Next.js 16 (App Router)
* **UI:** Tailwind CSS v4
* **Language:** TypeScript
* **Icons:** Lucide React
* **Styling:** Tailwind + Custom Design System

---

# 📂 Project Structure

```
crystal-wall-art
│
├── app/                # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/         # Reusable UI components
│   ├── navbar/
│   ├── ui/
│
├── public/             # Static assets
│
├── tailwind.config.js  # Tailwind configuration
├── package.json
└── README.md
```

---

# 🛠️ Getting Started

Clone the repository:

```
git clone <repository-url>
cd crystal-wall-art
```

Install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

or

```
yarn dev
```

Open your browser:

```
http://localhost:3000
```

---

# 🎨 Design System

The project uses a **custom design system** built with Tailwind.

### Primary Colors

| Name      | Value     |
| --------- | --------- |
| Primary   | `#15BCC9` |
| Secondary | `#ADCC5E` |
| Rating    | `#FFC800` |

### Neutral Colors

| Name        | Value     |
| ----------- | --------- |
| Light Gray  | `#F8F8F8` |
| Gray Border | `#CACACA` |
| Gray Text   | `#9E9E9E` |
| Dark Gray   | `#1E1E1E` |

---

# 🔤 Typography

Fonts used in the project:

* **Inter** → Primary UI font
* **Poppins** → Headings
* **Fira Code** → Code / mono text

---

# 🌿 Branch Strategy

The project follows a **feature-based Git workflow**.

```
main        → Production
develop     → Integration
feature/*   → New features
fix/*       → Bug fixes
hotfix/*    → Emergency fixes
```

Example:

```
feature/navbar
feature/product-grid
feature/cart
```

---

# 📦 Build for Production

```
npm run build
```

Start production server:

```
npm start
```

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

Developed by **Jibi George**
