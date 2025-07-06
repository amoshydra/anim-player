<div align="center">

# Anim Player

[amoshydra.github.io/anim-player](https://amoshydra.github.io/anim-player/)

A Lottie Player with a user-friendly interface for viewing Lottie animation file<br />
Comes with timeline controls, markers visualization, and JSON data viewing.


![banner](https://github.com/user-attachments/assets/19650aaf-1115-414c-acbe-8efc87902337)
</div>


## Features

- Load local Lottie animation files
- Play, pause, and scrub through animations
- View and interact with the animation timeline
- Display markers on the timeline
- View raw JSON data of the loaded animation
- Responsive design for various screen sizes

## Keyboard Shortcuts

The Anim Player supports several keyboard shortcuts for controlling playback and navigation:

- **Number keys (0-9)**: Select markers by index. Pressing "0" clears marker selection.
- **Spacebar**: Toggle playback (play/pause)
- **ArrowRight**: Step forward one frame
- **ArrowLeft**: Step backward one frame
- **L key**: Toggle looping

## Configuration via Query Parameters

The Anim Player can be configured using URL query parameters. The following parameters are supported:

- `autoplay`: Controls whether the animation starts playing automatically (default: true), example:
  - `?autoplay=false`

- `file`: Specifies the URL of the Lottie animation file to load, example:
  - `?file=https://example.com/animation.lottie`
  - `?file=https://example.com/animation.json`

- `loop`: Controls whether the animation should loop (default: true), example:
  - `?loop=false`

- `renderer`: Specifies the renderer to use ("svg" or "canvas", default: "canvas"), example:
  - `?renderer=svg`

You can combine multiple parameters in a single URL:
```
http://localhost:5173/?autoplay=true&file=https://example.com/animation.json&loop=false&renderer=svg
```


## Getting Started

### Prerequisites

Make sure you have Node.js (v20.0.0 or later) installed on your machine.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/amoshydra/anim-player.git
   cd anim-player
   ```

2. Install dependencies using pnpm (or npm):
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to see the application in action.


## Available Scripts

In the project directory, you can run:

### `pnpm dev`

Runs the app in development mode. Open `http://localhost:5173` to view it in your browser. The page will reload when you make changes.

### `pnpm build`

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `pnpm preview`

Previews the production build locally before deploying it.

## License

This project is licensed under the MIT License.
