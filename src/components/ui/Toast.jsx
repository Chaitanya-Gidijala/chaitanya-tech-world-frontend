import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="top-end" className="p-3 fixed-top" style={{ zIndex: 50000 }}>
                {toasts.map(toast => (
                    <BootstrapToast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

const BootstrapToast = ({ toast, onClose }) => {
    const variantMap = {
        success: 'success',
        error: 'danger',
        warning: 'warning',
        info: 'info'
    };

    const icons = {
        success: <CheckCircle2 size={18} className="me-2" />,
        error: <XCircle size={18} className="me-2" />,
        warning: <AlertCircle size={18} className="me-2" />,
        info: <Info size={18} className="me-2" />
    };

    const bgVariant = variantMap[toast.type] || 'light';
    const textClass = ['warning', 'info', 'light'].includes(bgVariant) ? 'text-dark' : 'text-white';

    return (
        <Toast
            onClose={onClose}
            show={true}
            delay={3000}
            autohide
            bg={bgVariant}
            className="mb-2 border-0 shadow-sm"
        >
            <Toast.Header closeButton={true} className="border-bottom-0 pb-1">
                {icons[toast.type]}
                <strong className="me-auto text-capitalize">{toast.type}</strong>
            </Toast.Header>
            <Toast.Body className={bgVariant === 'light' ? '' : 'text-white pt-0'}>
                {toast.message}
            </Toast.Body>
        </Toast>
    );
};
