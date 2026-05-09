import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const FEATURES = ['Timed Exams', 'Auto Grading', 'Live Rankings', 'Result Analysis'];

export default function LoginPage() {
    const { login, registerStudent, currentUser } = useApp();
    const navigate = useNavigate();
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    if (currentUser) {
        navigate(currentUser.role === 'admin' ? '/admin' : '/student');
        return null;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await login(form.email, form.password);
        if (res.success) {
            navigate(res.user.role === 'admin' ? '/admin' : '/student');
        } else {
            setError(res.error);
        }

        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const res = await registerStudent(form.name, form.email, form.password);
        if (res.success) {
            setTab('login');
            setForm({ name: '', email: form.email, password: '' });
        } else {
            setError(res.error);
        }

        setLoading(false);
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
        .tns-input { display:block;width:100%;background:#0e1829;border:1px solid #1f2937;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:14px;color:#f0f4ff;outline:none;transition:all 0.2s;box-sizing:border-box; }
        .tns-input::placeholder { color:#2a3a52; }
        .tns-input:focus { border-color:rgba(79,141,255,0.55);background:#0c1624;box-shadow:0 0 0 3px rgba(79,141,255,0.10); }
        .tns-demo-row:hover { background:rgba(79,141,255,0.06) !important; }
        .tns-submit:hover { box-shadow:0 6px 28px rgba(79,141,255,0.5) !important;transform:translateY(-1px) !important; }
        .tns-submit:disabled { opacity:0.6;cursor:not-allowed;transform:none !important; }
        .tns-tab-btn:hover { color:#7a9bbf !important; }
        @keyframes tns-spin { to { transform:rotate(360deg) } }
        @media (max-width: 800px) {
          .tns-page { flex-direction:column !important; }
          .tns-left { min-height:320px !important;padding:40px 24px !important;order:2 !important; }
          .tns-right { width:100% !important;border-left:none !important;border-bottom:1px solid rgba(255,255,255,0.05) !important;order:1 !important;padding:32px 20px !important; }
          .tns-headline { font-size:38px !important; }
          .tns-stat-row { display:none !important; }
        }
      `}</style>

            <div className="tns-page" style={S.page}>

                {/* ─── LEFT ─── */}
                <div className="tns-left" style={S.left}>
                    <div style={S.leftGrid} />
                    <div style={{ ...S.orb, top: -100, right: -80, width: 480, height: 480, background: 'radial-gradient(circle,rgba(79,141,255,0.15) 0%,transparent 65%)' }} />
                    <div style={{ ...S.orb, bottom: -80, left: -60, width: 360, height: 360, background: 'radial-gradient(circle,rgba(0,229,200,0.10) 0%,transparent 65%)' }} />

                    <div style={S.leftContent}>
                        <div style={S.brandRow}>
                            <div style={S.logo}>TNS</div>
                            <div>
                                <div style={S.brandLabel}>Tech N Skill</div>
                                <div style={S.brandSub}>Institute Portal</div>
                            </div>
                        </div>

                        <div className="tns-headline" style={S.headline}>
                            Exam<br />
                            <span style={S.headlineAccent}>Portal.</span>
                        </div>

                        <p style={S.tagline}>
                            Conduct, manage and analyse institute examinations — all in one place.
                        </p>

                        <div style={S.featureList}>
                            {FEATURES.map(f => (
                                <div key={f} style={S.featureItem}>
                                    <div style={S.featureTick}>
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <path d="M1.5 5l2 2 5-4" stroke="#4f8dff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span style={S.featureLabel}>{f}</span>
                                </div>
                            ))}
                        </div>

                        <div className="tns-stat-row" style={S.statRow}>
                            {[['3.6M+', 'Servers Trusted'], ['100%', 'Free Forever'], ['SSL', 'Secured']].map(([val, lbl]) => (
                                <div key={lbl} style={S.statPill}>
                                    <span style={S.statVal}>{val}</span>
                                    <span style={S.statLbl}>{lbl}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── RIGHT ─── */}
                <div className="tns-right" style={S.right}>
                    <div style={S.formBox}>

                        {/* Tabs */}
                        <div style={S.tabBar}>
                            {['login', 'register'].map(t => (
                                <button key={t} className="tns-tab-btn" onClick={() => { setTab(t); setError(''); }}
                                    style={{ ...S.tabBtn, ...(tab === t ? S.tabActive : {}) }}>
                                    {t === 'login' ? 'Sign In' : 'Register'}
                                </button>
                            ))}
                        </div>

                        {/* Heading */}
                        <div style={{ marginBottom: 28 }}>
                            <h2 style={S.formTitle}>{tab === 'login' ? 'Welcome back' : 'Create account'}</h2>
                            <p style={S.formSub}>{tab === 'login' ? 'Sign in to access your exam dashboard' : 'Register as a student to get started'}</p>
                        </div>

                        {tab === 'login' ? (
                            <form onSubmit={handleLogin}>
                                <Fld label="Email Address">
                                    <Inp type="email" placeholder="you@example.com" icon={<EmailIco />}
                                        value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                                </Fld>
                                <Fld label="Password">
                                    <Inp type={showPass ? 'text' : 'password'} placeholder="Enter your password" icon={<LockIco />}
                                        value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required
                                        suffix={<EyeBtn show={showPass} toggle={() => setShowPass(v => !v)} />} />
                                </Fld>
                                {error && <ErrBox msg={error} />}
                                <SubBtn loading={loading} label="Sign In" loadingLabel="Signing in…" />

                                <div style={S.demoBox}>
                                    <div style={S.demoHeader}>Demo Credentials</div>
                                    <div style={{ padding: '6px 8px' }}>
                                        {[
                                            { role: 'Admin', email: 'admin@technnskill.com', pass: 'admin123', color: '#ffc107' },
                                            { role: 'Student', email: 'rahul@student.com', pass: 'student123', color: '#00e5c8' },
                                        ].map(c => (
                                            <button key={c.role} type="button" className="tns-demo-row"
                                                onClick={() => setForm(p => ({ ...p, email: c.email, password: c.pass }))}
                                                style={S.demoRow}>
                                                <span style={{ ...S.demoRolePill, background: c.color + '22', color: c.color }}>{c.role}</span>
                                                <span style={S.demoText}>{c.email} · {c.pass}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister}>
                                <Fld label="Full Name">
                                    <Inp type="text" placeholder="Your full name" icon={<UserIco />}
                                        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                                </Fld>
                                <Fld label="Email Address">
                                    <Inp type="email" placeholder="you@example.com" icon={<EmailIco />}
                                        value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                                </Fld>
                                <Fld label="Password">
                                    <Inp type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" icon={<LockIco />}
                                        value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} minLength={6} required
                                        suffix={<EyeBtn show={showPass} toggle={() => setShowPass(v => !v)} />} />
                                </Fld>
                                {error && <ErrBox msg={error} />}
                                <SubBtn loading={loading} label="Create Account" loadingLabel="Creating…" />
                                <p style={{ fontSize: 11, color: '#2a3a52', textAlign: 'center', marginTop: 10 }}>
                                    By registering you agree to our terms of service.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ─── Helper components ─── */
function Fld({ label, children }) {
    return <div style={{ marginBottom: 16 }}><label style={S.fldLbl}>{label}</label><div style={{ marginTop: 6 }}>{children}</div></div>;
}
function Inp({ icon, suffix, ...props }) {
    const [f, setF] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            {icon && <div style={S.icoL}>{icon}</div>}
            <input className="tns-input" {...props} onFocus={() => setF(true)} onBlur={() => setF(false)}
                style={{ padding: `12px ${suffix ? 42 : 14}px 12px ${icon ? 40 : 14}px`, borderColor: f ? 'rgba(79,141,255,0.55)' : '#1f2937', background: f ? '#0c1624' : '#0e1829', boxShadow: f ? '0 0 0 3px rgba(79,141,255,0.1)' : 'none' }} />
            {suffix && <div style={S.icoR}>{suffix}</div>}
        </div>
    );
}
function EyeBtn({ show, toggle }) {
    return <button type="button" onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', color: '#3a4e6a' }}>{show ? <EyeOffIco /> : <EyeIco />}</button>;
}
function ErrBox({ msg }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, marginBottom: 14, background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', color: '#ff4d6d', fontSize: 13 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6" stroke="#ff4d6d" strokeWidth="1.5" /><path d="M7 4v3.5M7 9.5v.5" stroke="#ff4d6d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {msg}
        </div>
    );
}
function SubBtn({ loading, label, loadingLabel }) {
    return (
        <button type="submit" disabled={loading} className="tns-submit"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '13px', border: 'none', borderRadius: 11, background: 'linear-gradient(135deg,#4f8dff,#3b7aff)', color: '#fff', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(79,141,255,0.35)', marginBottom: 6 }}>
            {loading
                ? <><svg style={{ animation: 'tns-spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" /><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>{loadingLabel}</>
                : <>{label}<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></>}
        </button>
    );
}

/* ─── Icons ─── */
const EmailIco = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="2" stroke="#3a4e6a" strokeWidth="1.3" /><path d="M1 5l6 4 6-4" stroke="#3a4e6a" strokeWidth="1.3" strokeLinecap="round" /></svg>;
const LockIco = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="2" stroke="#3a4e6a" strokeWidth="1.3" /><path d="M4 6V4.5a3 3 0 0 1 6 0V6" stroke="#3a4e6a" strokeWidth="1.3" strokeLinecap="round" /><circle cx="7" cy="9.5" r="1" fill="#3a4e6a" /></svg>;
const UserIco = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="#3a4e6a" strokeWidth="1.3" /><path d="M1.5 12.5c0-2.5 2.5-4.5 5.5-4.5s5.5 2 5.5 4.5" stroke="#3a4e6a" strokeWidth="1.3" strokeLinecap="round" /></svg>;
const EyeIco = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7C2.5 4 5 2 7 2s4.5 2 6 5c-1.5 3-4 5-6 5S2.5 10 1 7z" stroke="#3a4e6a" strokeWidth="1.3" /><circle cx="7" cy="7" r="1.8" stroke="#3a4e6a" strokeWidth="1.3" /></svg>;
const EyeOffIco = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M5.5 5.6A1.8 1.8 0 0 0 9 9M3.5 3.7C2 4.7 1.2 5.8 1 7c1.5 3 4 5 6 5 1.2 0 2.5-.5 3.6-1.3M5.5 2.1C6 2 6.5 2 7 2c2 0 4.5 2 6 5-.4.9-.9 1.7-1.5 2.4" stroke="#3a4e6a" strokeWidth="1.3" strokeLinecap="round" /></svg>;

/* ─── Style constants ─── */
const S = {
    page: { display: 'flex', flexDirection: 'row', minHeight: '100vh', background: '#070b14', fontFamily: "'DM Sans',sans-serif" },
    left: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', background: 'linear-gradient(135deg,#0b1528 0%,#0d1f3c 50%,#091428 100%)', overflow: 'hidden', minWidth: 0 },
    leftGrid: { position: 'absolute', inset: 0, opacity: 0.035, backgroundImage: 'linear-gradient(rgba(79,141,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(79,141,255,1) 1px,transparent 1px)', backgroundSize: '72px 72px', pointerEvents: 'none' },
    orb: { position: 'absolute', borderRadius: '50%', pointerEvents: 'none' },
    leftContent: { position: 'relative', zIndex: 1, maxWidth: 380, width: '100%' },
    brandRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 },
    logo: { width: 54, height: 54, borderRadius: 14, background: 'linear-gradient(135deg,#4f8dff,#00e5c8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: '#fff', boxShadow: '0 0 28px rgba(79,141,255,0.45)', flexShrink: 0 },
    brandLabel: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#4f8dff', marginBottom: 2 },
    brandSub: { fontSize: 11, color: '#3a4e6a' },
    headline: { fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 52, lineHeight: 1.0, letterSpacing: '-1px', color: '#f0f4ff', marginBottom: 16 },
    headlineAccent: { background: 'linear-gradient(90deg,#4f8dff,#00e5c8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    tagline: { fontSize: 15, color: '#4a6080', lineHeight: 1.65, maxWidth: 270, marginBottom: 40 },
    featureList: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 },
    featureItem: { display: 'flex', alignItems: 'center', gap: 10 },
    featureTick: { width: 26, height: 26, borderRadius: 7, background: 'rgba(79,141,255,0.1)', border: '1px solid rgba(79,141,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    featureLabel: { color: '#6a8099', fontSize: 14, fontWeight: 500 },
    statRow: { display: 'flex', gap: 10 },
    statPill: { display: 'flex', flexDirection: 'column', padding: '10px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' },
    statVal: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: '#fff' },
    statLbl: { fontSize: 9, color: '#2e4060', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 2 },
    right: { width: 480, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#070b14', borderLeft: '1px solid rgba(255,255,255,0.05)', overflowY: 'auto' },
    formBox: { width: '100%', maxWidth: 380 },
    tabBar: { display: 'flex', gap: 4, padding: 4, background: '#0e1829', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 32 },
    tabBtn: { flex: 1, padding: '10px 0', borderRadius: 11, border: 'none', background: 'transparent', color: '#2a3a52', fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' },
    tabActive: { background: 'linear-gradient(135deg,#4f8dff,#3b7aff)', color: '#fff', boxShadow: '0 4px 16px rgba(79,141,255,0.3)' },
    formTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: '#f0f4ff', margin: '0 0 6px' },
    formSub: { fontSize: 13, color: '#2e4060', margin: 0 },
    fldLbl: { display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#3a4e6a' },
    icoL: { position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' },
    icoR: { position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' },
    demoBox: { marginTop: 20, borderRadius: 14, border: '1px solid rgba(79,141,255,0.12)', background: 'rgba(79,141,255,0.04)', overflow: 'hidden' },
    demoHeader: { padding: '10px 16px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#4f8dff', borderBottom: '1px solid rgba(79,141,255,0.1)' },
    demoRow: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8, textAlign: 'left', transition: 'background 0.15s', boxSizing: 'border-box' },
    demoRolePill: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 20, flexShrink: 0 },
    demoText: { fontSize: 11, color: '#3a4e6a' },
};