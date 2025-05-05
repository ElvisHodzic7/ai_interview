"use client";
import { interviewer } from '@/constants';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SavedMessasge {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
    const router = useRouter();
    const [prica, postaviPrica] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessasge[]>([]);
    const [posljednjaPoruka, postaviZadnjaPoruka] = useState<string>("");

    useEffect(() => {
        const onCallStart = () => {

            setCallStatus(CallStatus.ACTIVE);
        };
        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
        };

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript }

                setMessages((prev) => [...prev, newMessage]);
            }
        }

        const pocetakPrice = () => postaviPrica(true);
        const krajPrice = () => postaviPrica(false);

        const greška = (error: Error) => console.log('Greška', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', pocetakPrice);
        vapi.on('speech-end', krajPrice);
        vapi.on('error', greška);


        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', pocetakPrice);
            vapi.off('speech-end', krajPrice);
            vapi.off('error', greška);
        }
    }, [])

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log('Generiši recenziju ovdje');

        const { success, id } = {
            success: true,
            id: 'feedback-id'
        }

        if (success && id) {
            router.push(`/interview/${interviewId}/feedback`)
        } else {
            console.log('Greška pri spremanju recenzije');
            router.push('/');
        }
    }

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            if (type === 'generate') {
                router.push('/')
            } else {
                handleGenerateFeedback(messages);
            }
        }
        if (callStatus === CallStatus.FINISHED) router.push('/');
    }, [messages, callStatus, type, userId, router]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);
        if (type === 'generate') {
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    username: userName,
                    userid: userId,
                }
            })
        } else {
            let formattedQuestions = ' ';

            if (questions) {
                formattedQuestions = questions
                    .map((question) => `- ${question}`)
                    .join('\n');
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions
                }
            })
        }

    }

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);

        vapi.stop();
    }

    const zadnjaPoruka = messages[messages.length - 1]?.content;

    const pozivInaktivanIliZavrsen = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    // const zadnjaPoruka = messages[messages.length - 1];
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
                        <p key={posljednjaPoruka} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {posljednjaPoruka}
                        </p>

                    </div>

                </div>
            )}

            <div className='w-full flex justify-center'>
                {callStatus !== 'ACTIVE' ? (
                    <button className='relative btn-call' onClick={handleCall}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}
                        />
                        <span>
                            {pozivInaktivanIliZavrsen ? 'Pozovi' : ' . . . '}
                        </span>
                    </button>
                ) : (
                    <button className='btn-disconnect' onClick={handleDisconnect}>
                        Kraj Razgovora
                    </button>
                )}

            </div>
        </>
    )
}

export default Agent