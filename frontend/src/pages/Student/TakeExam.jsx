import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ConfirmModal from '../../components/Shared/ConfirmModal';

export default function TakeExam() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const { exams, submitExam, hasAttempted } = useApp();

    const exam = exams.find(e => e.id === examId);
    const [started, setStarted] = useState(false);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [unansweredCount, setUnansweredCount] = useState(0);

    useEffect(() => {
        if (exam) {
            setAnswers(new Array(exam.questions.length).fill(null));
            setTimeLeft(exam.duration * 60);
        }
    }, [exam]);

    const doSubmit = useCallback(async () => {
        if (submitted) return;
        setSubmitted(true);
        const timeTaken = exam.duration * 60 - timeLeft;
        await submitExam(examId, answers, timeTaken);
        navigate('/student/results');
    }, [submitted, timeLeft, answers, examId, exam, submitExam, navigate]);

    useEffect(() => {
        if (!started || submitted) return;
        if (timeLeft <= 0) { doSubmit(); return; }
        const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(t);
    }, [started, submitted, timeLeft, doSubmit]);

    if (!exam) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Exam not found.</p>
        </div>
    );

    if (hasAttempted(examId)) return (
        <div style={styles.centered}>
            <div className="card" style={styles.centeredCard}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, marginBottom: 8 }}>Already Attempted</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>You have already taken this exam.</p>
                <button className="btn btn-primary" onClick={() => navigate('/student/results')}>View My Results</button>
            </div>
        </div>
    );

    if (!started) return (
        <div style={styles.centered}>
            <div className="card" style={styles.centeredCard}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, marginBottom: 8 }}>{exam.title}</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{exam.subject}</p>

                <div style={styles.infoGrid}>
                    {[
                        { icon: '⏱️', label: 'Duration', value: `${exam.duration} minutes` },
                        { icon: '❓', label: 'Questions', value: exam.questions.length },
                        { icon: '⭐', label: 'Total Marks', value: exam.totalMarks },
                        { icon: '🎯', label: 'Passing Marks', value: `${exam.passingMarks} / ${exam.totalMarks}` },
                    ].map(i => (
                        <div key={i.label} style={styles.infoItem}>
                            <span style={{ fontSize: 20 }}>{i.icon}</span>
                            <div>
                                <div style={styles.infoVal}>{i.value}</div>
                                <div style={styles.infoLbl}>{i.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={styles.instructions}>
                    <p style={{ fontWeight: 600, marginBottom: 8 }}>📌 Instructions</p>
                    <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
                        <li>Read each question carefully before answering.</li>
                        <li>You can navigate between questions freely.</li>
                        <li>The exam will auto-submit when the timer expires.</li>
                        <li>Once submitted, you cannot retake the exam.</li>
                    </ul>
                </div>

                <button className="btn btn-primary btn-lg w-full" onClick={() => { setStarted(true); setStartTime(Date.now()); }}>
                    🚀 Start Exam Now
                </button>
            </div>
        </div>
    );

    const q = exam.questions[current];
    const answered = answers.filter(a => a !== null).length;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timerDanger = timeLeft < 120;
    const timerWarning = timeLeft < 300;

    return (
        <div style={styles.examWrapper}>
            {/* Header */}
            <div style={styles.examHeader}>
                <div style={styles.examHeaderLeft}>
                    <div style={styles.examHeaderLogo}>TNS</div>
                    <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>{exam.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{answered} of {exam.questions.length} answered</div>
                    </div>
                </div>
                <div style={{
                    ...styles.timer,
                    color: timerDanger ? 'var(--accent-danger)' : timerWarning ? 'var(--accent-warning)' : 'var(--accent-success)',
                    borderColor: timerDanger ? 'rgba(255,77,109,0.3)' : timerWarning ? 'rgba(255,193,7,0.3)' : 'rgba(0,214,143,0.3)',
                    background: timerDanger ? 'rgba(255,77,109,0.1)' : timerWarning ? 'rgba(255,193,7,0.1)' : 'rgba(0,214,143,0.08)',
                    animation: timerDanger ? 'pulse 1s infinite' : 'none',
                }}>
                    <span style={{ fontSize: 16 }}>⏱️</span>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20 }}>
                        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                    </span>
                </div>
            </div>

            <div style={styles.examBody}>
                {/* Sidebar - Question Navigator */}
                <div style={styles.sidebar}>
                    <div style={styles.sidebarTitle}>Questions</div>
                    <div style={styles.qGrid}>
                        {exam.questions.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                style={{
                                    ...styles.qBtn,
                                    ...(i === current ? styles.qBtnCurrent : {}),
                                    ...(answers[i] !== null && i !== current ? styles.qBtnAnswered : {}),
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <div style={styles.legend}>
                        <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: 'var(--accent-primary)' }} /> Current</div>
                        <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: 'var(--accent-success)' }} /> Answered</div>
                        <div style={styles.legendItem}><div style={{ ...styles.legendDot, background: 'var(--bg-secondary)' }} /> Unanswered</div>
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                        <div style={styles.progressInfo}>
                            <span>{answered}/{exam.questions.length} answered</span>
                            <span>{Math.round(answered / exam.questions.length * 100)}%</span>
                        </div>
                        <div style={styles.progressBar}>
                            <div style={{ ...styles.progressFill, width: `${answered / exam.questions.length * 100}%` }} />
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div style={styles.questionArea}>
                    <div style={styles.qHeader}>
                        <span style={styles.qCounter}>Question {current + 1} of {exam.questions.length}</span>
                        <span className="badge badge-primary">{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                    </div>

                    <h2 style={styles.qText}>{q.question || q.text}</h2>

                    <div style={styles.options}>
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                style={{
                                    ...styles.optionBtn,
                                    ...(answers[current] === i ? styles.optionSelected : {})
                                }}
                                onClick={() => {
                                    const newAnswers = [...answers];
                                    newAnswers[current] = i;
                                    setAnswers(newAnswers);
                                }}
                            >
                                <div style={{
                                    ...styles.optionCircle,
                                    ...(answers[current] === i ? styles.optionCircleSelected : {})
                                }}>
                                    {String.fromCharCode(65 + i)}
                                </div>
                                <span style={{ flex: 1, textAlign: 'left' }}>{opt}</span>
                                {answers[current] === i && <span style={{ color: 'var(--accent-primary)', fontSize: 18 }}>●</span>}
                            </button>
                        ))}
                    </div>

                    <div style={styles.navRow}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setCurrent(p => Math.max(0, p - 1))}
                            disabled={current === 0}
                        >
                            ← Previous
                        </button>

                        {current < exam.questions.length - 1 ? (
                            <button className="btn btn-primary" onClick={() => setCurrent(p => p + 1)}>
                                Next →
                            </button>
                        ) : (
                            <>
                                <button className="btn btn-success" onClick={() => {
                                    const unanswered = answers.filter(a => a === null).length;
                                    if (unanswered > 0) {
                                        setUnansweredCount(unanswered);
                                        setConfirmOpen(true);
                                        return;
                                    }
                                    doSubmit();
                                }}>
                                    ✅ Submit Exam
                                </button>

                                <ConfirmModal
                                    open={confirmOpen}
                                    title="Submit exam?"
                                    message={`You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`}
                                    confirmText="Submit"
                                    cancelText="Continue Reviewing"
                                    onConfirm={() => {
                                        setConfirmOpen(false);
                                        doSubmit();
                                    }}
                                    onCancel={() => setConfirmOpen(false)}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
        </div>
    );
}

const styles = {
    centered: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
    centeredCard: { maxWidth: 520, width: '100%', textAlign: 'center' },
    infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
    infoItem: {
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
        background: 'var(--bg-secondary)', borderRadius: 10, textAlign: 'left',
    },
    infoVal: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' },
    infoLbl: { fontSize: 12, color: 'var(--text-muted)' },
    instructions: {
        background: 'var(--bg-secondary)', borderRadius: 10, padding: '16px 20px',
        marginBottom: 24, textAlign: 'left',
    },
    examWrapper: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
    examHeader: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 64,
        background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100,
    },
    examHeaderLeft: { display: 'flex', alignItems: 'center', gap: 12 },
    examHeaderLogo: {
        width: 38, height: 38, borderRadius: 9,
        background: 'linear-gradient(135deg, #4f8dff, #00e5c8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff',
    },
    timer: {
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px',
        borderRadius: 10, border: '1px solid', transition: 'all 0.3s',
    },
    examBody: { display: 'flex', flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '24px', gap: 24 },
    sidebar: {
        width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 20,
        position: 'sticky', top: 88, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 112px)', overflowY: 'auto',
    },
    sidebarTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', marginBottom: 14 },
    qGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 },
    qBtn: {
        width: '100%', aspectRatio: '1', borderRadius: 7, border: '1px solid var(--border)',
        background: 'var(--bg-secondary)', color: 'var(--text-secondary)',
        cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12, transition: 'all 0.15s',
    },
    qBtnCurrent: { background: 'var(--accent-primary)', color: '#fff', border: '1px solid var(--accent-primary)' },
    qBtnAnswered: { background: 'rgba(0,214,143,0.15)', color: 'var(--accent-success)', border: '1px solid rgba(0,214,143,0.3)' },
    legend: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
    legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' },
    legendDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
    progressInfo: { display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 },
    progressBar: { height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', background: 'var(--accent-success)', borderRadius: 2, transition: 'width 0.3s' },
    questionArea: {
        flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column',
    },
    qHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    qCounter: { fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 },
    qText: { fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, lineHeight: 1.5, marginBottom: 28, color: 'var(--text-primary)' },
    options: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 'auto' },
    optionBtn: {
        display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
        background: 'var(--bg-secondary)', border: '2px solid var(--border)',
        borderRadius: 12, cursor: 'pointer', color: 'var(--text-primary)',
        fontSize: 15, transition: 'all 0.15s', textAlign: 'left', width: '100%',
    },
    optionSelected: {
        border: '2px solid var(--accent-primary)',
        background: 'rgba(79,141,255,0.1)',
    },
    optionCircle: {
        width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 13, flexShrink: 0,
        color: 'var(--text-secondary)',
    },
    optionCircleSelected: { border: '2px solid var(--accent-primary)', color: 'var(--accent-primary)', background: 'rgba(79,141,255,0.15)' },
    navRow: { display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' },
};
