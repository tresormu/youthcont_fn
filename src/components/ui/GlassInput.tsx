import React from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export function GlassInput({ label, icon, error, className, ...props }: GlassInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-primary/50 ml-1">{label}</label>
      <div className={`group relative flex items-center rounded-2xl border bg-white transition-all duration-300
        ${error ? 'border-destructive/50 focus-within:border-destructive' : 'border-border focus-within:border-accent/60 focus-within:shadow-[0_0_0_4px_hsl(196_100%_45%/0.08)]'}
        ${className || ''}`}
      >
        {icon && (
          <div className="pl-4 text-primary/30 group-focus-within:text-accent transition-colors shrink-0">
            {icon}
          </div>
        )}
        <input
          className="w-full bg-transparent px-4 py-4 text-sm font-bold text-primary outline-none placeholder:text-primary/20"
          {...props}
        />
      </div>
      {error && <p className="text-xs font-bold text-destructive ml-1">{error}</p>}
    </div>
  );
}
