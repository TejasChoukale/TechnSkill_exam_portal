import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Shared/Navbar';

const NAV_LINKS = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/exams', label: 'Exams', icon: '📝' },
    { to: '/admin/results', label: 'Results', icon: '🏆' },
];

export default function AdminDashboard() {
    const { exams, results, users } = useApp();

    const students = users.filter(u => u.role === 'student');
    const published = exams.filter(e => e.status === 'published');
    const totalAttempts = results.length;
    const passRate = results.length
        ? Math.round((results.filter(r => r.passed).length / results.length) * 100)
        : 0;

    const stats = [
        { label: 'Total Exams', value: exams.length, icon: '📝', color: '#4f8dff' },
        { label: 'Published', value: published.length, icon: '✅', color: '#00d68f' },
        { label: 'Students', value: students.length, icon: '👥', color: '#00e5c8' },
        { label: 'Total Attempts', value: totalAttempts, icon: '📋', color: '#ffc107' },
        { label: 'Pass Rate', value: `${passRate}%`, icon: '🎯', color: '#00d68f' },
    ];

    const recentResults = [...results]
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5);

    return (
        <div>
            <Navbar links={NAV_LINKS} />
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-[30px] font-['Syne',sans-serif] font-extrabold text-white">Admin Dashboard</h1>
                        <p className="text-[var(--text-secondary)] mt-1 text-sm md:text-base">Overview of your exam portal</p>
                    </div>
                    <Link to="/admin/exams" className="btn btn-primary">
                        + Create Exam
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
                    {stats.map(s => (
                        <div key={s.label} className="card text-center p-4 md:p-5">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-[22px] mx-auto mb-3" style={{ background: s.color + '22', color: s.color }}>
                                {s.icon}
                            </div>
                            <div className="text-2xl md:text-[28px] font-['Syne',sans-serif] font-extrabold mb-1 text-white">{s.value}</div>
                            <div className="text-[10px] md:text-xs text-[var(--text-secondary)] uppercase tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions + Recent */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <div className="card">
                        <h2 className="text-base md:text-lg font-['Syne',sans-serif] font-bold text-white">Quick Actions</h2>
                        <div className="flex flex-col gap-3 mt-4">
                            {[
                                { to: '/admin/exams', label: 'Manage All Exams', icon: '📝', desc: 'Create, edit, publish exams' },
                                { to: '/admin/results', label: 'View All Results', icon: '🏆', desc: 'See scores and rankings' },
                            ].map(a => (
                                <Link key={a.to} to={a.to} className="flex items-center gap-3.5 p-3.5 md:p-4 bg-[var(--bg-secondary)] rounded-xl no-underline border border-[var(--border)] transition-colors hover:border-[#4f8dff]">
                                    <div className="text-xl md:text-2xl w-10 h-10 md:w-[44px] md:h-[44px] flex items-center justify-center bg-[rgba(79,141,255,0.1)] rounded-xl shrink-0">{a.icon}</div>
                                    <div>
                                        <div className="text-sm md:text-[15px] font-semibold text-[var(--text-primary)] leading-tight">{a.label}</div>
                                        <div className="text-[11px] md:text-xs text-[var(--text-muted)] mt-0.5">{a.desc}</div>
                                    </div>
                                    <span className="ml-auto text-[var(--text-muted)]">→</span>
                                </Link>
                            ))}
                        </div>

                        <h2 className="text-base md:text-lg font-['Syne',sans-serif] font-bold text-white mt-7">Exams Overview</h2>
                        <div className="flex flex-col gap-2.5 mt-4">
                            {exams.slice(0, 4).map(exam => (
                                <div key={exam.id} className="flex items-center justify-between p-3 md:p-3.5 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                                    <div>
                                        <div className="text-sm font-semibold text-white leading-tight">{exam.title}</div>
                                        <div className="text-[11px] md:text-xs text-[var(--text-muted)] mt-0.5">
                                            {exam.questions?.length || 0} questions · {exam.duration || 0} min
                                        </div>
                                    </div>
                                    <span className={`badge badge-${exam.status === 'published' ? 'success' : 'warning'}`}>
                                        {exam.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-base md:text-lg font-['Syne',sans-serif] font-bold text-white">Recent Submissions</h2>
                        {recentResults.length === 0 ? (
                            <p className="text-[var(--text-muted)] mt-4 text-sm">
                                No submissions yet.
                            </p>
                        ) : (
                            <div className="flex flex-col mt-4">
                                {recentResults.map(r => (
                                    <div key={r.id} className="flex items-center gap-3 py-3 border-b border-[var(--border)] last:border-0">
                                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#4f8dff] to-[#00e5c8] flex items-center justify-center font-bold text-sm text-white shrink-0">
                                            {(r.userName || "U").charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[13px] md:text-sm font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
                                                {r.userName || "Unknown User"}
                                            </div>
                                            <div className="text-[11px] md:text-xs text-[var(--text-muted)] mt-0.5">{r.score || 0}/{r.totalMarks || 0}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className={`text-sm md:text-[15px] font-bold ${r.passed ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
                                                {r.score}/{r.totalMarks}
                                            </div>
                                            <div className="text-[10px] md:text-[11px] text-[var(--text-muted)]">{r.percentage || 0}%</div>
                                        </div>
                                        <span className={`badge badge-${r.passed ? 'success' : 'danger'} ml-1 shrink-0`}>
                                            {r.passed ? 'Pass' : 'Fail'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
