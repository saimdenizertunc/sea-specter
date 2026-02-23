'use client'

import React from 'react'

interface MdxErrorBoundaryProps {
  children: React.ReactNode
}

interface MdxErrorBoundaryState {
  hasError: boolean
}

export class MdxErrorBoundary extends React.Component<MdxErrorBoundaryProps, MdxErrorBoundaryState> {
  constructor(props: MdxErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): MdxErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('MDX render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-10 border border-swaddle-ink/20 bg-swaddle-ink/5 p-6 font-sans text-swaddle-ink/80">
          This section could not be rendered.
        </div>
      )
    }

    return this.props.children
  }
}
