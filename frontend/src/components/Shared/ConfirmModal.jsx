import React from 'react';

export default function ConfirmModal({
    open,
    title = 'Confirm action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}) {
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}>
            <div className="modal" style={{ maxWidth: 520 }}>
                <h2 className="modal-title">{title}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>{message}</p>
                <div className="flex justify-end gap-3">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>{cancelText}</button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}
