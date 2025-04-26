import { ReactNode } from 'react'
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/actions/auth.actions';
const AuthLayout = async ({ children }: { children: ReactNode }) => {
    const korisnikAutentikovan = await isAuthenticated();

    if (korisnikAutentikovan) redirect('/')
    return (
        <div className='auth-layout'>{children}</div>
    )
}

export default AuthLayout