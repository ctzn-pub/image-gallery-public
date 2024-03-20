
import OpenAI from 'openai';
import { sql } from '@vercel/postgres';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
    const input: {
        url: string;
        id: string;
    } = await req.json();

    // const response = await openai.chat.completions.create({
    //     model: "gpt-4-vision-preview",
    //     max_tokens: 200,
    //     // response_format: { type: "json_object" },

    //     messages: [
    //         {
    //             role: "user",
    //             content: [
    //                 { type: "text", text: "can you give 3 prompts to generate slight variations on this image. it should not refer to the 'original'. markdown and code block formatting is prohibited, produce only valid json data types, using 'description' as the key  " },
    //                 {
    //                     type: "image_url",
    //                     image_url: {
    //                         url: input.url,
    //                     },
    //                 },
    //             ],
    //         },
    //     ],
    //     // response_format: { type: "json_object" },

    // });
    // // const contentJson = JSON.parse(response.choices[0]);

    // // Now contentJson is a JavaScript object (array of objects in this case)
    // const prompts = response.choices[0].message.content && JSON.parse(response.choices[0].message.content);

    // // Using a for loop to iterate over prompts and generate images


    // // Constructing the response object with the collected URLs
    // const responseObject = {
    //     images: prompts
    // };


    console.log('input.id', input.id)
    const cached_prompts = await sql`
    SELECT prompts_claude_haiku FROM photos WHERE id = ${input.id};
`;

    const responseObject2 = {
        images: cached_prompts.rows[0].prompts_claude_haiku
    };

    console.log('cached_prompts', responseObject2)
    // console.log('responseObject', responseObject)

    return new Response(JSON.stringify(responseObject2), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });

}
