import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const normalizeUser = (user) => {
    if (!user) return null;
    return {
        ...user,
        id: user.id || user._id,
    };
};

export function AppProvider({ children }) {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? normalizeUser(JSON.parse(saved)) : null;
    });

    const [users, setUsers] = useState([]);
    const [exams, setExams] = useState([]);
    const [results, setResults] = useState([]);

    // Fetch users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            if (!currentUser?.token) return;

            try {
                const response = await fetch(`${API_BASE}/users`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [currentUser, API_BASE]);

    // Fetch exams from backend
    useEffect(() => {
        const fetchExams = async () => {
            if (!currentUser?.token) return;

            try {
                const response = await fetch(`${API_BASE}/exams`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setExams(data.map(exam => ({
                        id: exam._id,
                        title: exam.title,
                        description: exam.description,
                        subject: exam.subject,
                        status: exam.status,
                        totalQuestions: exam.questions?.length || 0,
                        duration: exam.duration,
                        totalMarks: exam.totalMarks,
                        passingMarks: exam.passingMarks,
                        instructions: exam.instructions,
                        questions: exam.questions,
                        createdBy: exam.createdBy,
                    })));
                }
            } catch (error) {
                console.error('Error fetching exams:', error);
            }
        };

        fetchExams();
    }, [currentUser, API_BASE]);

    // Fetch results from backend
    useEffect(() => {
        const fetchResults = async () => {
            if (!currentUser?.token) return;

            try {
                const response = await fetch(`${API_BASE}/results`, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setResults(data.map(result => ({
                        id: result._id,
                        userId: result.studentId,
                        userName: result.studentName,
                        examId: result.examId,
                        score: result.score,
                        totalMarks: result.totalMarks,
                        percentage: result.percentage,
                        passed: result.passed,
                        submittedAt: result.submittedAt,
                        timeTaken: result.timeTaken,
                        answers: result.answers,
                        breakdown: result.breakdown || [],
                    })));
                }
            } catch (error) {
                console.error('Error fetching results:', error);
            }
        };

        fetchResults();
    }, [currentUser, API_BASE]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const user = normalizeUser(await response.json());
                setCurrentUser(user);
                return { success: true, user };
            } else {
                const error = await response.json();
                return { success: false, error: error.message || 'Login failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const registerStudent = async (name, email, password) => {
        try {
            const response = await fetch(`${API_BASE}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role: 'student' }),
            });

            if (response.ok) {
                const user = normalizeUser(await response.json());
                setCurrentUser(user);
                return { success: true, user };
            } else {
                const error = await response.json();
                return { success: false, error: error.message || 'Registration failed' };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const hasAttempted = (examId) => {
        return results.some(r => r.userId === currentUser?.id && String(r.examId) === String(examId));
    };

    const getExamResult = (examId) => {
        return results.find(r => r.userId === currentUser?.id && String(r.examId) === String(examId));
    };

    const createExam = async (form) => {
        try {
            const response = await fetch(`${API_BASE}/exams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const newExam = await response.json();
                setExams(prev => [...prev, {
                    id: newExam._id,
                    title: newExam.title,
                    description: newExam.description,
                    subject: newExam.subject,
                    status: newExam.status,
                    totalQuestions: newExam.questions?.length || 0,
                    duration: newExam.duration,
                    totalMarks: newExam.totalMarks,
                    passingMarks: newExam.passingMarks,
                    instructions: newExam.instructions,
                    questions: newExam.questions,
                    createdBy: newExam.createdBy,
                }]);
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const deleteExam = async (examId) => {
        try {
            const response = await fetch(`${API_BASE}/exams/${examId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`,
                },
            });

            if (response.ok) {
                setExams(prev => prev.filter(e => e.id !== examId));
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const publishExam = async (examId) => {
        try {
            const response = await fetch(`${API_BASE}/exams/${examId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify({ status: 'published' }),
            });

            if (response.ok) {
                setExams(prev => prev.map(e => e.id === examId ? { ...e, status: 'published' } : e));
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const updateExam = async (examId, data) => {
        try {
            const response = await fetch(`${API_BASE}/exams/${examId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const updatedExam = await response.json();
                setExams(prev => prev.map(e => e.id === examId ? {
                    ...e,
                    ...data,
                    totalQuestions: updatedExam.questions?.length || e.totalQuestions,
                    totalMarks: updatedExam.totalMarks || e.totalMarks,
                } : e));
                return { success: true };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const addQuestion = async (examId, question) => {
        const exam = exams.find(e => e.id === examId);
        if (!exam) return;

        const normalizedQuestion = {
            id: question.id || String(Date.now()),
            question: question.text ?? question.question,
            type: question.type || 'multiple-choice',
            options: question.options || [],
            correctAnswer: question.correct !== undefined ? question.options[question.correct] : question.correctAnswer,
            marks: Number(question.marks) || 1,
            explanation: question.explanation || '',
            timeLimit: question.timeLimit ? Number(question.timeLimit) : undefined,
            difficulty: question.difficulty || 'medium',
        };

        const updatedQuestions = [...(exam.questions || []), normalizedQuestion];
        const updatedData = {
            questions: updatedQuestions,
            totalMarks: updatedQuestions.reduce((sum, q) => sum + Number(q.marks || 1), 0),
        };

        const result = await updateExam(examId, updatedData);
        return result;
    };

    const deleteQuestion = async (examId, questionId) => {
        const exam = exams.find(e => e.id === examId);
        if (!exam) return;

        const updatedQuestions = (exam.questions || []).filter(q => q.id !== questionId);
        const updatedData = {
            questions: updatedQuestions,
            totalMarks: updatedQuestions.reduce((sum, q) => sum + Number(q.marks || 1), 0),
        };

        const result = await updateExam(examId, updatedData);
        return result;
    };

    const submitExam = async (examId, answers, timeTaken) => {
        const exam = exams.find(e => e.id === examId);
        if (!exam) return;

        let score = 0;
        const breakdown = [];

        exam.questions?.forEach((q, i) => {
            const selectedIndex = answers[i];
            const correctIndex = q.options.indexOf(q.correctAnswer);
            const isCorrect = selectedIndex === correctIndex;

            if (isCorrect) score += Number(q.marks || 1);

            breakdown.push({
                correct: correctIndex,
                selected: selectedIndex !== undefined ? selectedIndex : null,
                isCorrect,
            });
        });

        const percentage = Math.round((score / (exam.totalMarks || 1)) * 100);
        const newResult = {
            id: String(Date.now()),
            userId: currentUser?.id,
            userName: currentUser?.name,
            examId,
            score,
            totalMarks: exam.totalMarks,
            percentage,
            passed: score >= exam.passingMarks,
            timeTaken,
            submittedAt: new Date().toISOString(),
            answers,
            breakdown,
        };

        setResults((prev) => [...prev, newResult]);

        try {
            const response = await fetch(`${API_BASE}/results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`,
                },
                body: JSON.stringify({
                    studentId: String(currentUser?.id),
                    studentName: currentUser?.name,
                    examId: String(examId),
                    examTitle: exam.title,
                    score,
                    totalMarks: exam.totalMarks,
                    percentage,
                    passed: score >= exam.passingMarks,
                    timeTaken,
                    submittedAt: newResult.submittedAt,
                    answers,
                    breakdown,
                }),
            });

            if (!response.ok) {
                console.error('Failed to save result to backend:', response.statusText);
                return;
            }

            const savedResult = await response.json();
            setResults((prev) =>
                prev.map((item) =>
                    item.id === newResult.id
                        ? {
                            ...item,
                            id: savedResult._id,
                            backendId: savedResult._id,
                        }
                        : item,
                ),
            );
        } catch (error) {
            console.error('Unexpected error saving result:', error);
        }
    };

    const getLeaderboard = (examId) => {
        const examResults = results.filter(r => String(r.examId) === String(examId));
        return examResults.sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken).map((r, i) => ({ ...r, rank: i + 1 }));
    };

    return (
        <AppContext.Provider
            value={{
                currentUser,
                login,
                registerStudent,
                logout,
                users,
                exams,
                results,
                hasAttempted,
                getExamResult,
                createExam,
                deleteExam,
                publishExam,
                updateExam,
                addQuestion,
                deleteQuestion,
                submitExam,
                getLeaderboard
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
