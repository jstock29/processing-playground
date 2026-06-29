# Lightweight Processing/P5.js Wrapper
A React-based playground to write P5.js sketches, view them in real-time, and manipulate variables via UI controls.

[![Deploy to Firebase Hosting](https://github.com/jstock29/processing-playground/actions/workflows/deploy.yml/badge.svg?event=push)](https://github.com/jstock29/processing-playground/actions/workflows/deploy.yml)

## Available Scripts

## Features
- Live Editing: Write P5 code and see the canvas update instantly.
- Instance Mode: Uses P5 instance mode to ensure sketches don't leak globally and can be reset cleanly.
- UI Integration: Connect code variables (p.variables.size) to React state sliders.
- Dockerized: Ready for dev (hot-reload) and prod (Nginx).

## Quick Start
### Development
Ensure Docker Desktop is running.

Run:

Bash

`docker-compose up dev`

Open http://localhost:5173. Edit files in src/ to see hot updates.

### Production Test
Run:

Bash

`docker-compose up --build prod`
Open http://localhost:8080.

## Usage
In the editor, write standard JavaScript. However, because we are using P5 Instance Mode, you must prefix P5 functions with p..

Example Code:

```
p.setup = function() {
p.createCanvas(400, 400);
};

p.draw = function() {
p.background(0);
// Use variables from the UI sliders
p.fill(255, 0, 0);
p.ellipse(200, 200, p.variables.size, p.variables.size);
};
```

To add new sliders, edit the params state in src/App.jsx.
