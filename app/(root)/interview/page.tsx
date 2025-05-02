import Agent from '@/app/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import React from 'react'

const page = async () => {
    const korisnik = await getCurrentUser();

    return (
        <>
            <h3>Generisanje Interviewa</h3>

            <Agent userName={korisnik?.name!} userId={korisnik?.id} type="generate" />
        </>


    );
};

export default page;