import Agent from '@/app/components/Agent'
import React from 'react'

const page = () => {
    return (
        <>
            <h3>Generisanje Interviewa</h3>

            <Agent username="Ti" userId="user1" type="generate" />
        </>


    )
}

export default page