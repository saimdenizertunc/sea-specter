import type { Metadata } from 'next'
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
    title: 'Sign Up',
    robots: {
        index: false,
        follow: false,
    },
}

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <SignUp fallbackRedirectUrl="/admin" />
        </div>
    );
}
