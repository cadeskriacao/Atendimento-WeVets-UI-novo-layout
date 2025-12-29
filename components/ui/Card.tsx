import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
    className = '',
    padding = 'md',
    children,
    ...props
}) => {
    const paddings = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 shadow-sm ${paddings[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
