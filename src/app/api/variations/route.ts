import OpenAI from 'openai';
import { sql } from '@vercel/postgres';
import * as fal from "@fal-ai/serverless-client";
import { c } from '@vercel/blob/dist/put-FLtdezzu.cjs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {


    fal.config({
        credentials: process.env.FAL_CREDENTIALS,
    });

    const input = await req.json();





    // First, try to fetch an existing URL from the database
    const existingRecord = await sql`
        SELECT url FROM ai_generated_images WHERE id = ${input.id} AND prompt = ${input.prompttext};
    `;

    if (existingRecord.rows.length > 0) {
        // If a record exists, return the existing URL
        return new Response(JSON.stringify(existingRecord.rows[0].url), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        // If no record exists, generate the image
        // const imageResponse = await openai.images.generate({
        //     model: "dall-e-3",
        //     prompt: input.prompttext
        // });

        // const imageUrl = imageResponse.data[0].url;

        const result = await fal.subscribe("110602490-fast-sdxl", {
            input: {
                prompt:
                    input.prompttext
            },
        });

        const imageUrl = (result as any).images[0].url;

        // Save the new URL to the database
        await sql`
            INSERT INTO ai_generated_images (id, prompt, url) VALUES (${input.id}, ${input.prompttext}, ${imageUrl});
        `;

        // Return the new URL
        return new Response(JSON.stringify(imageUrl), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

// import OpenAI from 'openai';
// import { sql } from '@vercel/postgres';

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY || '',
// });

// export const runtime = 'edge';

// export async function POST(req: Request) {
//     const input: {
//         prompttext: string;
//         id: string;
//     } = await req.json();

//     console.log('input.prompttext', input.prompttext)

//     const imageResponse = await openai.images.generate({
//         model: "dall-e-3",
//         prompt: input.prompttext
//     });

//     const imageUrl = imageResponse.data[0].url;



//     // Constructing the response object with the collected URLs
//     await sql`INSERT INTO ai_generated_images (id, prompt, url) VALUES (${input.id},${input.prompttext}, ${imageUrl});`;


//     return new Response(JSON.stringify(imageUrl), {
//         status: 200,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });

// }