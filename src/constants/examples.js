export const EXAMPLES = {
    basic: {
        name: "Rotating Square (Default)",
        params: {
            bg_color: {r: 20, g: 20, b: 20},
            shape_color: {r: 255, g: 100, b: 0, a: 200},
            radius: 150,
            speed: 1
        },
        code: `
p.setup = function() {
  p.createCanvas(400, 400);
  p.angleMode(p.DEGREES);
  p.colorMode(p.RGB, 255);
};

p.draw = function() {
  const bg = p.variables.bg_color;
  p.background(bg.r, bg.g, bg.b);
  
  let x = p.width / 2;
  let y = p.height / 2;
  let size = p.variables.radius || 100;
  
  const shapeColor = p.variables.shape_color;
  
  p.noStroke();
  p.fill(shapeColor.r, shapeColor.g, shapeColor.b, shapeColor.a);
  
  p.translate(x, y);
  p.rotate(p.frameCount * (p.variables.speed || 1));
  p.rectMode(p.CENTER);
  p.rect(0, 0, size, size);
};`
    },

    particles: {
        name: "Interactive Particles",
        params: {count: 100, max_speed: 2, connection_dist: 60, particle_color: {r: 100, g: 255, b: 218}},
        code: `
let particles = [];

p.setup = function() {
  p.createCanvas(400, 400);
  p.noStroke();
  
  // Initialize particles
  for(let i=0; i<p.variables.count; i++) {
    particles.push(new Particle());
  }
};

p.draw = function() {
  p.background(10, 10, 20);
  
  // Handle resizing of array if slider changes
  if(particles.length !== p.variables.count) {
    particles = [];
    for(let i=0; i<p.variables.count; i++) particles.push(new Particle());
  }

  particles.forEach((pt, index) => {
    pt.update();
    pt.show();
    pt.connect(particles.slice(index));
  });
};

class Particle {
  constructor() {
    this.pos = p.createVector(p.random(p.width), p.random(p.height));
    this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
  }

  update() {
    this.pos.add(this.vel);
    // Bounce off edges
    if(this.pos.x < 0 || this.pos.x > p.width) this.vel.x *= -1;
    if(this.pos.y < 0 || this.pos.y > p.height) this.vel.y *= -1;
    
    // Mouse Interaction
    if (p.mouseIsPressed) {
      let mouse = p.createVector(p.mouseX, p.mouseY);
      // FIX: Use instance chaining instead of static p5.Vector.sub
      let dir = p.createVector(mouse.x, mouse.y);
      dir.sub(this.pos); 
      
      dir.setMag(0.1);
      this.vel.add(dir);
    }
    
    this.vel.limit(p.variables.max_speed);
  }

  show() {
    const c = p.variables.particle_color;
    p.fill(c.r, c.g, c.b);
    p.circle(this.pos.x, this.pos.y, 4);
  }
  
  connect(others) {
    others.forEach(other => {
      let d = p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
      if (d < p.variables.connection_dist) {
        const c = p.variables.particle_color;
        p.stroke(c.r, c.g, c.b, p.map(d, 0, p.variables.connection_dist, 255, 0));
        p.line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        p.noStroke();
      }
    });
  }
}`
    },

    typography: {
        name: "Kinetic Typography",
        params: {text_size: 64, wave_speed: 3, wave_height: 20, text: "HELLO"},
        code: `
p.setup = function() {
  p.createCanvas(400, 400);
  p.textAlign(p.CENTER, p.CENTER);
  p.textFont('Courier New');
};

p.draw = function() {
  p.background(255);
  p.fill(0);
  
  let txt = "CODE"; // Default if not in vars
  // Note: String vars are not auto-detected by our simple parser yet, 
  // but if manually added to params they work.
  
  let size = p.variables.text_size;
  p.textSize(size);
  
  let wave = p.sin(p.frameCount * 0.05 * p.variables.wave_speed) * p.variables.wave_height;
  
  p.push();
  p.translate(p.width/2, p.height/2);
  p.rotate(p.radians(wave)); // Wiggle rotation
  p.text("Processing", 0, 0);
  p.pop();
  
  // Shadow effect
  p.fill(200);
  p.text("Processing", p.width/2 + 4, p.height/2 + 4 + wave);
};`
    },

    cube: {
        name: "3D Cube",
        params: {box_size: 100, rotation_speed: 1, light_intensity: 150},
        code: `
p.setup = function() {
  // IMPORTANT: Must use WEBGL for 3D
  p.createCanvas(400, 400, p.WEBGL); 
};

p.draw = function() {
  p.background(30);
  p.noStroke();
  
  // Lights
  p.ambientLight(60);
  let locX = p.mouseX - p.width / 2;
  let locY = p.mouseY - p.height / 2;
  p.pointLight(255, 255, 255, locX, locY, 100);
  
  // Material
  p.specularMaterial(250);
  p.shininess(50);
  
  p.rotateX(p.frameCount * 0.01 * p.variables.rotation_speed);
  p.rotateY(p.frameCount * 0.01 * p.variables.rotation_speed);
  
  p.box(p.variables.box_size);
};`
    },
    new: {
        name: "+ New Sketch",
        params: {color: {r: 100, g: 100, b: 255}, size: 50},
        code: `
p.setup = function() {
  p.createCanvas(400, 400);
  p.colorMode(p.RGB, 255);
};

p.draw = function() {
  p.background(220);
  
  // Use p.variables.yourParam
  const c = p.variables.color;
  p.fill(c.r, c.g, c.b);
  p.circle(p.width/2, p.height/2, p.variables.size);
};`
    }
};
