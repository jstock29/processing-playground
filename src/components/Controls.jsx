import React from 'react';

const Controls = ({params, setParams}) => {
    const handleChange = (key, value) => {
        // Convert string inputs from range back to number immediately
        const finalValue = (typeof params[key] === 'number') ? Number(value) : value;
        setParams(prev => ({...prev, [key]: finalValue}));
    };

    const updateColorPart = (key, part, value) => {
        setParams(prev => ({
            ...prev,
            // Color is stored as { r: 255, g: 0, b: 0 } object
            [key]: {...prev[key], [part]: Number(value)}
        }));
    };

    const getMinMax = (key) => {
        // Reasonable defaults for generic numerical variables
        if (key === 'speed') return {min: 0.1, max: 10, step: 0.1};
        if (key === 'radius' || key.includes('size')) return {min: 10, max: 400, step: 1};

        // Default min/max for unknown variables
        return {min: 0, max: 255, step: 1};
    };

    return (
        <div className="controls">
            <h3>Variables</h3>
            {Object.keys(params).map((key) => {
                const value = params[key];

                // --- 1. COLOR INPUT (if value is an object like {r, g, b}) ---
                if (typeof value === 'object' && value !== null && 'r' in value) {
                    // Helper to convert {r,g,b} to hex for the color picker
                    const toHex = (c) => Math.round(c).toString(16).padStart(2, '0');
                    const hex = `#${toHex(value.r)}${toHex(value.g)}${toHex(value.b)}`;

                    return (
                        <div key={key} className="control-group color-group">
                            <label>{key} (RGB):</label>
                            <input
                                type="color"
                                value={hex}
                                onChange={(e) => {
                                    // This is a simple conversion, p5 handles HSB/RGB internally but we store RGB numbers
                                    const hexValue = e.target.value;
                                    const r = parseInt(hexValue.slice(1, 3), 16);
                                    const g = parseInt(hexValue.slice(3, 5), 16);
                                    const b = parseInt(hexValue.slice(5, 7), 16);
                                    setParams(prev => ({...prev, [key]: {r, g, b}}));
                                }}
                            />
                            {/* Optional Sliders for finer RGB control */}
                            {['r', 'g', 'b'].map(part => (
                                <div key={`${key}-${part}`} className="rgb-slider">
                                    <label>{part.toUpperCase()}: {value[part]}</label>
                                    <input
                                        type="range"
                                        min="0" max="255" step="1"
                                        value={value[part]}
                                        onChange={(e) => updateColorPart(key, part, e.target.value)}
                                    />
                                </div>
                            ))}

                            {/* Opacity (Alpha) Slider (A) */}
                            {'a' in value && (
                                <div className="rgb-slider">
                                    <label>Alpha: {value.a}</label>
                                    <input
                                        type="range"
                                        min="0" max="255" step="1"
                                        value={value.a}
                                        onChange={(e) => updateColorPart(key, 'a', e.target.value)}
                                    />
                                </div>
                            )}

                        </div>
                    );
                }

                // --- 2. GENERIC SLIDER INPUT (if value is a number) ---
                else if (typeof value === 'number') {
                    const {min, max, step} = getMinMax(key);
                    return (
                        <div key={key} className="control-group">
                            <label>{key}: {Number(value).toFixed(step < 1 ? 1 : 0)}</label>
                            <input
                                type="range"
                                min={min}
                                max={max}
                                step={step}
                                value={value}
                                onChange={(e) => handleChange(key, e.target.value)}
                            />
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};

export default Controls;
