import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Shared/Navbar';
import ConfirmModal from '../../components/Shared/ConfirmModal';

const NAV_LINKS = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/exams', label: 'Exams', icon: '📝' },
    { to: '/admin/results', label: 'Results', icon: '🏆' },
];

const BLANK_Q = { text: '', options: ['', '', '', ''], correct: 0, marks: 1 };

export default function ExamBuilder() {
    const { examId } = useParams();
    const { exams, addQuestion, deleteQuestion, updateExam, publishExam } = useApp();
    const exam = exams.find(e => e.id === examId);

    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(BLANK_Q);
    const [editMeta, setEditMeta] = useState(false);
    const [meta, setMeta] = useState({ title: exam?.title, duration: exam?.duration, passingMarks: exam?.passingMarks });
    const [formError, setFormError] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    if (!exam) return (
        <div style={{ padding: 40 }}>
            <p>Exam not found. <Link to="/admin/exams">← Back</Link></p>
        </div>
    );

    const openAdd = () => { setForm(BLANK_Q); setEditId(null); setShowModal(true); };

    const handleOptionChange = (i, val) => {
        setForm(p => {
            const opts = [...p.options];
            opts[i] = val;
            return { ...p, options: opts };
        });
    };

    const handleSubmitQ = (e) => {
        e.preventDefault();
        if (form.options.some(o => !o.trim())) {
            setFormError('Please fill all 4 options.');
            return;
        }
        addQuestion(examId, { ...form, marks: Number(form.marks), correct: Number(form.correct) });
        setFormError('');
        setShowModal(false);
    };

    const handleSaveMeta = () => {
        updateExam(examId, { title: meta.title, duration: Number(meta.duration), passingMarks: Number(meta.passingMarks) });
        setEditMeta(false);
    };

    return (
        <div>
            <Navbar links={NAV_LINKS} />
            <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6 md:py-8">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-5">
                    <Link to="/admin/exams" className="text-[var(--accent-primary)] no-underline">← Exams</Link>
                    <span className="text-[var(--text-muted)]">/</span>
                    <span>{exam.title}</span>
                </div>

                {/* Exam Meta Card */}
                <div className="card mb-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {editMeta ? (
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4 w-full">
                                <div className="form-group !mb-0 md:col-span-1">
                                    <label className="form-label">Title</label>
                                    <input className="form-input" value={meta.title}
                                        onChange={e => setMeta(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div className="form-group !mb-0">
                                    <label className="form-label">Duration (min)</label>
                                    <input className="form-input" type="number" value={meta.duration}
                                        onChange={e => setMeta(p => ({ ...p, duration: e.target.value }))} />
                                </div>
                                <div className="form-group !mb-0">
                                    <label className="form-label">Passing Marks</label>
                                    <input className="form-input" type="number" value={meta.passingMarks}
                                        onChange={e => setMeta(p => ({ ...p, passingMarks: e.target.value }))} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-3 mb-2">
                                    <h1 className="text-xl md:text-2xl font-['Syne',sans-serif] font-extrabold text-white">{exam.title}</h1>
                                    <span className={`badge badge-${exam.status === 'published' ? 'success' : 'warning'}`}>
                                        {exam.status}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[var(--text-secondary)] text-sm">
                                    <span className="flex items-center gap-1.5">⏱️ {exam.duration} minutes</span>
                                    <span className="flex items-center gap-1.5">❓ {exam.questions.length} questions</span>
                                    <span className="flex items-center gap-1.5">⭐ {exam.totalMarks} total marks</span>
                                    <span className="flex items-center gap-1.5">🎯 Pass: {exam.passingMarks} marks</span>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-2.5 shrink-0 mt-2 md:mt-0">
                            {editMeta ? (
                                <>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setEditMeta(false)}>Cancel</button>
                                    <button className="btn btn-primary btn-sm" onClick={handleSaveMeta}>Save</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditMeta(true); setMeta({ title: exam.title, duration: exam.duration, passingMarks: exam.passingMarks }); }}>
                                        ✏️ Edit
                                    </button>
                                    {exam.status === 'draft' && (
                                        <button className="btn btn-success btn-sm" onClick={() => publishExam(examId)}>
                                            🚀 Publish
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-['Syne',sans-serif] font-bold text-lg md:text-xl text-white">
                        Questions ({exam.questions.length})
                    </h2>
                    <button className="btn btn-primary" onClick={openAdd}>+ Add Question</button>
                </div>

                {exam.questions.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl">
                        <div className="text-5xl mb-3">❓</div>
                        <p className="text-[var(--text-secondary)] mb-4">No questions yet. Add your first MCQ!</p>
                        <button className="btn btn-primary" onClick={openAdd}>+ Add First Question</button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {exam.questions.map((q, idx) => (
                            <div key={q.id} className="card p-4 md:p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3 md:gap-4 flex-1">
                                        <div className="w-8 h-8 rounded-full bg-[rgba(79,141,255,0.15)] text-[var(--accent-primary)] flex items-center justify-center font-['Syne',sans-serif] font-bold text-[13px] shrink-0 mt-0.5">{idx + 1}</div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm md:text-[15px] mb-3.5 leading-relaxed text-white">{q.question || q.text}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {q.options.map((opt, oi) => {
                                                    const isCorrect = q.correctAnswer ? q.options[oi] === q.correctAnswer : oi === q.correct;
                                                    return (
                                                        <div key={oi} className={`flex items-center gap-2 p-2 md:p-2.5 bg-[var(--bg-secondary)] rounded-xl text-xs md:text-[13px] border transition-colors ${isCorrect ? 'border-[var(--accent-success)] bg-[rgba(0,214,143,0.08)] text-[var(--accent-success)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}>
                                                            <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center shrink-0 font-bold text-[10px] md:text-[11px]">{String.fromCharCode(65 + oi)}</span>
                                                            <span className="flex-1">{opt}</span>
                                                            {isCorrect && <span className="text-[var(--accent-success)] text-sm ml-auto font-bold">✓</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="mt-3">
                                                <span className="badge badge-primary">{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-danger btn-sm shrink-0 px-2.5"
                                        onClick={() => setConfirmDeleteId(q.id)}
                                        title="Delete Question"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Question Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal" style={{ maxWidth: 680 }}>
                        <h2 className="modal-title">Add MCQ Question</h2>
                        <form onSubmit={handleSubmitQ}>
                            <div className="form-group">
                                <label className="form-label">Question Text *</label>
                                <textarea className="form-textarea" placeholder="Enter the question..." required
                                    value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} />
                            </div>

                            {formError && (
                                <div className="mb-4 rounded-xl border border-[var(--accent-danger)] bg-[rgba(255,77,109,0.08)] p-3 text-sm text-[var(--accent-danger)]">
                                    {formError}
                                </div>
                            )}

                            <label className="form-label" style={{ display: 'block', marginBottom: 12 }}>
                                Options (mark the correct answer)
                            </label>
                            {form.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2.5 mb-2.5">
                                    <button
                                        type="button"
                                        className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-2 font-['Syne',sans-serif] font-bold cursor-pointer transition-colors shrink-0 flex items-center justify-center text-sm ${form.correct === i ? 'border-[var(--accent-success)] bg-[rgba(0,214,143,0.15)] text-[var(--accent-success)]' : 'border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'}`}
                                        onClick={() => setForm(p => ({ ...p, correct: i }))}
                                        title="Mark as correct answer"
                                    >
                                        {String.fromCharCode(65 + i)}
                                    </button>
                                    <input
                                        className="form-input"
                                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                        value={opt}
                                        onChange={e => handleOptionChange(i, e.target.value)}
                                        required
                                    />
                                    <span className={`text-[var(--accent-success)] text-lg shrink-0 ${form.correct === i ? 'opacity-100' : 'opacity-0'}`}>✓</span>
                                </div>
                            ))}
                            <p className="text-xs text-[var(--text-muted)] mb-4">
                                Click the letter button to set the correct answer.
                            </p>

                            <div className="form-group">
                                <label className="form-label">Marks for this question</label>
                                <input className="form-input" type="number" min={1} max={10}
                                    value={form.marks} onChange={e => setForm(p => ({ ...p, marks: e.target.value }))}
                                    className="form-input max-w-[100px]" />
                            </div>

                            <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-[var(--border)]">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Question</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={Boolean(confirmDeleteId)}
                title="Delete question"
                message="This action cannot be undone. Do you want to remove this question from the exam?"
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => {
                    deleteQuestion(examId, confirmDeleteId);
                    setConfirmDeleteId(null);
                }}
                onCancel={() => setConfirmDeleteId(null)}
            />
        </div>
    );
}
