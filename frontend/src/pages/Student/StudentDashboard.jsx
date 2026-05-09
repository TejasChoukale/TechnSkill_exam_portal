import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Navbar from '../../components/Shared/Navbar';

const NAV_LINKS = [
    { to: '/student', label: 'Dashboard', icon: '🏠' },
    { to: '/student/results', label: 'My Results', icon: '📊' },
];

export default function StudentDashboard() {
    const { exams, results, currentUser, hasAttempted, getExamResult } = useApp();

    const publishedExams = useMemo(
        () => exams.filter((exam) => exam.status === 'published'),
        [exams]
    );

    const myResults = useMemo(
        () => results.filter((result) => result.userId === currentUser?.id),
        [results, currentUser]
    );

    const attemptedCount = myResults.length;
    const passedCount = myResults.filter((result) => result.passed).length;
    const availableCount = publishedExams.length;

    const latestResult = useMemo(() => {
        return [...myResults].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
    }, [myResults]);

    const latestExam = useMemo(() => {
        if (!latestResult) return null;
        return exams.find((exam) => String(exam.id) === String(latestResult.examId));
    }, [latestResult, exams]);

    return (
        <div className="min-h-screen overflow-x-hidden">
            <Navbar links={NAV_LINKS} />

            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-[30px] font-['Syne',sans-serif] font-extrabold text-white">
                            Welcome back, {currentUser?.name || 'Learner'}
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm mt-1">
                            Explore exams, check your progress, and continue building your skills.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3">
                            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 whitespace-nowrap">
                                Published Exams
                            </div>
                            <div className="font-['Syne',sans-serif] font-extrabold text-lg text-white">
                                {availableCount}
                            </div>
                        </div>
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3">
                            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 whitespace-nowrap">
                                Attempts
                            </div>
                            <div className="font-['Syne',sans-serif] font-extrabold text-lg text-white">
                                {attemptedCount}
                            </div>
                        </div>
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3">
                            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1 whitespace-nowrap">
                                Passed
                            </div>
                            <div className="font-['Syne',sans-serif] font-extrabold text-lg text-[var(--accent-success)]">
                                {passedCount}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr_320px] gap-6 w-full max-w-full overflow-hidden">
                    <div className="flex flex-col gap-6 min-w-0">
                        <div className="border rounded-[20px] bg-[var(--bg-secondary)] border-[var(--border)] p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
                                        Exam panel
                                    </p>
                                    <h2 className="text-xl font-['Syne',sans-serif] font-extrabold text-white">
                                        Choose your next exam
                                    </h2>
                                </div>
                                <span className="text-sm text-[var(--text-secondary)]">
                                    {availableCount} exam{availableCount === 1 ? '' : 's'} available
                                </span>
                            </div>
                        </div>

                        {publishedExams.length === 0 ? (
                            <div className="border rounded-[20px] bg-[var(--bg-secondary)] border-[var(--border)] p-6 text-center">
                                <p className="text-[var(--text-secondary)]">
                                    No exams are available right now.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {publishedExams.map((exam) => {
                                    const attempted = hasAttempted(exam.id);
                                    const examResult = getExamResult(exam.id);

                                    return (
                                        <div
                                            key={exam.id}
                                            className="border rounded-[20px] bg-[var(--bg-secondary)] border-[var(--border)] p-5 transition-shadow hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-semibold text-white truncate">
                                                        {exam.title}
                                                    </h3>
                                                    <p className="text-[var(--text-secondary)] text-sm mt-2">
                                                        {exam.description}
                                                    </p>
                                                </div>
                                                <span className={`badge badge-${attempted ? 'success' : 'primary'} shrink-0`}>
                                                    {attempted ? 'Attempted' : 'New'}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-[var(--text-secondary)] text-xs">
                                                <div className="bg-[rgba(255,255,255,0.04)] rounded-2xl px-3 py-2">
                                                    <div className="uppercase tracking-wider">Questions</div>
                                                    <div className="font-bold text-sm text-white">{exam.totalQuestions}</div>
                                                </div>
                                                <div className="bg-[rgba(255,255,255,0.04)] rounded-2xl px-3 py-2">
                                                    <div className="uppercase tracking-wider">Duration</div>
                                                    <div className="font-bold text-sm text-white">{exam.duration}m</div>
                                                </div>
                                                <div className="bg-[rgba(255,255,255,0.04)] rounded-2xl px-3 py-2">
                                                    <div className="uppercase tracking-wider">Marks</div>
                                                    <div className="font-bold text-sm text-white">{exam.totalMarks}</div>
                                                </div>
                                                <div className="bg-[rgba(255,255,255,0.04)] rounded-2xl px-3 py-2">
                                                    <div className="uppercase tracking-wider">Status</div>
                                                    <div className="font-bold text-sm text-white capitalize">{exam.status}</div>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                {attempted && examResult ? (
                                                    <div className="text-sm text-[var(--text-secondary)]">
                                                        Last score: <span className="font-semibold text-white">{examResult.score}/{examResult.totalMarks}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-[var(--text-secondary)]">
                                                        Ready to start when you are.
                                                    </div>
                                                )}

                                                <Link
                                                    to={attempted ? '/student/results' : `/student/exam/${exam.id}`}
                                                    className={`btn ${attempted ? 'btn-secondary' : 'btn-primary'} w-full sm:w-auto`}
                                                >
                                                    {attempted ? 'View Result' : 'Start Exam'}
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6 min-w-0">
                        <div className="border rounded-[20px] bg-[var(--bg-secondary)] border-[var(--border)] p-6">
                            <h2 className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-3">
                                Progress snapshot
                            </h2>
                            <div className="grid gap-3 min-w-0">
                                <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] p-4 min-w-0">
                                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">My progress</div>
                                    <div className="text-2xl sm:text-3xl font-['Syne',sans-serif] font-extrabold text-white truncate">
                                        {attemptedCount ? `${Math.round((passedCount / attemptedCount) * 100)}%` : '—'}
                                    </div>
                                    <p className="text-[var(--text-secondary)] text-sm mt-2 min-w-0 break-words">
                                        {attemptedCount ? `${passedCount} passed of ${attemptedCount} attempt${attemptedCount === 1 ? '' : 's'}` : 'No attempts yet.'}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] p-4 min-w-0">
                                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Latest activity</div>
                                    {latestResult && latestExam ? (
                                        <>
                                            <div className="text-sm text-white font-semibold truncate">{latestExam.title}</div>
                                            <div className="text-[var(--text-secondary)] text-sm mt-1 break-words">Scored {latestResult.score}/{latestResult.totalMarks}</div>
                                            <div className="text-[var(--text-secondary)] text-xs mt-3">{new Date(latestResult.submittedAt).toLocaleDateString()}</div>
                                        </>
                                    ) : (
                                        <p className="text-[var(--text-secondary)] text-sm">No recent exam activity yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border rounded-[20px] bg-[var(--bg-secondary)] border-[var(--border)] p-6">
                            <h2 className="text-sm uppercase tracking-wider text-[var(--text-muted)] mb-3">
                                Quick links
                            </h2>
                            <div className="flex flex-col gap-3">
                                <Link to="/student/results" className="btn btn-primary w-full text-center">
                                    Review results
                                </Link>
                                <Link to="/student" className="btn btn-secondary w-full text-center">
                                    Refresh dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}