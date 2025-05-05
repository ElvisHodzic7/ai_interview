import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import InterviewCard from '../components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import { getInterviewByUserId, getLatestInterviews } from '@/lib/actions/general.action'

const page = async () => {
  const user = await getCurrentUser();

  const [] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! })
  ])

  const userInterviews = await getInterviewByUserId(user?.id!);
  const zadnjiInterviewi = await getLatestInterviews({ userId: user?.id! });

  const buduciInterviewi = zadnjiInterviewi?.length > 0;

  const prosliInterview = userInterviews?.length > 0;
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>
            Budi spreman za svoj idući interview putem moderne AI platforme
          </h2>
          <p className='text-lg'>
            Vježbaj na stvarnim pitanjima za interview i pogledaj rezultate
          </p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview"> Započni interview</Link>
          </Button>

        </div>
        <Image src="/robot.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden" />

      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>
          Tvoj Interview
        </h2>
        <div className='interviews-section'>
          {prosliInterview ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>Nisi imao nijedan Interview do sad</p>
          )}


        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>
          Prisustvuj Interview-u
        </h2>
        <div className='interviews-section'>
          {buduciInterviewi ? (
            zadnjiInterviewi?.map((interview) => (
              <InterviewCard {...interview} key={interview.id} />
            ))
          ) : (
            <p>Trenutno nema dostupno novih interview-a.</p>
          )}
        </div>
      </section>

    </>
  )
}

export default page