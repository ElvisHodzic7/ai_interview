import { db } from '@/firebase/admin';
import { getRandomInterviewCover } from '@/lib/utils';
import { google } from '@ai-sdk/google'
import { generateText } from 'ai';
export async function GET() {
    return Response.json({ success: true, data: 'HVALA' }, { status: 200 });
}

export async function POST(request: Request) {
    const { tip, uloga, nivo, stack, kolicina, userid } = await request.json();
    try {
        const { text: pitanja } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Prepare questions for a job interview.
              The job role is ${uloga}.
              The job experience level is ${nivo}.
              The tech stack used in the job is: ${stack}.
              The focus between behavioural and technical questions should lean towards: ${tip}.
              The amount of questions required is: ${kolicina}.
              Please return only the questions, without any additional text.
              The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
              Return the questions formatted like this:
              ["Question 1", "Question 2", "Question 3"]
              
              Thank you! <3
          `,
        });

        const interview = {
            uloga, tip, nivo,
            stack: stack.split(','),
            pitanja: JSON.parse(pitanja),
            userid: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        }

        await db.collection("interviews").add(interview);
        return Response.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error(error);


        return Response.json({ success: false, error }, { status: 500 });
    }
}