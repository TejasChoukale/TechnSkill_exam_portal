import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Shared/Navbar';

const NAV_LINKS = [
    { to: '/student', label: 'Dashboard', icon: '🏠' },
    { to: '/student/results', label: 'My Results', icon: '📊' },
];

export default function StudentResults() {
    const { results, exams, currentUser, getLeaderboard } = useApp();

    const myResults = useMemo(() => {
        return results.filter((r) => r.userId === currentUser?.id);
    }, [results, currentUser]);

    const myResultsWithExam = useMemo(() => {
        return myResults
            .map((r) => ({
                ...r,
                exam: exams.find((e) => String(e.id) === String(r.examId)),
            }))
            .filter((r) => r.exam);
    }, [myResults, exams]);

    const sortedResults = useMemo(() => {
        return [...myResultsWithExam].sort((a, b) => {
            if (b.percentage !== a.percentage) return b.percentage - a.percentage;
            return new Date(b.submittedAt) - new Date(a.submittedAt);
        });
    }, [myResultsWithExam]);

    const [selected, setSelected] = useState(null);
    const [tab, setTab] = useState('breakdown');

    // Always sync selected to first result when sortedResults changes
    useEffect(() => {
        if (sortedResults.length > 0) {
            setSelected((prev) => {
                // Keep current selection if it still exists
                if (prev && sortedResults.find((r) => r.id === prev)) return prev;
                return sortedResults[0].id;
            });
        }
    }, [sortedResults]);

    const result = useMemo(() => {
        if (!selected) return sortedResults[0] || null;
        return sortedResults.find((r) => r.id === selected) || sortedResults[0] || null;
    }, [sortedResults, selected]);

    const exam = result?.exam || null;

    const leaderboard = useMemo(() => {
        if (!result) return [];
        return getLeaderboard(result.examId);
    }, [result, getLeaderboard]);

    const myRank = useMemo(() => {
        return leaderboard.find((r) => r.userId === currentUser?.id);
    }, [leaderboard, currentUser]);

    const rankMedal = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    if (myResults.length === 0) {
        return (
            <div className="min-h-screen overflow-x-hidden">
                <Navbar links={NAV_LINKS} />

                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-4 text-center">
                    <div className="text-5xl">📭</div>

                    <h2 className="font-['Syne',sans-serif] font-extrabold text-2xl text-white">
                        No Results Yet
                    </h2>

                    <p className="text-[var(--text-secondary)]">
                        You haven't taken any exams yet.
                    </p>

                    <Link to="/student" className="btn btn-primary">
                        Browse Exams
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-x-hidden">
            <Navbar links={NAV_LINKS} />

            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-[30px] font-['Syne',sans-serif] font-extrabold text-white leading-tight">
                            My Results
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm mt-1">
                            Review your performance, rankings, and answer analysis.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3">
                            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 whitespace-nowrap">
                                Total Attempts
                            </div>
                            <div className="font-['Syne',sans-serif] font-extrabold text-lg text-white">
                                {myResults.length}
                            </div>
                        </div>

                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3">
                            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 whitespace-nowrap">
                                Passed
                            </div>
                            <div className="font-['Syne',sans-serif] font-extrabold text-lg text-[var(--accent-success)]">
                                {myResults.filter((r) => r.passed).length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] items-start w-full max-w-full">

                    {/* Sidebar */}
                    <div className="w-full lg:w-[280px] lg:min-w-[280px] shrink-0 flex flex-col bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl overflow-hidden lg:sticky lg:top-24">
                        <div className="px-4 py-3.5 font-['Syne',sans-serif] font-bold text-xs uppercase tracking-wider text-[var(--text-secondary)] border-b border-[var(--border)] bg-[rgba(0,0,0,0.2)]">
                            Exam Attempts
                        </div>

                        <div className="max-h-[650px] overflow-y-auto overflow-x-hidden">
                            {sortedResults.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => setSelected(r.id)}
                                    className={`w-full text-left px-4 py-3.5 bg-transparent border-0 border-b border-[var(--border)] cursor-pointer transition-all duration-200 hover:bg-[rgba(79,141,255,0.05)] ${r.id === (selected || sortedResults[0]?.id)
                                        ? 'bg-[rgba(79,141,255,0.1)] border-l-[3px] border-l-[var(--accent-primary)]'
                                        : 'border-l-[3px] border-l-transparent'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <span className="text-[13px] font-semibold text-[var(--text-primary)] truncate flex-1 min-w-0">
                                            {r.exam?.title}
                                        </span>
                                        <span className={`badge badge-${r.passed ? 'success' : 'danger'} text-[10px] shrink-0`}>
                                            {r.passed ? 'Pass' : 'Fail'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`font-['Syne',sans-serif] font-extrabold text-sm ${r.passed ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
                                            {r.score}/{r.totalMarks}
                                        </span>
                                        <span className="text-[var(--text-muted)] text-[11px] shrink-0">
                                            {new Date(r.submittedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Main Content ── */}
                    {result && exam ? (
                        <div className="flex-1 min-w-0 w-full">

                            {/* Score Overview */}
                            <div className={`border rounded-[20px] p-4 sm:p-5 md:p-6 mb-6 ${result.passed
                                ? 'bg-gradient-to-br from-[rgba(0,214,143,0.12)] to-[rgba(0,229,200,0.06)] border-[rgba(0,214,143,0.3)]'
                                : 'bg-gradient-to-br from-[rgba(255,77,109,0.12)] to-[rgba(255,100,100,0.06)] border-[rgba(255,77,109,0.3)]'
                                }`}>

                                {/* Top row */}
                                <div className="flex flex-col gap-3 mb-5">
                                    <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                                        <span className="text-[32px] sm:text-[40px] md:text-[48px] leading-none shrink-0 flex-shrink-0">
                                            {result.passed ? '🎉' : '😔'}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-['Syne',sans-serif] font-extrabold text-sm sm:text-base md:text-lg lg:text-xl text-white leading-tight break-words">
                                                {result.passed ? 'Congratulations! You Passed!' : 'Better Luck Next Time'}
                                            </div>
                                            <div className="text-[var(--text-secondary)] text-xs sm:text-[13px] mt-1 truncate">
                                                {exam?.title}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:gap-4">
                                        <div className="text-xs sm:text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                                            Score
                                        </div>
                                        <span className={`text-3xl sm:text-4xl md:text-[48px] font-['Syne',sans-serif] font-extrabold leading-none ${result.passed ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'
                                            }`}>
                                            {result.percentage}%
                                        </span>
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
                                    {[
                                        {
                                            label: 'Points',
                                            value: `${result.score}/${result.totalMarks}`,
                                        },
                                        {
                                            label: 'Time',
                                            value: `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s`,
                                        },
                                        {
                                            label: 'Rank',
                                            value: myRank ? rankMedal(myRank.rank) : '-',
                                        },
                                        {
                                            label: 'Correct',
                                            value: `${result.breakdown?.filter((b) => b.isCorrect).length} / ${result.breakdown?.length}`,
                                        },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex flex-col items-center bg-[rgba(0,0,0,0.2)] p-2 sm:p-2.5 rounded-lg">
                                            <span className="text-[8px] sm:text-[9px] text-[var(--text-muted)] uppercase tracking-wider mb-1 whitespace-nowrap font-semibold">
                                                {label}
                                            </span>
                                            <span className="font-['Syne',sans-serif] font-bold text-[11px] sm:text-xs md:text-sm text-white text-center break-words">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-1 mb-5">
                                {['breakdown', 'leaderboard'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className={`flex-1 py-2.5 rounded-lg border-none bg-transparent font-['Syne',sans-serif] font-bold text-xs md:text-sm cursor-pointer transition-all duration-150 whitespace-nowrap ${tab === t
                                            ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                                            : 'text-[var(--text-secondary)] hover:text-white'
                                            }`}
                                    >
                                        {t === 'breakdown' ? '📋 Answer Breakdown' : '🏆 Leaderboard'}
                                    </button>
                                ))}
                            </div>

                            {/* ── Breakdown tab ── */}
                            {tab === 'breakdown' && (
                                <div className="flex flex-col gap-3">
                                    {!exam?.questions?.length ? (
                                        <div className="card p-6 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                            <p>Exam questions data is unavailable. Please try refreshing the page.</p>
                                        </div>
                                    ) : result.breakdown?.length ? (
                                        result.breakdown.map((b, i) => {
                                            const q = exam.questions?.[i];
                                            if (!q) {
                                                return (
                                                    <div key={i} className="card p-4 md:p-5 border border-[var(--border)] bg-[var(--bg-secondary)]">
                                                        <p className="text-[var(--text-secondary)]">Question data unavailable</p>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={i}
                                                    className={`card p-4 md:p-5 border ${b.isCorrect
                                                        ? 'border-[rgba(0,214,143,0.2)]'
                                                        : 'border-[rgba(255,77,109,0.2)]'
                                                        }`}
                                                >
                                                    {/* Question row */}
                                                    <div className="flex items-start gap-3 min-w-0">
                                                        <span className="w-7 h-7 rounded-full bg-[rgba(79,141,255,0.15)] text-[var(--accent-primary)] flex items-center justify-center font-['Syne',sans-serif] font-bold text-xs shrink-0 mt-0.5">
                                                            {i + 1}
                                                        </span>
                                                        <p className="flex-1 font-semibold text-sm md:text-[15px] leading-relaxed text-white break-words min-w-0">
                                                            {q.question || q.text}
                                                        </p>
                                                        <span className="text-lg md:text-xl shrink-0">
                                                            {b.isCorrect ? '✅' : '❌'}
                                                        </span>
                                                    </div>

                                                    {/* Options */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 sm:pl-10">
                                                        {q.options.map((opt, oi) => {
                                                            const isCorrect = oi === b.correct;
                                                            const isWrong = oi === b.selected && !b.isCorrect;

                                                            return (
                                                                <div
                                                                    key={oi}
                                                                    className={`px-3 py-2 rounded-lg text-xs md:text-[13px] border break-words ${isCorrect
                                                                        ? 'bg-[rgba(0,214,143,0.12)] border-[rgba(0,214,143,0.3)] text-[var(--accent-success)]'
                                                                        : isWrong
                                                                            ? 'bg-[rgba(255,77,109,0.12)] border-[rgba(255,77,109,0.3)] text-[var(--accent-danger)]'
                                                                            : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                                                                        }`}
                                                                >
                                                                    <strong>{String.fromCharCode(65 + oi)}.</strong>{' '}
                                                                    {opt}
                                                                    {isCorrect && ' ✓'}
                                                                    {isWrong && ' ✗'}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {b.selected === null && (
                                                        <p className="sm:pl-10 mt-2 text-xs text-[var(--accent-warning)]">
                                                            ⚠️ Not answered
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })) : (
                                        <div className="card p-6 border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                            No detailed answer breakdown is available for this attempt.
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Leaderboard tab ── */}
                            {tab === 'leaderboard' && (
                                <div className="card p-4 md:p-5">

                                    {/* Desktop table */}
                                    <div className="hidden lg:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-[var(--bg-primary)] border-b border-[var(--border)] text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                                                    <th className="px-4 py-3 font-semibold rounded-l-xl">Rank</th>
                                                    <th className="px-4 py-3 font-semibold">Student</th>
                                                    <th className="px-4 py-3 font-semibold">Score</th>
                                                    <th className="px-4 py-3 font-semibold">Percentage</th>
                                                    <th className="px-4 py-3 font-semibold">Time</th>
                                                    <th className="px-4 py-3 font-semibold rounded-r-xl">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {leaderboard.map((r) => (
                                                    <tr
                                                        key={r.id}
                                                        className={`border-b border-[var(--border)] last:border-0 transition-colors ${r.userId === currentUser?.id
                                                            ? 'bg-[rgba(79,141,255,0.06)]'
                                                            : 'hover:bg-[var(--bg-primary)]'
                                                            }`}
                                                    >
                                                        <td className="px-4 py-4 font-['Syne',sans-serif] font-extrabold text-[15px] text-white whitespace-nowrap">
                                                            {rankMedal(r.rank)}
                                                        </td>
                                                        <td className="px-4 py-4 max-w-[200px]">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f8dff] to-[#00e5c8] flex items-center justify-center font-bold text-xs text-white shrink-0">
                                                                    {r.userName.charAt(0)}
                                                                </div>
                                                                <span className={`text-sm text-white truncate ${r.userId === currentUser?.id ? 'font-bold' : ''}`}>
                                                                    {r.userName}
                                                                    {r.userId === currentUser?.id && ' (You)'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 font-bold text-sm text-white whitespace-nowrap">
                                                            {r.score}/{r.totalMarks}
                                                        </td>
                                                        <td className={`px-4 py-4 font-bold text-sm whitespace-nowrap ${r.percentage >= 70 ? 'text-[var(--accent-success)]' : 'text-[var(--text-secondary)]'}`}>
                                                            {r.percentage}%
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                                                            {Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            <span className={`badge badge-${r.passed ? 'success' : 'danger'}`}>
                                                                {r.passed ? 'Pass' : 'Fail'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile cards */}
                                    <div className="flex flex-col gap-3 lg:hidden">
                                        {leaderboard.map((r) => (
                                            <div
                                                key={r.id}
                                                className={`rounded-2xl border p-4 ${r.userId === currentUser?.id
                                                    ? 'border-[rgba(79,141,255,0.3)] bg-[rgba(79,141,255,0.06)]'
                                                    : 'border-[var(--border)] bg-[var(--bg-secondary)]'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3 mb-4">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4f8dff] to-[#00e5c8] flex items-center justify-center font-bold text-sm text-white shrink-0">
                                                            {r.userName.charAt(0)}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-semibold text-white truncate">
                                                                {r.userName}
                                                                {r.userId === currentUser?.id && ' (You)'}
                                                            </div>
                                                            <div className="text-xs text-[var(--text-muted)] mt-0.5">
                                                                Rank {rankMedal(r.rank)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className={`badge badge-${r.passed ? 'success' : 'danger'} shrink-0`}>
                                                        {r.passed ? 'Pass' : 'Fail'}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="bg-[var(--bg-primary)] rounded-xl p-2 text-center">
                                                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Score</div>
                                                        <div className="font-bold text-white text-xs whitespace-nowrap">{r.score}/{r.totalMarks}</div>
                                                    </div>
                                                    <div className="bg-[var(--bg-primary)] rounded-xl p-2 text-center">
                                                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Percent</div>
                                                        <div className={`font-bold text-xs ${r.percentage >= 70 ? 'text-[var(--accent-success)]' : 'text-white'}`}>
                                                            {r.percentage}%
                                                        </div>
                                                    </div>
                                                    <div className="bg-[var(--bg-primary)] rounded-xl p-2 text-center">
                                                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Time</div>
                                                        <div className="font-bold text-white text-xs whitespace-nowrap">
                                                            {Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 min-w-0 w-full flex items-center justify-center py-20">
                            <p className="text-[var(--text-secondary)]">Select an attempt to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}