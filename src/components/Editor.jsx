import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-dark.css';

const CodeEditor = ({ code, setCode }) => {
    return (
        <div className="editor-container">
            <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, languages.javascript)}
                padding={15}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    backgroundColor: '#1e1e1e',
                    color: '#f8f8f2',
                    minHeight: '100%' // Ensure it stretches to fill scroll area
                }}
            />
        </div>
    );
};

export default CodeEditor;
