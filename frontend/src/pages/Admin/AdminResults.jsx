import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Shared/Navbar';

const NAV_LINKS = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/exams', label: 'Exams', icon: '📝' },
    { to: '/admin/results', label: 'Results', icon: '🏆' },
];

export default function AdminResults() {
    const { exams, results, getLeaderboard } = useApp();
    const [selectedExam, setSelectedExam] = useState(exams[0]?.id || '');

    const leaderboard = selectedExam ? getLeaderboard(selectedExam) : [];
    const exam = exams.find(e => e.id === selectedExam);

    const passCount = leaderboard.filter(r => r.passed).length;
    const avgScore = leaderboard.length
        ? Math.round(leaderboard.reduce((a, r) => a + r.percentage, 0) / leaderboard.length)
        : 0;

    const rankMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    return (
        <div>
            <Navbar links={NAV_LINKS} />
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <h1 className="text-2xl md:text-[30px] font-['Syne',sans-serif] font-extrabold text-white">Results & Rankings</h1>
                        <p className="text-[var(--text-secondary)] mt-1 text-sm md:text-base">View student performance across all exams</p>
                    </div>
                </div>

                <div className="mb-6 md:mb-8">
                    <label className="form-label">Select Exam</label>
                    <select className="form-select w-full md:max-w-[360px]"
                        value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
                        {exams.map(e => (
                            <option key={e.id} value={e.id}>{e.title}</option>
                        ))}
                    </select>
                </div>

                {exam && leaderboard.length > 0 && (
                    <>
                        {/* Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
                            {[
                                { label: 'Attempts', value: leaderboard.length, icon: '📋' },
                                { label: 'Passed', value: passCount, icon: '✅' },
                                { label: 'Failed', value: leaderboard.length - passCount, icon: '❌' },
                                { label: 'Pass Rate', value: `${Math.round(passCount / leaderboard.length * 100)}%`, icon: '📊' },
                                { label: 'Avg Score', value: `${avgScore}%`, icon: '📈' },
                                { label: 'Top Score', value: `${leaderboard[0]?.percentage}%`, icon: '🏆' },
                            ].map(s => (
                                <div key={s.label} className="card text-center p-4">
                                    <div className="text-[22px] mb-2.5">{s.icon}</div>
                                    <div className="text-2xl font-['Syne',sans-serif] font-extrabold mb-1 text-white">{s.value}</div>
                                    <div className="text-[10px] md:text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Podium for top 3 */}
                        {leaderboard.length >= 3 && (
                            <div className="card mb-6 md:mb-8 pb-0 md:pb-0 overflow-hidden">
                                <h2 className="text-base md:text-[17px] font-['Syne',sans-serif] font-bold text-white mb-6">🏆 Top Performers — {exam.title}</h2>
                                <div className="flex items-end justify-center gap-2 md:gap-4 mt-6 px-2">
                                    {[leaderboard[1], leaderboard[0], leaderboard[2]].map((r, i) => {
                                        if (!r) return null;
                                        const baseHeight = window.innerWidth < 768 ? 80 : 100;
                                        const heights = [baseHeight, baseHeight + 30, baseHeight - 20];
                                        return (
                                            <div key={r.id} className="flex flex-col items-center w-24 md:w-[140px]" style={{ height: heights[i] + 80 }}>
                                                <div className="w-10 h-10 md:w-[50px] md:h-[50px] rounded-full bg-gradient-to-br from-[#4f8dff] to-[#00e5c8] flex items-center justify-center font-bold text-lg md:text-xl text-white mb-2 shadow-lg">{r.userName.charAt(0)}</div>
                                                <div className="font-bold text-xs md:text-sm text-white truncate w-full text-center px-1">{r.userName}</div>
                                                <div className="text-[10px] md:text-xs text-[var(--text-muted)] mt-0.5">{r.percentage}%</div>
                                                <div className="w-full rounded-t-lg flex items-center justify-center mt-2 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]" style={{
                                                    height: heights[i],
                                                    background: i === 1 ? 'linear-gradient(180deg, #ffd700 0%, #ffaa00 100%)'
                                                        : i === 0 ? 'linear-gradient(180deg, #c0c0c0 0%, #999 100%)'
                                                            : 'linear-gradient(180deg, #cd7f32 0%, #a0522d 100%)'
                                                }}>
                                                    <span className="font-['Syne',sans-serif] font-extrabold text-lg md:text-[22px] text-white drop-shadow-md">
                                                        {rankMedal(r.rank)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Full Leaderboard Table */}
                        <div className="card p-0 overflow-hidden">
                            <div className="p-5 md:p-6 border-b border-[var(--border)]">
                                <h2 className="text-base md:text-[17px] font-['Syne',sans-serif] font-bold text-white">Full Leaderboard</h2>
                            </div>
                            <div className="overflow-x-auto pb-2">
                                <table className="w-full text-left border-collapse min-w-[700px]">
                                    <thead>
                                        <tr className="bg-[var(--bg-primary)] border-b border-[var(--border)] text-[11px] md:text-xs text-[var(--text-muted)] uppercase tracking-wider">
                                            <th className="px-5 py-3 font-semibold">Rank</th>
                                            <th className="px-5 py-3 font-semibold">Student</th>
                                            <th className="px-5 py-3 font-semibold">Score</th>
                                            <th className="px-5 py-3 font-semibold">Percentage</th>
                                            <th className="px-5 py-3 font-semibold">Time Taken</th>
                                            <th className="px-5 py-3 font-semibold">Status</th>
                                            <th className="px-5 py-3 font-semibold">Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.map(r => (
                                            <tr key={r.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-primary)] transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <span className="font-['Syne',sans-serif] font-extrabold text-[15px] md:text-base text-white">
                                                        {rankMedal(r.rank)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f8dff] to-[#00e5c8] flex items-center justify-center font-bold text-[13px] text-white shrink-0 shadow-sm">{r.userName.charAt(0)}</div>
                                                        <span className="font-semibold text-[13px] md:text-sm text-white">{r.userName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 font-bold text-[13px] md:text-sm text-white">{r.score} / {r.totalMarks}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex-1 h-1.5 md:h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden min-w-[60px]">
                                                            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${r.percentage}%`, background: r.percentage >= 70 ? 'var(--accent-success)' : r.percentage >= 40 ? 'var(--accent-warning)' : 'var(--accent-danger)' }} />
                                                        </div>
                                                        <span className="text-xs md:text-[13px] font-bold text-white w-9">{r.percentage}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-xs md:text-[13px] text-[var(--text-secondary)]">{Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`badge badge-${r.passed ? 'success' : 'danger'}`}>
                                                        {r.passed ? 'Passed' : 'Failed'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-[11px] md:text-xs text-[var(--text-muted)] whitespace-nowrap">
                                                    {new Date(r.submittedAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {leaderboard.length === 0 && (
                    <div className="card text-center py-12 md:py-16 px-4">
                        <div className="text-4xl md:text-5xl mb-3">📭</div>
                        <p className="text-sm md:text-base text-[var(--text-secondary)]">No submissions for this exam yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
