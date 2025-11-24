import React, {useState, useEffect, useRef, useCallback} from 'react';
import CodeEditor from './components/Editor';
import Preview from './components/Preview';
import Controls from './components/Controls';
import Header from './components/Header';
import {extractVariables} from './utils/astParser';
import {saveImage, startRecording, startGifRecording} from './utils/exporter';
import {downloadHTML} from './utils/htmlGenerator';
import {EXAMPLES} from './constants/examples';
import gifWorkerUrl from 'gif.js/dist/gif.worker.js?url';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading localStorage:", error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

function App() {
    const [code, setCode] = useLocalStorage('p5-playground-code', EXAMPLES.basic.code);
    const [params, setParams] = useLocalStorage('p5-playground-params', EXAMPLES.basic.params);

    const [selectedExample, setSelectedExample] = useLocalStorage('p5-playground-selected-example', 'new');
    // NEW: Sidebar Width State
    const [sidebarWidth, setSidebarWidth] = useState(400);
    const [isResizing, setIsResizing] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [isGifGenerating, setIsGifGenerating] = useState(false);
    const [gifProgress, setGifProgress] = useState(0);

    const recorderRef = useRef(null);
    const previewRef = useRef();
    const sidebarRef = useRef(null); // Reference for resizing calc

    // --- Resizing Logic ---
    const startResizing = useCallback(() => setIsResizing(true), []);
    const stopResizing = useCallback(() => setIsResizing(false), []);

    const resize = useCallback((mouseMoveEvent) => {
        if (isResizing) {
            // Calculate new width based on mouse X position
            // Limit minimum width to 0 (closed) and max to 80% of screen
            const newWidth = Math.max(0, Math.min(mouseMoveEvent.clientX, window.innerWidth * 0.8));
            setSidebarWidth(newWidth);
        }
    }, [isResizing]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    useEffect(() => {
        const codeToMatch = code;
        let matchedKey = null;

        for (const key in EXAMPLES) {
            // Compare loaded code against all example code strings
            if (codeToMatch === EXAMPLES[key].code) {
                matchedKey = key;
                break;
            }
        }

        // Set the dropdown state based on the comparison
        if (matchedKey && matchedKey !== selectedExample) {
            setSelectedExample(matchedKey);
        } else if (!matchedKey && codeToMatch.length > 0 && selectedExample !== 'custom') {
            // If code doesn't match any example and it's not empty, it's a custom edit.
            setSelectedExample('custom');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]); // Depend only on code to run when it first loads from storage.

    const handleSelectExample = (key) => {
        const example = EXAMPLES[key];
        if (example) {
            // If code is custom, confirm before overwriting
            if (selectedExample === 'custom' && !window.confirm(`Load "${example.name}"? Unsaved changes will be lost.`)) {
                return; // User cancelled
            }
            setCode(example.code);
            setParams(example.params);
            setSelectedExample(key); // Update storage and state
        }
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        if (selectedExample !== 'custom') {
            setSelectedExample('custom');
        }
    };

    const handleExportHTML = useCallback(() => {
        downloadHTML(code, params);
    }, [code, params]);

    useEffect(() => {
        const detectedVars = extractVariables(code);
        setParams(prev => {
            const newParams = {...prev};
            let changed = false;
            detectedVars.forEach(v => {
                if (newParams[v] === undefined) {
                    newParams[v] = 50;
                    changed = true;
                }
            });
            return changed ? newParams : prev;
        });
    }, [code, setParams]);

    const handleSaveImage = useCallback(() => {
        const p5 = previewRef.current?.getP5();
        if (p5) saveImage(p5);
    }, []);

    const handleToggleRecord = useCallback(() => {
        if (isRecording) {
            recorderRef.current?.stop();
        } else {
            const canvas = previewRef.current?.getCanvas();
            if (canvas) {
                recorderRef.current = startRecording(canvas, setIsRecording);
            }
        }
    }, [isRecording]);

    const handleStartGif = useCallback(() => {
        const p5 = previewRef.current?.getP5();
        if (p5) {
            startGifRecording(p5, gifWorkerUrl, setIsGifGenerating, setGifProgress);
        }
    }, []);

    return (
        <div className="app-container" style={{userSelect: isResizing ? 'none' : 'auto'}}>
            <Header
                onSaveImage={handleSaveImage}
                onToggleRecord={handleToggleRecord}
                onStartGif={handleStartGif}
                onSelectExample={handleSelectExample}
                onExportHTML={handleExportHTML} // Pass handler
                selectedExample={selectedExample} // Pass state
                isRecording={isRecording}
                isGifGenerating={isGifGenerating}
                gifProgress={gifProgress}
            />

            <main>
                {/* Sidebar with dynamic width */}
                <div
                    className="sidebar"
                    ref={sidebarRef}
                    style={{width: sidebarWidth, display: sidebarWidth === 0 ? 'none' : 'flex'}}
                >
                    <Controls params={params} setParams={setParams}/>
                    <CodeEditor code={code} setCode={handleCodeChange}/></div>

                {/* Drag Handle */}
                <div className="resizer" onMouseDown={startResizing}>
                    {sidebarWidth === 0 && (
                        <button
                            className="open-sidebar-btn"
                            onClick={() => setSidebarWidth(400)}
                            title="Open Sidebar"
                        >
                            ▶
                        </button>
                    )}
                </div>

                <div className="preview-area">
                    <Preview ref={previewRef} code={code} params={params}/>
                </div>
            </main>
        </div>
    );
}

export default App;
