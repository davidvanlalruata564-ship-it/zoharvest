import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[React Error Boundary caught an error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    localStorage.removeItem('zh_token');
    localStorage.removeItem('zh_user');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-stone-900">Something went wrong</h2>
              <p className="text-xs text-stone-500">
                The application encountered an unexpected display issue. Your data and account are safe.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-stone-100 p-3 rounded-xl text-left font-mono text-[11px] text-red-700 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-stone-200 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset Session</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
