'use server';

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function authenticate(prevState, formData) {
    try {
        await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        });
    } catch (error) {
        // Log the error for debugging
        console.error("Auth Error:", error);

        if (error.type === 'CredentialsSignin' || error.message.includes('CredentialsSignin')) {
            return 'Invalid credentials';
        }
        throw error;
    }

    // Redirect to items page after successful login
    redirect('/items');
}
