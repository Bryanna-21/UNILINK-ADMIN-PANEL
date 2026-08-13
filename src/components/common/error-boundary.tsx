"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary
  extends React.Component<
    Props,
    State
  > {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: any
  ) {
    console.error(error);
  }

  render() {
    if (
      this.state.hasError
    ) {
      return (
        <div className="p-10">
          <div className="card p-8">
            <h2 className="text-2xl font-display font-semibold text-ink">
              Something went wrong.
            </h2>

            <p className="text-ink-muted mt-3">
              Please refresh the page. If this keeps happening, the backend may be unreachable.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
