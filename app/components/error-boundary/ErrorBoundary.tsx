"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import styles from "./ErrorBoundary.module.css";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
    // TODO: Log to error reporting service in production
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Allow custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.heading}>Something went wrong</h1>
            <p className={styles.message}>
              We apologize for the inconvenience. Please try reloading the page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className={styles.errorDetails}>
                <p className={styles.errorName}>{this.state.error.name}</p>
                <p className={styles.errorMessage}>
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button
              onClick={this.handleReload}
              variant="default"
              size="lg"
              className={styles.button}
            >
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
