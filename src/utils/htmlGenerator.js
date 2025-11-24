export const generateStandaloneHTML = (code, params) => {
    const paramsJSON = JSON.stringify(params);

    // We inject a mini-app into the HTML that mimics the React logic using Vanilla JS
    return `<!DOCTYPE html>
<html>
<head>
  <title>P5.js Embed</title>
  <style>
    body { margin: 0; display: flex; flex-direction: column; height: 100vh; font-family: sans-serif; background: #111; color: #fff; }
    #canvas-container { flex: 1; display: flex; justify-content: center; align-items: center; overflow: hidden; }
    #controls { padding: 15px; background: #222; border-top: 1px solid #333; display: flex; flex-wrap: wrap; gap: 15px; max-height: 200px; overflow-y: auto; }
    .control-group { display: flex; flex-direction: column; font-size: 12px; }
    label { margin-bottom: 5px; color: #ccc; }
    input { cursor: pointer; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
</head>
<body>
  <div id="canvas-container"></div>
  <div id="controls"></div>

  <script>
    // 1. Initial State
    let params = ${paramsJSON};
    let p5Inst = null;

    // 2. User Code Wrapper
    const sketch = (p) => {
      p.variables = params;
      ${code}
    };

    // 3. Initialize P5
    p5Inst = new p5(sketch, document.getElementById('canvas-container'));

    // 4. Generate UI Controls (Vanilla JS)
    const controlsDiv = document.getElementById('controls');
    
    Object.keys(params).forEach(key => {
      const val = params[key];
      const wrapper = document.createElement('div');
      wrapper.className = 'control-group';
      
      const label = document.createElement('label');
      label.innerText = key;
      wrapper.appendChild(label);

      // Color Input
      if (typeof val === 'object' && 'r' in val) {
        const input = document.createElement('input');
        input.type = 'color';
        // RGB to Hex
        const toHex = c => ("0" + c.toString(16)).slice(-2);
        input.value = "#" + toHex(val.r) + toHex(val.g) + toHex(val.b);
        
        input.addEventListener('input', (e) => {
          const hex = e.target.value;
          params[key].r = parseInt(hex.slice(1, 3), 16);
          params[key].g = parseInt(hex.slice(3, 5), 16);
          params[key].b = parseInt(hex.slice(5, 7), 16);
        });
        wrapper.appendChild(input);
      } 
      // Number Input
      else if (typeof val === 'number') {
        const input = document.createElement('input');
        input.type = 'range';
        // Auto-detect min/max similar to React app
        if (key.includes('speed')) { input.min = 0; input.max = 10; input.step = 0.1; }
        else if (key.includes('size') || key === 'radius') { input.min = 1; input.max = 400; input.step = 1; }
        else { input.min = 0; input.max = 255; input.step = 1; }
        
        input.value = val;
        
        input.addEventListener('input', (e) => {
          params[key] = parseFloat(e.target.value);
        });
        wrapper.appendChild(input);
      }
      
      controlsDiv.appendChild(wrapper);
    });
  </script>
</body>
</html>`;
};

export const downloadHTML = (code, params) => {
    const html = generateStandaloneHTML(code, params);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `p5-embed-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
};
