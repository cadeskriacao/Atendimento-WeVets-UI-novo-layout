import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, leftIcon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        className={`
                            flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium
                            placeholder:text-gray-400 
                            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                            disabled:cursor-not-allowed disabled:opacity-50
                            transition-all
                            h-11
                            ${leftIcon ? 'pl-10' : ''}
                            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
                            ${className}
                        `}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = '', label, error, children, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        {label}
                    </label>
                )}
                <select
                    className={`
                        flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium
                        focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                        disabled:cursor-not-allowed disabled:opacity-50
                        transition-all
                        h-11 cursor-pointer
                        ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
                        ${className}
                    `}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
            </div>
        );
    }
);
Select.displayName = "Select";
