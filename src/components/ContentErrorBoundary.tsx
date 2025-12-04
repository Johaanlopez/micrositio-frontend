import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ContentErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // In real app: log to external service
    // console.error('Content boundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;
      return (
        <div className="p-6 bg-white dark:bg-gray-800 border rounded">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Contenido no disponible</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">No se pudo cargar este contenido. Intenta recargar o vuelve más tarde.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ContentErrorBoundary;
