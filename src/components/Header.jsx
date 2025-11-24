import React from 'react';
import { EXAMPLES } from '../constants/examples';

const Header = ({
                    onSaveImage,
                    onToggleRecord,
                    onStartGif,
                    onSelectExample,
                    onExportHTML, // New Prop
                    selectedExample, // New Prop
                    isRecording,
                    isGifGenerating,
                    gifProgress
                }) => {
    return (
        <header className="app-header">
            <div className="logo-section">
                <h1>Processing Playground</h1>
            </div>

            <div className="example-selector">
                <select
                    onChange={(e) => onSelectExample(e.target.value)}
                    value={selectedExample}
                >
                    {/* Default "Active" label if it's a custom edit */}
                    {!EXAMPLES[selectedExample] && <option value="custom">Custom Sketch</option>}

                    <optgroup label="Start Fresh">
                        <option value="new">{EXAMPLES.new.name}</option>
                    </optgroup>

                    <optgroup label="Examples">
                        {Object.entries(EXAMPLES)
                            .filter(([key]) => key !== 'new')
                            .map(([key, example]) => (
                                <option key={key} value={key}>
                                    {example.name}
                                </option>
                            ))}
                    </optgroup>
                </select>
            </div>

            <div className="actions">
                {/* NEW Export Button */}
                <button onClick={onExportHTML} title="Download standalone HTML file">
                    &lt;/&gt; Embed
                </button>

                <div className="divider" style={{width: 1, background: '#444', margin: '0 5px'}}></div>

                <button onClick={onSaveImage} disabled={isRecording || isGifGenerating}>
                    📸 PNG
                </button>
                <button onClick={onStartGif} disabled={isGifGenerating || isRecording}>
                    {isGifGenerating ? `${gifProgress}%` : '🖼️ GIF'}
                </button>
                <button onClick={onToggleRecord} className={isRecording ? 'recording-btn active' : 'recording-btn'}>
                    {isRecording ? '⏹' : '🎥 Rec'}
                </button>
            </div>
        </header>
    );
};

export default Header;
