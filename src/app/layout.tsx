import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SurgeonLogic — Formalize Clinical Decision-Making with AI',
    description: 'Voice-powered AI agent that helps surgeons formalize and challenge their clinical decision logic.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} antialiased min-h-screen bg-bg-primary text-text-primary`}>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
