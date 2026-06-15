'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { CanvasFallback } from './CanvasFallback';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: !!error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D Canvas Error Caught:', error, errorInfo);
  }

  public componentDidMount() {
    if (typeof window !== 'undefined') {
      // Check global flag for testing
      const win = window as unknown as Record<string, boolean>;
      if (win.__SIMULATE_3D_ERROR__) {
        console.warn('Simulating 3D canvas error via test flag.');
        this.setState({ hasError: true });
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      return <CanvasFallback />;
    }

    return this.props.children;
  }
}

export default CanvasErrorBoundary;
