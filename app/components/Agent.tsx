import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}

const Agent = ({ userName }: AgentProps) => {
    const prica = true;
    const callStatus = CallStatus.FINISHED;
    const messages = [
        'Kako se zoveš?',
        'Moje ime je Hodzic Elvis, drago mi je !'
    ];
    const zadnjaPoruka = messages[messages.length - 1];
    return (
        <>

            <div className='call-view'>
                <div className='card-interviewer'>
                    <div className='avatar'>
                        <Image src="/ai-avatar.png" alt='vapi' width={65} height={54} className='object-cover' />
                        {prica && <span className='animate-speak' />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className='card-border'>
                    <div className='card-content'>
                        <Image src="/user-avatar.png" alt='Korisnicki avatar' width={540} height={540} className='rounded-full object-cover size-[120px]' />
                        <h3>
                            {userName}
                        </h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className='transcript-border'>
                    <div className='transcript'>
                        <p key={zadnjaPoruka} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {zadnjaPoruka}
                        </p>

                    </div>

                </div>
            )}

            <div className='w-full flex justify-center'>
                {callStatus !== 'ACTIVE' ? (
                    <button className='relative btn-call'>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' & 'hidden')}
                        />
                        <span>
                            {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Interview' : '. . . '}
                        </span>
                    </button>
                ) : (
                    <button className='btn-disconnect'>
                        Kraj Razgovora
                    </button>
                )}

            </div>
        </>
    )
}

export default Agent