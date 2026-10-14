import { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import './toast.styles.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((text, { type = 'success', duration = 3000 } = {}) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, text, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration)
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {createPortal(
                <div className='toast-container' aria-live='polite'>
                    {toasts.map(t => (
                        <div key={t.id} className={`toast toast-${t.type}`} role='status'>
                            {t.text}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used inside a ToastProvider');
    return context;
}