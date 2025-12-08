import React, { useState } from 'react';
import { Upload, Settings, FileText, Download, RefreshCw, Image as ImageIcon, AlertCircle, Mail, Lock, User, X, EyeOff, Eye } from 'lucide-react';
import "../../../Css/OmrUpload.css";

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};

        if (mode === 'signup' && formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (mode === 'signup' && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Auth form submitted:', formData);
            onClose();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateForm();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content omr-modal">
                <button
                    onClick={onClose}
                    className="close-button"
                >
                    <X size={20} />
                </button>

                <div className="modal-header omrModalHeader">
                    <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>
                        {mode === 'login'
                            ? 'Sign in to access your OMR scanner'
                            : 'Join us to start scanning OMR sheets'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === 'signup' && (
                        <div className="input-group">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={`auth-input ${errors.name && touched.name ? 'error' : ''}`}
                            />
                            {touched.name && errors.name && (
                                <p className="error-message">{errors.name}</p>
                            )}
                        </div>
                    )}

                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`auth-input ${errors.email && touched.email ? 'error' : ''}`}
                        />
                        {touched.email && errors.email && (
                            <p className="error-message">{errors.email}</p>
                        )}
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`auth-input ${errors.password && touched.password ? 'error' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-toggle"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        {touched.password && errors.password && (
                            <p className="error-message">{errors.password}</p>
                        )}
                    </div>

                    <button type="submit" className="submit-button omrButton">
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-switch">
                    {mode === 'login' ? (
                        <>
                            Don't have an account?{' '}
                            <button onClick={() => setMode('signup')} className="switch-button">
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button onClick={() => setMode('login')} className="switch-button">
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const OmrUpload1 = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState('upload');
    const [scanResults, setScanResults] = useState(null);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const mockResults = {
        totalQuestions: 50,
        responses: Array(50).fill(null).map((_, i) => ({
            question: i + 1,
            selected: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
        }))
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
            return;
        }
        setError(null);
        setCurrentStep('processing');
        setTimeout(() => {
            setScanResults(mockResults);
            setCurrentStep('results');
        }, 1500);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    return (

        <>
            <div className="container-fluid">
                <div
                    className="card m-3"
                    style={{ boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)" }}
                >
                    <div className='card-header'>
                        <h4 className="card-title fw-bold">OMR Response Scanner</h4>
                    </div>
                    <div className="card-body">
                        <div className="omr-scanner">
                            <div className="scanner-header">
                                <div className="flex justify-between items-center">
                                    <div>
                                        {/* <h1>OMR Response Scanner</h1> */}
                                        <p>Quick and accurate detection of selected options</p>
                                    </div>
                                    {!isLoggedIn && (
                                        <button
                                            onClick={() => setIsAuthModalOpen(true)}
                                            className="upload-button"
                                        >
                                            Sign In
                                        </button>
                                    )}
                                    {isLoggedIn && (
                                        <button
                                            onClick={() => setIsLoggedIn(false)}
                                            className="upload-button"
                                        >
                                            Sign Out
                                        </button>
                                    )}
                                </div>
                            </div>

                            <AuthModal
                                isOpen={isAuthModalOpen}
                                onClose={() => setIsAuthModalOpen(false)}
                                initialMode="login"
                            />

                            <div className="progress-steps">
                                <div className={`step ${currentStep === 'upload' ? 'active' : ''} ${currentStep !== 'upload' ? 'completed' : ''}`}>
                                    <div className="step-icon">
                                        <Upload size={24} />
                                    </div>
                                    <span>Upload</span>
                                </div>
                                <div className={`step ${currentStep === 'processing' ? 'active' : ''} ${currentStep === 'results' ? 'completed' : ''}`}>
                                    <div className="step-icon">
                                        <Settings size={24} />
                                    </div>
                                    <span>Process</span>
                                </div>
                                <div className={`step ${currentStep === 'results' ? 'active' : ''}`}>
                                    <div className="step-icon">
                                        <FileText size={24} />
                                    </div>
                                    <span>Results</span>
                                </div>
                            </div>

                            <div className="scanner-content">
                                {currentStep === 'upload' && (
                                    <div className={`upload-area ${isDragging ? 'dragging' : ''}`}>
                                        <form
                                            onSubmit={handleFileUpload}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        >
                                            <div className="upload-icon">
                                                <ImageIcon size={48} />
                                            </div>
                                            <h3>Upload OMR Sheet</h3>
                                            <p>Drag and drop your OMR sheet here, or click to browse</p>
                                            <input type="file" className="file-input" accept="image/*" />
                                            <button type="submit" className="upload-button">
                                                <Upload size={20} />
                                                Upload and Process
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {currentStep === 'processing' && (
                                    <div className="processing-screen">
                                        <Settings className="processing-icon" size={48} />
                                        <h3>Processing your OMR sheet</h3>
                                        <p>Detecting selected options...</p>
                                        <div className="progress-bar">
                                            <div className="progress-fill"></div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 'results' && scanResults && (
                                    <div className="results-container">
                                        <div className="results-card">
                                            <div className="results-header">
                                                <h2>Detected Responses</h2>
                                                <p>All selected options from the OMR sheet</p>
                                            </div>
                                            <div className="responses-grid">
                                                {scanResults.responses.map((response) => (
                                                    <div key={response.question} className="response-item">
                                                        <span className="question-number">Q{response.question}</span>
                                                        <span className="selected-option">{response.selected}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="action-buttons">
                                            <button className="action-button primary">
                                                <Download size={20} />
                                                Export CSV
                                            </button>
                                            <button
                                                className="action-button secondary"
                                                onClick={() => setCurrentStep('upload')}
                                            >
                                                <RefreshCw size={20} />
                                                Scan Another
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="error-message">
                                        <AlertCircle size={20} />
                                        <p>{error}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default OmrUpload1;