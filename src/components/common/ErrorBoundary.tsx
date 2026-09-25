import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ALMAS-SHOP Runtime Exception caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetToHome = () => {
    window.location.href = '/';
  };

  private handleClearDataAndRestart = () => {
    if (window.confirm('Isto redefinirá os dados salvos localmente e recarregará a aplicação. Deseja continuar?')) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F8F8] text-[#0F0F0F] flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-3 text-amber-500 mb-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#0F0F0F]">Ops! Ocorreu uma interrupção</h2>
                <p className="text-xs text-gray-500">Sistema de recuperação activa ALMAS-SHOP</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
              O aplicativo interceptou um erro de execução para evitar tela branca. Os seus dados e compras não foram perdidos.
            </p>

            {this.state.error && (
              <div className="bg-[#F8F8F8] border border-gray-200 rounded-2xl p-3.5 text-xs text-rose-700 font-mono mb-6 overflow-x-auto max-h-40">
                <p className="font-bold text-rose-800 mb-1">{this.state.error.name}: {this.state.error.message}</p>
                {this.state.error.stack && (
                  <pre className="text-[11px] text-gray-500 whitespace-pre-wrap">{this.state.error.stack.split('\n').slice(0, 4).join('\n')}</pre>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-white font-black py-3 px-4 rounded-xl transition shadow-md text-xs sm:text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Recarregar Página
              </button>
              <button
                onClick={this.handleResetToHome}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#0F0F0F] font-bold py-3 px-4 rounded-xl transition border border-gray-200 text-xs sm:text-sm"
              >
                <Home className="w-4 h-4" />
                Voltar ao Início
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <button
                onClick={this.handleClearDataAndRestart}
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-600 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar dados padrão e reiniciar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
