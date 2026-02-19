import React, { useRef, useEffect, useState } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link,
    Heading1,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    Code,
    Eraser
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState(new Set());

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
        updateActiveFormats();
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const updateActiveFormats = () => {
        const formats = new Set();
        if (document.queryCommandState('bold')) formats.add('bold');
        if (document.queryCommandState('italic')) formats.add('italic');
        if (document.queryCommandState('underline')) formats.add('underline');
        setActiveFormats(formats);
    };

    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    const ToolbarButton = ({ icon: Icon, onClick, isActive, title, label }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            style={{
                padding: label ? '0.5rem 0.75rem' : '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--jp-border)',
                background: isActive ? 'var(--jp-primary)' : 'var(--jp-card-bg)',
                color: isActive ? 'white' : 'var(--jp-text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
                transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem'
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.currentTarget.style.background = 'var(--jp-bg-secondary)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.background = 'var(--jp-card-bg)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
        >
            <Icon size={16} />
            {label && <span>{label}</span>}
        </button>
    );

    return (
        <div style={{
            border: '1px solid var(--jp-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'var(--jp-bg-secondary)'
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '0.75rem',
                borderBottom: '1px solid var(--jp-border)',
                background: 'rgba(0, 0, 0, 0.1)',
                flexWrap: 'wrap'
            }}>
                <ToolbarButton
                    icon={Bold}
                    onClick={() => execCommand('bold')}
                    isActive={activeFormats.has('bold')}
                    title="Bold (Ctrl+B)"
                />
                <ToolbarButton
                    icon={Italic}
                    onClick={() => execCommand('italic')}
                    isActive={activeFormats.has('italic')}
                    title="Italic (Ctrl+I)"
                />
                <ToolbarButton
                    icon={Underline}
                    onClick={() => execCommand('underline')}
                    isActive={activeFormats.has('underline')}
                    title="Underline (Ctrl+U)"
                />

                <div style={{ width: '1px', background: 'var(--jp-border)', margin: '0 0.25rem' }} />

                <ToolbarButton
                    icon={Heading1}
                    onClick={() => execCommand('formatBlock', '<h1>')}
                    title="Heading 1"
                    label="H1"
                />
                <ToolbarButton
                    icon={Heading2}
                    onClick={() => execCommand('formatBlock', '<h2>')}
                    title="Heading 2"
                    label="H2"
                />
                <ToolbarButton
                    icon={Heading3}
                    onClick={() => execCommand('formatBlock', '<h3>')}
                    title="Heading 3"
                    label="H3"
                />

                <div style={{ width: '1px', background: 'var(--jp-border)', margin: '0 0.25rem' }} />

                <ToolbarButton
                    icon={List}
                    onClick={() => execCommand('insertUnorderedList')}
                    title="Bullet List"
                />
                <ToolbarButton
                    icon={ListOrdered}
                    onClick={() => execCommand('insertOrderedList')}
                    title="Numbered List"
                />

                <div style={{ width: '1px', background: 'var(--jp-border)', margin: '0 0.25rem' }} />

                <ToolbarButton
                    icon={AlignLeft}
                    onClick={() => execCommand('justifyLeft')}
                    title="Align Left"
                />
                <ToolbarButton
                    icon={AlignCenter}
                    onClick={() => execCommand('justifyCenter')}
                    title="Align Center"
                />

                <div style={{ width: '1px', background: 'var(--jp-border)', margin: '0 0.25rem' }} />

                <ToolbarButton
                    icon={Link}
                    onClick={insertLink}
                    title="Insert Link"
                />
                <ToolbarButton
                    icon={Code}
                    onClick={() => execCommand('formatBlock', '<pre>')}
                    title="Code Block"
                />
                <ToolbarButton
                    icon={Eraser}
                    onClick={() => execCommand('removeFormat')}
                    title="Clear Formatting"
                />
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onPaste={handlePaste}
                onMouseUp={updateActiveFormats}
                onKeyUp={updateActiveFormats}
                style={{
                    minHeight: '300px',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    padding: '1.5rem',
                    outline: 'none',
                    color: 'var(--jp-text-main)',
                    lineHeight: '1.8',
                    fontSize: '1rem'
                }}
                data-placeholder={placeholder}
            />

            <style>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: var(--jp-text-muted);
                    opacity: 0.5;
                    pointer-events: none;
                }
                [contenteditable] h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin: 1rem 0 0.5rem 0;
                    line-height: 1.2;
                }
                [contenteditable] h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0.875rem 0 0.5rem 0;
                    line-height: 1.3;
                }
                [contenteditable] h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0.75rem 0 0.5rem 0;
                    line-height: 1.4;
                }
                [contenteditable] ul, [contenteditable] ol {
                    margin: 0.75rem 0;
                    padding-left: 2rem;
                }
                [contenteditable] li {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                }
                [contenteditable] a {
                    color: var(--jp-primary);
                    text-decoration: underline;
                    cursor: pointer;
                }
                [contenteditable] a:hover {
                    opacity: 0.8;
                }
                [contenteditable] pre {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    font-family: 'Courier New', monospace;
                    margin: 0.75rem 0;
                    border: 1px solid var(--jp-border);
                }
                [contenteditable] p {
                    margin: 0.5rem 0;
                }
                [contenteditable]:focus {
                    outline: none;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
