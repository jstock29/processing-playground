import React, {useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
import p5 from 'p5';

const Preview = forwardRef(({code, params}, ref) => {
    const renderRef = useRef();
    const p5Instance = useRef(null);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        getP5: () => p5Instance.current,
        getCanvas: () => renderRef.current.querySelector('canvas')
    }));

    useEffect(() => {
        if (p5Instance.current) {
            p5Instance.current.remove();
        }

        try {
            const sketch = (p) => {
                p.variables = params;
                // Inject user code
                // Wrapping in try/catch block inside function to prevent runtime crashes
                try {
                    const userFunc = new Function('p', code);
                    userFunc(p);
                } catch (e) {
                    console.error("Runtime Error in Sketch:", e);
                }
            };

            p5Instance.current = new p5(sketch, renderRef.current);
        } catch (err) {
            console.error("Compilation Error:", err);
        }

        return () => {
            if (p5Instance.current) p5Instance.current.remove();
        };
    }, [code]);

    // Fast update for params without reloading sketch
    useEffect(() => {
        if (p5Instance.current) {
            p5Instance.current.variables = params;
        }
    }, [params]);

    return <div ref={renderRef} className="canvas-wrapper"/>;
});

export default Preview;
