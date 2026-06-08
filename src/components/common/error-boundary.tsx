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
          <div className="card">
            <h2 className="text-3xl font-bold">
              Something went wrong.
            </h2>

            <p className="text-gray-400 mt-3">
              Please refresh the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
