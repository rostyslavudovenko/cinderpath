# Cinderpath

![GitHub License](https://img.shields.io/github/license/rostyslav-udovenko/cinderpath)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
![GitHub Release](https://img.shields.io/github/v/release/rostyslav-udovenko/cinderpath?include_prereleases)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/rostyslav-udovenko/cinderpath)

A low-poly 3D forest scene you can walk through in first-person. Built with Three.js and Vite.

Wander around a night campfire, explore the treeline, listen to the silence.

## How It Works

A procedurally generated island rendered in real time — every tree, rock, and grass clump is placed fresh on each visit.

Click anywhere to lock your cursor and start exploring.

## Controls

| Key | Action |
|-----|--------|
| Click | Lock cursor / start |
| W A S D | Move |
| Mouse | Look around |
| ESC | Release cursor |

## Features

- **FPS camera** with head bob and pointer lock
- **5 tree types** — cone pine, round tree, cluster tree, layered pine, poplar
- **Dense hex-grid forest** — 225 placement points, randomized each load
- **Animated grass** — wind sway with per-blade physics
- **Campfire** with flickering point lights and breathing flame geometry
- **Night sky** with 3000 stars and a moon
- **Fog** for depth and atmosphere

## Getting Started

### Prerequisites

Node.js 20+ is required.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/rostyslav-udovenko/cinderpath.git
cd cinderpath
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`.

### Development Commands

- `npm run dev` — Start development server with hot reload
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally
- `npm run serve` — Serve production build on port 3000

## File Structure

```
cinderpath/
├── src/
│   ├── campfire.js   # Stone ring, logs, embers, flame geometry
│   ├── controls.js   # FPS camera, pointer lock, head bob
│   ├── grass.js      # Grass blades with wind animation
│   ├── main.js       # Entry point, render loop
│   ├── scene.js      # Scene, camera, renderer, lights
│   ├── style.css     # Minimal fullscreen styles
│   ├── tent.js       # Tent mesh with pegs and ropes
│   ├── trees.js      # 5 tree types, hex-grid placement
│   ├── utils.js      # Shared geometry and material helpers
│   └── world.js      # Island shape, sky, stars, moon
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## License

Licensed under the Mozilla Public License Version 2.0. See the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by [Rostyslav Udovenko](mailto:rostyslav-udovenko@icloud.com)