import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100 animate-fade-up">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaExclamationTriangle size={32} />
                        </div>

                        <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">
                            System Malfunction
                        </h1>

                        <p className="text-gray-500 font-medium mb-8">
                            Our intelligence systems encountered an unexpected anomaly. The engineering team has been notified.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={this.handleReset}
                                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
                            >
                                <FaRedo /> Reboot System
                            </button>

                            <a
                                href="/"
                                className="w-full py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-200 transition-all"
                            >
                                <FaHome /> Return to Academy
                            </a>
                        </div>

                        {/* Developer Info - Hidden in Prod usually, but helpful here */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <details className="text-left">
                                <summary className="text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-indigo-500">
                                    Technical Diagnostics
                                </summary>
                                <pre className="mt-4 p-4 bg-gray-900 text-red-400 rounded-xl text-xs overflow-auto max-h-40">
                                    {this.state.error && this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
