import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Render error:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
        <p className="font-mono text-6xl font-extrabold gradient-text">Oops</p>
        <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 max-w-md text-slate-500">
          An unexpected error occurred while rendering this page. Try reloading — if it keeps
          happening, please come back a little later.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-primary mt-6"
        >
          Reload page
        </button>
      </div>
    );
  }
}
