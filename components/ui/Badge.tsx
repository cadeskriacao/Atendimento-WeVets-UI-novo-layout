import React from 'react';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
    outline?: boolean;
    className?: string;
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'default',
    outline = false,
    className = '',
    children
}) => {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

    const variants = {
        default: outline ? "border border-primary-200 text-primary-700 bg-primary-50" : "border-transparent bg-primary-100 text-primary-700",
        success: outline ? "border border-emerald-200 text-emerald-700 bg-emerald-50" : "border-transparent bg-emerald-100 text-emerald-700",
        warning: outline ? "border border-amber-200 text-amber-700 bg-amber-50" : "border-transparent bg-amber-100 text-amber-800",
        error: outline ? "border border-red-200 text-red-700 bg-red-50" : "border-transparent bg-red-100 text-red-700",
        info: outline ? "border border-blue-200 text-blue-700 bg-blue-50" : "border-transparent bg-blue-100 text-blue-700",
        neutral: outline ? "border border-gray-200 text-gray-600 bg-gray-100" : "border-transparent bg-gray-100 text-gray-800",
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};
