import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, Target, Download, TrendingUp, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

const COLORS = {
    ink: [15, 23, 42],
    muted: [100, 116, 139],
    border: [226, 232, 240],
    surface: [248, 250, 252],
    primary: [99, 102, 241],
    violet: [139, 92, 246],
    success: [16, 185, 129],
    danger: [239, 68, 68],
    amber: [245, 158, 11],
    white: [255, 255, 255],
    dark: [17, 24, 39]
};

const ScoreCard = ({ score, total, results, onRetake, tags = [], testTitle = 'Assessment' }) => {
    const safeTotal = Math.max(total, 1);
    const percentage = Math.round((score / safeTotal) * 100);
    const incorrect = total - score;
    const attempted = results.filter((result) => result.userAnswer).length;

    const getLevel = (pct) => {
        if (pct >= 85) return {
            label: 'Advanced Mastery',
            tone: 'excellent',
            color: 'var(--iq-easy)',
            sub: 'Excellent command of the topic with strong accuracy and decision-making.'
        };

        if (pct >= 60) return {
            label: 'Solid Foundation',
            tone: 'good',
            color: 'var(--iq-mid)',
            sub: 'Good progress. Review missed areas to turn knowledge into consistency.'
        };

        return {
            label: 'Learning Phase',
            tone: 'needs-work',
            color: 'var(--iq-hard)',
            sub: 'Keep practicing to strengthen core concepts and improve recall speed.'
        };
    };

    const level = getLevel(percentage);

    const addWrappedText = (doc, text, x, y, maxWidth, lineHeight = 5) => {
        const lines = doc.splitTextToSize(String(text || ''), maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * lineHeight);
    };

    const roundedRect = (doc, x, y, w, h, radius, fill, stroke) => {
        doc.roundedRect(x, y, w, h, radius, radius, fill && stroke ? 'FD' : fill ? 'F' : 'S');
    };

    const handleDownload = () => {
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 12; // Reduced margin
            const contentWidth = pageWidth - (margin * 2);
            const date = new Date().toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            const setFill = (color) => doc.setFillColor(color[0], color[1], color[2]);
            const setText = (color) => doc.setTextColor(color[0], color[1], color[2]);
            const setDraw = (color) => doc.setDrawColor(color[0], color[1], color[2]);

            const drawHeader = () => {
                // Professional minimalist header
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                setText(COLORS.ink);
                doc.text('Chaitanya Tech World', margin, 12);
                
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                setText(COLORS.muted);
                doc.text('www.chaitanyatechworld.com', margin, 16);
                
                setDraw(COLORS.border);
                doc.setLineWidth(0.2);
                doc.line(margin, 20, pageWidth - margin, 20);
            };

            const drawFooter = () => {
                const pageNumber = doc.internal.getNumberOfPages();
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7);
                setText(COLORS.muted);
                doc.text(`Official Assessment Report • ${date}`, margin, pageHeight - 8);
                doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
            };

            const ensureSpace = (requiredHeight, y) => {
                if (y + requiredHeight <= pageHeight - 15) return y;
                drawFooter();
                doc.addPage();
                drawHeader();
                return 30;
            };

            drawHeader();
            let y = 32;

            // Title and Summary
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            setText(COLORS.ink);
            y = addWrappedText(doc, testTitle, margin, y, contentWidth, 7);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            setText(COLORS.muted);
            doc.text(`Performance Score: ${percentage}% • Result: ${level.label}`, margin, y + 2);
            y += 12;

            // Summary Metrics Box
            setFill(COLORS.surface);
            setDraw(COLORS.border);
            roundedRect(doc, margin, y, contentWidth, 24, 2, true, true);
            
            const metricW = contentWidth / 4;
            const metrics = [
                { l: 'SCORE', v: `${percentage}%` },
                { l: 'CORRECT', v: score },
                { l: 'INCORRECT', v: incorrect },
                { l: 'TOTAL Qs', v: total }
            ];

            metrics.forEach((m, i) => {
                const mx = margin + (i * metricW);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                setText(COLORS.ink);
                doc.text(String(m.v), mx + 8, y + 15);
                doc.setFontSize(7);
                setText(COLORS.muted);
                doc.text(m.l, mx + 8, y + 8);
            });
            y += 34;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            setText(COLORS.ink);
            doc.text('Performance Analysis', margin, y);
            y += 8;

            results.forEach((result, index) => {
                const qWidth = contentWidth - 10;
                const questionLines = doc.splitTextToSize(`${index + 1}. ${result.question}`, qWidth);
                const answerLines = doc.splitTextToSize(`Your Input: ${result.userAnswer || 'No response'}`, qWidth - 5);
                const correctLines = result.isCorrect ? [] : doc.splitTextToSize(`Reference: ${result.correctAnswer}`, qWidth - 5);
                
                const cardHeight = (questionLines.length * 5) + (answerLines.length * 4.5) + (correctLines.length * 4.5) + 12;
                y = ensureSpace(cardHeight + 10, y);

                // Subtle separator instead of heavy cards
                setDraw(COLORS.border);
                doc.setLineWidth(0.1);
                doc.line(margin, y - 2, pageWidth - margin, y - 2);

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9.5);
                setText(COLORS.ink);
                doc.text(questionLines, margin, y + 5);
                
                let nextY = y + 7 + (questionLines.length * 5);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                setText(result.isCorrect ? COLORS.success : COLORS.danger);
                doc.text(answerLines, margin + 5, nextY);
                nextY += (answerLines.length * 4.5);

                if (!result.isCorrect) {
                    setText(COLORS.success);
                    doc.text(correctLines, margin + 5, nextY + 1);
                }

                y += cardHeight + 4;
            });

            drawFooter();
            doc.save(`${testTitle.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
        } catch (error) {
            console.error('PDF Export failed', error);
            window.alert('Unable to export PDF at this time.');
        }
    };

    return (
        <div className="score-report-shell">
            <motion.section
                className={`score-hero-card ${level.tone}`}
                style={{ '--score-percent': `${percentage}%`, '--score-level-color': level.color }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="score-hero-copy">
                    <span className="score-kicker">Assessment Report</span>
                    <div className="score-percent-wrap">
                        <span className="score-percent">{percentage}</span>
                        <span className="score-percent-symbol">%</span>
                    </div>
                    <h1>{level.label}</h1>
                    <p>{level.sub} This assessment measured your proficiency in {testTitle} across {total} key performance indicators.</p>

                    <div className="score-action-row">
                        <button type="button" onClick={onRetake} className="prep-primary-btn tests score-action-primary">
                            Retake Assessment <RefreshCw size={18} />
                        </button>
                        <button type="button" onClick={handleDownload} className="score-export-btn">
                            Export Report <Download size={18} />
                        </button>
                    </div>
                </div>

                <div className="score-dashboard">
                    <div className="score-ring-card">
                        <div className="score-ring">
                            <span>{percentage}%</span>
                        </div>
                        <div>
                            <strong>Completion precision</strong>
                            <span>{attempted}/{total} questions attempted</span>
                        </div>
                    </div>

                    <div className="score-metric-grid">
                        <article className="score-metric-card success">
                            <CheckCircle size={21} />
                            <span>Correct</span>
                            <strong>{score}</strong>
                        </article>
                        <article className="score-metric-card danger">
                            <XCircle size={21} />
                            <span>Improve</span>
                            <strong>{incorrect}</strong>
                        </article>
                    </div>

                    <div className="score-progress-card">
                        <div>
                            <Target size={19} />
                            <span>Readiness Track</span>
                        </div>
                        <div className="score-progress-track">
                            <motion.span initial={{ width: 0 }} animate={{ width: `${percentage}%` }} />
                        </div>
                    </div>
                </div>
            </motion.section>

            <section className="score-insight-strip">
                <article>
                    <TrendingUp size={18} />
                    <span>Accuracy</span>
                    <strong>{score}/{total}</strong>
                </article>
                <article>
                    <FileText size={18} />
                    <span>Attempted</span>
                    <strong>{attempted}/{total}</strong>
                </article>
                <article>
                    <Target size={18} />
                    <span>Focus Tags</span>
                    <strong>{tags?.length ? tags.slice(0, 2).join(', ') : 'Core'}</strong>
                </article>
            </section>

            <section>
                <div className="iq-section-label">
                    <span className="iq-section-label-text">Performance Analysis</span>
                    <div className="iq-section-label-line" />
                </div>

                <div className="score-analysis-grid">
                    {results.map((result, index) => (
                        <motion.article
                            key={`${result.question}-${index}`}
                            className={`score-result-card ${result.isCorrect ? 'correct' : 'incorrect'}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                        >
                            <div className="score-result-icon">
                                {result.isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                            </div>

                            <div className="score-result-content">
                                <div className="score-result-head">
                                    <span>Question {index + 1}</span>
                                    <strong>{result.isCorrect ? 'Mastered' : 'Review Required'}</strong>
                                </div>

                                <h2>{result.question}</h2>

                                <div className="score-answer-grid">
                                    <div className="score-answer-pill user">
                                        <span>Your Input</span>
                                        <strong>{result.userAnswer || 'No response'}</strong>
                                    </div>
                                    {!result.isCorrect && (
                                        <div className="score-answer-pill reference">
                                            <span>Reference Answer</span>
                                            <strong>{result.correctAnswer}</strong>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ScoreCard;
