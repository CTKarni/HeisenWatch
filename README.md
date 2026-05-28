# 🎬 Weekend Movies

Weekend Movies is a premium, cinematic movie exploration and recommendation platform. Inspired by high-end design portfolios and modern editorial interfaces, the application combines a rich, dark-warm color palette with fluid animations, custom vector iconography, and seamless transitions to create a cinematic browsing experience.

---

## 🎨 Visual Identity & Key Aesthetics

- **Sunset Hero Canvas**: A full-viewport (100vh) landing section featuring a smooth backdrop slideshow cycling through iconic cinematic frames (*La La Land*, *Interstellar*, *Blade Runner 2049*, *Dune: Part Two*). The backdrops are blended with a warm, peach-coral radial gradient mask inspired by minimalist landscape paintings.
- **Editorial Card Layout**: Movie cards are structured as custom editorial templates:
  - Vertical crop poster with a bottom linear-gradient fading directly into the card base.
  - Small italicized serif tagline (`★ Rating • Main Genre`).
  - Movie title rendered in elegant **Playfair Display** serif typography.
  - Custom outlined "View Details" pill button with active border glow animations.
  - Split footer metadata featuring the release year on the left and primary genres joined by `✦` on the right.
- **Warm Obsidian Theme**: Overhauled the default styles to establish a premium warm-dark design system utilizing deep charcoal-black (`#0B0A09`), warm dark cards (`#131211`), and delicate bronze borders (`#22201E`), offset by vibrant amber accents (`#F5A623`) and soft warm white text (`#F7F5F0`).

---

## 🚀 Core Features

- **Dynamic Hero Slide Show**: Automatically cycles backdrops in the landing section every 7 seconds with scale-fade transitions.
- **Clapperboard Logo Branding**: Hand-drawn style open clapperboard vector SVG logo aligned perfectly inside a glassmorphic top navigation bar.
- **Flicker-Free Capped Pagination**: Integrated with React Query's `keepPreviousData` to ensure the movie grid and controls stay mounted and interactive during page fetches. Capped at exactly `500` pages to comply with the TMDB discover API limit and prevent `422` error pages.
- **Transition Feedback**: Automatically dims the movie grid to `opacity-40` and disables pointer events when a new page is fetching, restoring to full opacity instantly once data is loaded.
- **Horizontal Genre Scroller**: Replaced standard vertical sidebar elements with a horizontal, sliding filter bar to maximize screen space for the content grid.
- **Debounced Search**: Text search input that automatically debounces query updates by 400ms to throttle API calls, complete with expanding focus transition rings.
- **Cinematic Detail Views**: Detailed pages featuring blurred overlay headers, runtime conversion, casting carousels, and responsive layouts.

---

## 🛠️ Technical Stack

- **Core**: [React 18](https://react.dev/) + [Vite](https://vite.dev/) (fast HMR)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Data Fetching & Cache**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **API Client**: [Axios](https://axios-http.com/)
- **Router**: [React Router Dom v6](https://reactrouter.com/)
- **API Source**: [The Movie Database (TMDB) API v3](https://developer.themoviedb.org/reference/intro/getting-started)

---

## ⚙️ Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A TMDB API Key (available on your [TMDB Account Settings](https://www.themoviedb.org/settings/api))

### 1. Clone & Configure
First, make sure the project directory contains a `.env` file at the root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

> [!WARNING]
> Do not commit your `.env` file to public version control. It is explicitly ignored in the `.gitignore` setup for safety.

### 2. Install Dependencies
Run the package installation:
```bash
npm install
```

### 3. Run Development Server
Start the local server with hot-reloading:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the platform.

### 4. Build for Production
To generate a compiled, optimized bundle:
```bash
npm run build
```
This generates the output files inside the `dist/` directory, ready to be served statically.
