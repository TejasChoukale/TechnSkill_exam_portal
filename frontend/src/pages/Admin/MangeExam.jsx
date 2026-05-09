import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Shared/Navbar';
import ConfirmModal from '../../components/Shared/ConfirmModal';

const NAV_LINKS = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/exams', label: 'Exams', icon: '📝' },
    { to: '/admin/results', label: 'Results', icon: '🏆' },
];

const BLANK = { title: '', subject: '', duration: 30, passingMarks: 6, description: '' };

export default function ManageExams() {
    const { exams, createExam, deleteExam, publishExam, results } = useApp();
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(BLANK);
    const [search, setSearch] = useState('');
    const [deleteExamId, setDeleteExamId] = useState(null);

    const filtered = exams.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.subject?.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreate = (e) => {
        e.preventDefault();
        createExam(form);
        setShowModal(false);
        setForm(BLANK);
    };

    const attemptCount = (examId) => results.filter(r => r.examId === examId).length;

    return (
        <div>
            <Navbar links={NAV_LINKS} />
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-[30px] font-['Syne',sans-serif] font-extrabold text-white">Manage Exams</h1>
                        <p className="text-[var(--text-secondary)] mt-1 text-sm">Overview of all created exams</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        + New Exam
                    </button>
                </div>

                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <input
                        className="form-input w-full md:max-w-[300px]"
                        placeholder="🔍  Search exams..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {filtered.map(exam => (
                        <div key={exam.id} className="card flex flex-col h-full hover:border-[var(--accent-primary)] transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                                <div>
                                    <span className={`badge badge-${exam.status === 'published' ? 'success' : 'warning'}`}>
                                        {exam.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {exam.status === 'draft' && (
                                        <button className="btn btn-success btn-sm" onClick={() => publishExam(exam.id)}>
                                            Publish
                                        </button>
                                    )}
                                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteExamId(exam.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-base md:text-lg font-['Syne',sans-serif] font-bold mb-1 text-white leading-tight">{exam.title}</h3>
                            <p className="text-xs md:text-[13px] text-[var(--text-secondary)] mb-4">{exam.subject}</p>

                            <div className="grid grid-cols-2 gap-2 mb-5 mt-auto">
                                <div className="flex items-center gap-1.5 text-xs md:text-[13px] text-[var(--text-secondary)]">
                                    <span>⏱️</span>
                                    <span>{exam.duration} min</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs md:text-[13px] text-[var(--text-secondary)]">
                                    <span>❓</span>
                                    <span>{exam.questions?.length || exam.totalQuestions || 0} questions</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs md:text-[13px] text-[var(--text-secondary)]">
                                    <span>⭐</span>
                                    <span>{exam.totalMarks} marks</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs md:text-[13px] text-[var(--text-secondary)]">
                                    <span>👥</span>
                                    <span>{attemptCount(exam.id)} attempts</span>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <Link to={`/admin/exams/${exam.id}/build`} className="btn btn-secondary w-full">
                                    ✏️ Edit & Add Questions
                                </Link>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="col-span-full text-center p-10 md:p-[80px] text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)]">
                            <div className="text-5xl mb-4">📭</div>
                            <p>No exams found. Create your first exam!</p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
                    <div className="modal" style={{ maxWidth: 560 }}>
                        <div style={{ marginBottom: 28 }}>
                            <h2 className="modal-title">✨ Create New Exam</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>Set up the core details for your new assessment.</p>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="form-label">Exam Title <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
                                <input className="form-input" placeholder="e.g. Advanced JavaScript Patterns" required
                                    value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <input className="form-input" placeholder="e.g. Programming"
                                    value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div className="form-group">
                                    <label className="form-label">Duration (min) <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
                                    <input className="form-input" type="number" min={5} max={300} required
                                        value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Passing Marks <span style={{ color: 'var(--accent-danger)' }}>*</span></label>
                                    <input className="form-input" type="number" min={1} required
                                        value={form.passingMarks} onChange={e => setForm(p => ({ ...p, passingMarks: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 32 }}>
                                <label className="form-label">Description</label>
                                <textarea className="form-textarea" placeholder="Brief description or instructions for the students..."
                                    value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Exam →</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={Boolean(deleteExamId)}
                title="Delete exam"
                message="Deleting this exam is permanent. Do you want to continue?"
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={() => {
                    deleteExam(deleteExamId);
                    setDeleteExamId(null);
                }}
                onCancel={() => setDeleteExamId(null)}
            />
        </div>
    );
}
