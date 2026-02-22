import React from 'react'

interface CalloutProps {
    children: React.ReactNode
    type?: 'info' | 'warning' | 'success' | 'danger'
    title?: string
}

export function Callout({ children, type = 'info', title }: CalloutProps) {
    const types = {
        info: 'border-blue-500 bg-blue-500/10 text-blue-900',
        warning: 'border-yellow-500 bg-yellow-500/10 text-yellow-900',
        success: 'border-green-500 bg-green-500/10 text-green-900',
        danger: 'border-red-500 bg-red-500/10 text-red-900',
    }

    // Fallback to swaddle theme if preferred, but since it's a premium blog, using some subtle colors can be nice.
    // Alternatively, using the minimal swaddle theme:
    const minimalStyle = 'border-swaddle-ink bg-swaddle-ink/5 text-swaddle-ink'

    return (
        <div className={`my-8 flex border-l-4 p-6 ${minimalStyle}`}>
            <div className="flex-1">
                {title && <h4 className="m-0 mb-2 font-sans font-bold text-lg">{title}</h4>}
                <div className="font-sans text-lg leading-relaxed">{children}</div>
            </div>
        </div>
    )
}
