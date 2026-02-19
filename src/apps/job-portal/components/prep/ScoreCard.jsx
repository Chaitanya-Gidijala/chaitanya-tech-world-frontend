
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Award, RefreshCw, BookOpen, Target, Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';

const ScoreCard = ({ score, total, results, onRetake, tags = [], testTitle = "Assessment" }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const percentage = Math.round((score / total) * 100);

    const getLevel = (pct) => {
        if (pct >= 85) return { label: 'Expert', color: '#10b981', icon: <Award size={isMobile ? 32 : 48} /> };
        if (pct >= 60) return { label: 'Intermediate', color: '#f59e0b', icon: <Target size={isMobile ? 32 : 48} /> };
        return { label: 'Beginner', color: '#ef4444', icon: <BookOpen size={isMobile ? 32 : 48} /> };
    };

    const level = getLevel(percentage);

    const handleDownload = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();

        // Brand Colors
        const primaryColor = [99, 102, 241]; // Indigo hsl(260, 100%, 60%)
        const secondaryColor = [236, 72, 153]; // Pink hsl(320, 100%, 50%)
        const successColor = [16, 185, 129];
        const errorColor = [239, 68, 68];
        const textColor = [30, 41, 59];
        const mutedColor = [100, 116, 139];

        // Header / Branding (Minimal & Professional)
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(1.5);
        doc.line(20, 15, 120, 15); // Primary accent
        doc.setDrawColor(...secondaryColor);
        doc.line(120, 15, 190, 15); // Secondary accent

        doc.setTextColor(...primaryColor);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("CHAITANYA TECH WORLD", 20, 30);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...mutedColor);
        doc.text("Professional Assessment Score Card", 20, 38);

        // Assessment Info
        doc.setTextColor(...textColor);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(testTitle, 20, 55);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...mutedColor);
        doc.text(`Date: ${date} | Time: ${time}`, 20, 62);

        // Score Summary Section
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(20, 70, 190, 70);

        // Circular Score Effect
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(1.5);
        doc.ellipse(50, 95, 20, 20);

        doc.setTextColor(...primaryColor);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(`${percentage}%`, 50, 98, { align: 'center' });

        doc.setFontSize(8);
        doc.text("SCORE", 50, 103, { align: 'center' });

        // Stats
        doc.setTextColor(...textColor);
        doc.setFontSize(12);
        doc.text("Result Details", 85, 85);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Proficiency: ${level.label}`, 85, 93);

        doc.setTextColor(...successColor);
        doc.text(`Correct: ${score}`, 85, 100);

        doc.setTextColor(...errorColor);
        doc.text(`Incorrect: ${total - score}`, 85, 107);

        doc.setTextColor(...textColor);
        doc.text(`Total Questions: ${total}`, 85, 114);

        // Review Section
        let y = 135;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text("Detailed Review", 20, y);
        y += 10;

        results.forEach((res, index) => {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            // Question
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...textColor);

            const splitQuestion = doc.splitTextToSize(`${index + 1}. ${res.question}`, 170);
            doc.text(splitQuestion, 20, y);
            y += splitQuestion.length * 5;

            // Answers (Removed Symbols to avoid garbled text)
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);

            if (res.isCorrect) {
                doc.setTextColor(...successColor);
                const splitAnswer = doc.splitTextToSize(`[+] Your Correct Choice: ${res.userAnswer}`, 160);
                doc.text(splitAnswer, 25, y);
                y += splitAnswer.length * 5;
            } else {
                doc.setTextColor(...errorColor);
                const splitUserChoice = doc.splitTextToSize(`[-] Your Choice: ${res.userAnswer || 'Skipped'}`, 160);
                doc.text(splitUserChoice, 25, y);
                y += splitUserChoice.length * 5;

                doc.setTextColor(...successColor);
                const splitCorrect = doc.splitTextToSize(`    Correct Answer: ${res.correctAnswer}`, 160);
                doc.text(splitCorrect, 25, y);
                y += splitCorrect.length * 5;
            }

            y += 6; // Spacing between items
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(...mutedColor);
            doc.text(`Page ${i} of ${pageCount} | Chaitanya Tech World - Excellence in Learning`, 105, 290, { align: 'center' });
        }

        doc.save(`${testTitle.replace(/\s+/g, '_')}_Result.pdf`);
    };

    return (
        <div className="jp-results-container" style={{ padding: isMobile ? '1rem' : undefined }}>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="jp-results-summary-card"
                style={{ padding: isMobile ? '2rem 1.5rem' : '4rem' }}
            >
                {/* Decorative background element */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: level.color, opacity: 0.05, borderRadius: '50%' }}></div>

                <div className="jp-score-circle-lg" style={{
                    borderColor: level.color,
                    width: isMobile ? '120px' : '140px',
                    height: isMobile ? '120px' : '140px',
                    marginBottom: isMobile ? '1.5rem' : '2rem'
                }}>
                    <span style={{ fontSize: isMobile ? '2.5rem' : '3rem', fontWeight: 900, color: 'var(--jp-text-main)', lineHeight: '1' }}>{percentage}<span style={{ fontSize: '1.25rem' }}>%</span></span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--jp-text-muted)', fontWeight: 800, marginTop: '0.25rem', letterSpacing: '0.1em' }}>SCORE</span>
                </div>

                <h2 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', fontWeight: 900, color: level.color, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                    {level.label}
                </h2>
                <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', color: 'var(--jp-text-muted)', marginBottom: isMobile ? '2rem' : '3rem', maxWidth: '500px', margin: isMobile ? '0 auto 2rem auto' : '0 auto 3rem auto', lineHeight: '1.6' }}>
                    {percentage >= 85 ? "Outstanding performance! You have demonstrated exceptional mastery." :
                        percentage >= 60 ? "Well done! You have a solid understanding, but there's room for precision." :
                            "A good start! Focusing on the review areas below will strengthen your knowledge."}
                </p>

                <div className="jp-results-stats-row" style={{ flexDirection: 'row', gap: '1rem', flexWrap: 'nowrap' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 900, color: '#10b981', lineHeight: '1' }}>{score}</div>
                        <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', fontWeight: 700, color: 'var(--jp-text-muted)', marginTop: '0.4rem', textTransform: 'uppercase' }}>Correct</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: 'var(--jp-border)' }}></div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 900, color: '#ef4444', lineHeight: '1' }}>{total - score}</div>
                        <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', fontWeight: 700, color: 'var(--jp-text-muted)', marginTop: '0.4rem', textTransform: 'uppercase' }}>Incorrect</div>
                    </div>
                </div>

                {tags.length > 0 && (
                    <div style={{ marginBottom: '3.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
                            {tags.map(tag => (
                                <span key={tag} style={{ padding: '0.5rem 1.25rem', background: 'var(--jp-bg)', borderRadius: '50px', fontSize: '0.85rem', color: 'var(--jp-text-muted)', fontWeight: 600, border: '1px solid var(--jp-border)' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleDownload}
                        className="jp-btn"
                        style={{ border: '2px solid var(--jp-border)', color: 'var(--jp-text-muted)', background: 'transparent', gap: '0.75rem', padding: '1rem 2rem', fontSize: '1rem', borderRadius: '16px', fontWeight: 800, transition: 'all 0.2s' }}
                    >
                        <Download size={20} /> Download Report
                    </button>
                    <button
                        onClick={onRetake}
                        className="jp-btn jp-btn-primary"
                        style={{ gap: '0.75rem', padding: '1rem 2.5rem', fontSize: '1rem', borderRadius: '16px', fontWeight: 800, boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}
                    >
                        <RefreshCw size={20} /> Retake Assessment
                    </button>
                </div>
            </motion.div>

            <div className="jp-results-review-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--jp-text-main)', letterSpacing: '-0.01em' }}>Detailed Analysis</h3>
                    <div style={{ padding: '0.4rem 1rem', background: 'var(--jp-bg-secondary)', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--jp-text-muted)' }}>
                        {results.length} Questions
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {results.map((res, index) => (
                        <div
                            key={index}
                            className="jp-review-item"
                            style={{
                                borderLeft: `6px solid ${res.isCorrect ? '#10b981' : '#ef4444'}`,
                            }}
                        >
                            <div style={{ marginTop: '0.25rem', padding: '0.5rem', background: res.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '10px' }}>
                                {res.isCorrect ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--jp-text-main)', lineHeight: '1.5' }}>{res.question}</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
                                    <span style={{ color: 'var(--jp-text-muted)', fontWeight: 600 }}>Your Answer:</span>
                                    <span style={{ color: res.isCorrect ? '#10b981' : '#ef4444', fontWeight: 800 }}>{res.userAnswer || 'Skipped'}</span>

                                    {!res.isCorrect && (
                                        <>
                                            <span style={{ color: 'var(--jp-text-muted)', fontWeight: 600 }}>Correct Solution:</span>
                                            <span style={{ color: '#10b981', fontWeight: 800 }}>{res.correctAnswer}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );



};
export default ScoreCard;
