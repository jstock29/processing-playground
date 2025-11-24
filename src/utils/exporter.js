import GIF from 'gif.js';

export const saveImage = (p5Instance, filename = 'sketch') => {
    if (p5Instance) {
        p5Instance.saveCanvas(filename, 'png');
    }
};

export const startRecording = (canvas, setRecordingState) => {
    const stream = canvas.captureStream(60);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];

    recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setRecordingState(false);
    };

    recorder.start();
    setRecordingState(true);
    return recorder;
};

// Updated to accept workerUrl
export const startGifRecording = (p5Instance, workerUrl, setRecordingState, setProgress) => {
    if (!p5Instance) return;

    const fps = 30;
    const durationSeconds = 5;
    const totalFrames = fps * durationSeconds;
    let frameCount = 0;
    const canvas = p5Instance.canvas;

    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: canvas.width,
        height: canvas.height,
        workerScript: workerUrl // Use the resolved URL
    });

    const originalDraw = p5Instance.draw;

    p5Instance.draw = () => {
        if (frameCount < totalFrames) {
            originalDraw();
            gif.addFrame(canvas, { delay: 1000 / fps, copy: true });
            frameCount++;
            setProgress(Math.round((frameCount / totalFrames) * 100));
        } else {
            p5Instance.draw = originalDraw;
            setRecordingState(false);
            setProgress(0);
            gif.render();
        }
    };

    gif.on('finished', (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `animation-${Date.now()}.gif`;
        a.click();
        URL.revokeObjectURL(url);
    });

    setRecordingState(true);
    setProgress(0);
};
