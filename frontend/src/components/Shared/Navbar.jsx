import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Navbar({ links = [] }) {
    const { currentUser, logout } = useApp();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-[100] bg-[#0a0e1a]/90 backdrop-blur-md border-b border-[var(--border)]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center gap-4 md:gap-8">
                <Link to="/" className="flex items-center gap-2 md:gap-3 no-underline shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-[10px] bg-gradient-to-br from-[#4f8dff] to-[#00e5c8] flex items-center justify-center text-sm font-['Syne',sans-serif] font-extrabold text-white">TNS</div>
                    <div className="hidden sm:block">
                        <div className="font-['Syne',sans-serif] font-bold text-base text-[var(--text-primary)] leading-[1.2]">Tech N Skill</div>
                        <div className="text-[11px] text-[var(--text-muted)]">Exam Portal</div>
                    </div>
                </Link>

                <div className="flex gap-1 md:gap-4 flex-1">
                    {links.map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${location.pathname === l.to || location.pathname.startsWith(l.to + '/') ? 'bg-[rgba(79,141,255,0.12)] text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-white'}`}
                        >
                            {l.icon && <span>{l.icon}</span>}
                            <span className="hidden sm:inline">{l.label}</span>
                        </Link>
                    ))}
                </div>

                {currentUser && (
                    <div className="flex items-center gap-2.5 ml-auto">
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#4f8dff] to-[#00e5c8] flex items-center justify-center font-['Syne',sans-serif] font-bold text-[15px] text-white shrink-0">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden md:block">
                            <div className="text-sm font-semibold text-[var(--text-primary)] leading-[1.2]">{currentUser?.name}</div>
                            <div className="text-[11px] text-[var(--text-muted)] capitalize">{currentUser?.role}</div>
                        </div>
                        <button onClick={handleLogout} className="bg-transparent border border-[var(--border)] rounded-lg text-[var(--text-secondary)] cursor-pointer w-8 h-8 md:w-[34px] md:h-[34px] flex items-center justify-center text-base transition-all duration-150 ml-1 hover:bg-[var(--border)] hover:text-white" title="Logout">
                            ⏻
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
