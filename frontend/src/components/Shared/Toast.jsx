import React from 'react';

export default function Toast({ message, type }) {
    return (
        <div className={`toast ${type}`}>
            <span style={{ marginRight: 8 }}>
                {type === 'success' ? '✅' : '⚠️'}
            </span>
            {message}
        </div>
    );
}
