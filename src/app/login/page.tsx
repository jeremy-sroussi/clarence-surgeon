'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();

        const { error: authError } =
            mode === 'signin'
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        router.push('/agents');
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold tracking-tight">
                        <span className="text-accent-blue">Clarence</span>
                        <span className="text-text-primary">Surgeon</span>
                    </h1>
                    <p className="text-sm text-text-secondary mt-2">
                        {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-1.5">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg bg-bg-panel border border-border text-text-primary text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-blue transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xs font-medium text-text-secondary mb-1.5">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 rounded-lg bg-bg-panel border border-border text-text-primary text-sm placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-blue transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-accent-red bg-accent-red/10 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg text-sm font-medium bg-accent-blue text-white hover:bg-accent-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                        {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-text-secondary">
                    {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        onClick={() => {
                            setMode(mode === 'signin' ? 'signup' : 'signin');
                            setError(null);
                        }}
                        className="text-accent-blue hover:underline cursor-pointer"
                    >
                        {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
}
