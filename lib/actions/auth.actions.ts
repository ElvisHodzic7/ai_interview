"use server";

import { db, auth } from "@/firebase/admin";

import { cookies } from "next/headers";

const SEDMICA = 60 * 60 * 24 * 7;
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if (userRecord.exists) {
            return {
                success: false,
                message: 'Korisnik već postoji. Molimo prijavite se.'
            }
        };

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: 'Nalog uspješno kreiran. Molimo da se prijavite'
        }

    } catch (e: any) {
        console.log('Greška pri registraciji korisnika', e);

        if (e.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'Navedena E-mail adresa se već koristi.'
            }
        }

        return {
            success: false,
            message: 'Neuspješna registracija'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SEDMICA * 1000,

    })

    cookieStore.set('session', sessionCookie, {
        maxAge: SEDMICA * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })

}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: 'Korisnik ne postoji. Molimo registrujte Vaš nalog'
            }
        }

        await setSessionCookie(idToken);
    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: 'Neuspješna prijava.'
        }
    }

}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.
            collection('users')
            .doc(decodedClaims.uid)
            .get();

        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User

    } catch (e) {
        console.log(e)

        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;

}