# 🎀 MyAngels — 8-Bit Retro Girlfriend Day Surprise 🎀

A charming, interactive 8-bit retro Gameboy-style tribute website built as a sweet surprise for National Girlfriend Day.

Live Preview: **[myangels.netlify.app](https://myangels.netlify.app)**<br>Web Template: **[RetroLovePlay](https://github.com/velter159/RetroLovePlay)**

---

## 🎮 What is MyAngels?

The website is styled as a handheld pocket console called **Angel Play**. It features:

- **Interactive Handheld Console**: A fully responsive, pink retro Gameboy frame equipped with a working D-pad, A/B buttons, Select/Start, and a red/green power LED.
- **Chiptune Audio System**: Interactive blip/select sounds, coin-collection alerts, game-over tunes, and looping background music (with manual mute/unmute control).
- **Nostalgic Memory Cartridges**: A cartridge selection screen loading beautiful retro-themed pages of precious memories:
  - **🌸 At First Glance**: Our first date.
  - **🍛 Food Adventures**: Celebrating our joint love for delicious food.
  - **🧁 Sweet Moments**: Inside jokes, cozy hugs, and family meets.
  - **✈️ My Traveling Partner**: Future travels (currently under a retro maintenance build screen).
- **Interactive Portrait Frame**: Clicking **SELECT** on the console reveals a custom photo frame with a picture of the couple.
- **⭐️ Hidden "Angel Run" Minigame**: Pressing the classic retro cheat code sequence **Up ➔ Down ➔ Left ➔ Right** (either on the D-pad or keyboard arrow keys) unlocks a custom side-scrolling jump minigame with local high scores!

---

## 🛠️ Tech Stack

- **Framework**: [Angular](https://angular.dev/) (utilizing Standalone Components, Signals state management, and native template control flows)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS with CRT-screen effect scanlines
- **Platform**: Deployed on [Netlify](https://www.netlify.com/)

---

## 🚀 How to Run Locally

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### 2. Clone and Install

Install the project dependencies:

```bash
npm install
```

### 3. Run Development Server

Start the local server:

```bash
npm start
```

Once started, navigate to `http://localhost:4200/` in your browser. The application will hot-reload automatically upon file changes.

### 4. Build for Production

To build the distribution package:

```bash
npm run build
```

Build files will be generated in the `dist/` directory.

### 5. Running Tests

To run unit tests with Vitest:

```bash
npm run test
```
