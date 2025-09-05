import { NextResponse } from "next/server";
import { Buffer } from 'buffer';
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";
import * as Minio from "minio";

import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { createClient } from '@supabase/supabase-js'



const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const OPENAI_API_KEY_PODCAST_SCRIPT = process.env.OPENAI_API_KEY_PODCAST_SCRIPT;
const podcastOpenai = new OpenAI({ apiKey: OPENAI_API_KEY_PODCAST_SCRIPT });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey = process.env.SERVICE_ROLE_KEY;

const FULL_MIN_IO_END_POINT=process.env.FULL_MIN_IO_END_POINT;
const MIN_IO_END_POINT=process.env.MIN_IO_END_POINT;
const MIN_IO_ACCESS_KEY=process.env.MIN_IO_ACCESS_KEY; 
const MIN_IO_SECRET_KEY=process.env.MIN_IO_SECRET_KEY; 
const BUCKET_NAME="news";

// Code to get the today's date in the format of "1st January 2025" for the podcast script.
const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/(\d+)/, (s) => {
  const lastDigit = s.slice(-1);
  const secondLastDigit = s.slice(-2, -1);
  if (secondLastDigit === '1') return `${s}th`;
  switch (lastDigit) {
    case '1': return `${s}st`;
    case '2': return `${s}nd`;
    case '3': return `${s}rd`;
    default: return `${s}th`;
  }
});
const SPEAKER_1_NAME = "Tom";
const SPEAKER_2_NAME = "Ben";


const minioClient = new Minio.Client({
  endPoint: MIN_IO_END_POINT!,
  useSSL: true, // Set to true if your MinIO instance uses HTTPS (recommended)
  accessKey: MIN_IO_ACCESS_KEY!,
  secretKey: MIN_IO_SECRET_KEY!,
});

// Initialize S3 client
const s3Client = new S3Client({
  endpoint: FULL_MIN_IO_END_POINT!,
  region: 'us-east-1',
  credentials: {
    accessKeyId: MIN_IO_ACCESS_KEY!,
    secretAccessKey: MIN_IO_SECRET_KEY!,
  },
  forcePathStyle: true,
});

// Initialize Supabase client
const supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!);




export async function GET() {
  // --- Configuration ---
  const ARTICLE_COUNT = 7;

  // --- Database Query ---
  const { data: articles, error } = await supabase
    .from("news_articles")
    .select("title, summary")
    .eq("status", "approved")
    .not("summary", "is", null)
    .order("published_date", { ascending: false })
    .limit(ARTICLE_COUNT);

  // --- Error Handling & Validation ---
  if (error) {
    console.error("Supabase query error in podcast route:", error.message);
    return NextResponse.json(
      { error: "An error occurred while fetching articles." },
      { status: 500 }
    );
  }

  if (!articles || articles.length === 0) {
    return NextResponse.json(
      { error: "No recent, approved articles with summaries were found." },
      { status: 404 }
    );
  }


  // --- 2. Create the Podcast Script ---
    // Note: OpenAI TTS doesn't use SSML tags like <break>. Simple punctuation creates natural pauses.

    const stories = articles
      .map(article => `Title: ${article.title}\nSummary: ${article.summary}`)
      .join('\n\n');

    const prompt = `You are a podcast script generator for a daily news briefing on the UK construction industry. 
    
    Create an engaging and interesting two-speaker podcast script based on the following articles. 
    
    Ensure the script has two speakers, ${SPEAKER_1_NAME} and ${SPEAKER_2_NAME}, clearly indicating who is speaking. 
    
    The tone should be an informative and lively conversation about the content of the stories..

    The intro should be a variant on: "Good morning, this is the UK construction industry briefing for ${today}. I'm ${SPEAKER_1_NAME}. Today we'll be discussing the following stories...". At this point the speaker should give a very brief overview of the stories delivered in a way that will grab the listener's attention.

    Make sure that key details like company names, project names, and other important information are not omitted.

    Be careful not to include any information that is not in the articles. Do not make up any information. Do not draw inferences from the articles.

Articles:
${stories}

Format your response as follows, with no extra text or explanations:

SPEAKER_1: ...
SPEAKER_2: ...
SPEAKER_1: ...
...
`;

    const chatCompletion = await podcastOpenai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or "gpt-4" for higher quality
      messages: [
        { role: "system", content: "You are a helpful assistant that generates engaging podcast scripts." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const script = chatCompletion.choices[0].message.content;
    console.log(script)

    if (!script) {
      return NextResponse.json(
        { error: "Failed to generate podcast script." },
        { status: 500 }
      );
    }

    // --- 3. Generate Audio with OpenAI TTS ---
    try {
      
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",        // A powerful and cost-effective model.
        voice: "nova",         // Choose a voice: alloy, echo, fable, onyx, nova, or shimmer.
        input: script,
      });
      
      const audioBuffer: Buffer = Buffer.from(await mp3.arrayBuffer());
      
      // --- 4. Save Audio to MinIO Storage ---
      const fileName = `briefing-${new Date().toISOString().split('T')[0]}.mp3`;
      
      // Define metadata for the object to ensure it's served correctly
      
      const metaData = {
        'Content-Type': 'audio/mpeg',
      };
      
      
      // Upload the audio buffer to MinIO
      
      await minioClient.putObject(BUCKET_NAME, fileName, audioBuffer, audioBuffer.length, metaData);

      // --- 5. Get Public URL and Save Record to MinIo Database ---
       

      // Generate download URL
      async function generateDownloadUrl(
        key: string,
        expiresIn: number = 3600
      ): Promise<string> {
        const command = new GetObjectCommand({
          Bucket: 'news',
          Key: key,
        });
      
        try {
          const url = await getSignedUrl(s3Client, command, { expiresIn });
          return url;
        } 
        catch (error) {
          throw new Error(`Failed to generate download URL: ${error}`);
        }
      }
      
      const presignedUrl = await generateDownloadUrl(fileName, 3600)
      console.log("✓ Presigned URL generated");

      // Also check the URL length
      console.error("Debug info:", {
        urlLength: presignedUrl.length,
        scriptLength: script?.length,
        url: presignedUrl
      });

    

      // Make a record in supabase table news_podcasts of the MinIO file url for downloading to frontend
      // Insert podcast function
    async function insertPodcastToSupabase(
      url: string,
      filename: string,
      username: string
    ) {
      const { data, error } = await supabaseClient
        .from('news_podcasts')
        .insert([
          {
            minio_url: url,
            filename: filename,
            username: username
          }
        ])
        .select()
        .single()

        if (error) {
          // Properly log Supabase errors
          console.error('Error inserting podcast:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            // Force serialize all properties
            fullError: JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
          });
          
          // Check if it's actually an error or just a warning
          if (error.code) {
            throw new Error(`Supabase error: ${error.message || error.code}`);
          }
        }
      console.log("Insert successful:", data);
      return data
    }

    try{
    const foo = await insertPodcastToSupabase(presignedUrl, fileName, "TomAlberto");
    console.log(foo)
    }
    catch (error){
      console.log(`The error was ${error}`)
    }

    return NextResponse.json({ success: true, url: presignedUrl });
      

    } catch (error) {
      // Type guard for error handling
      const errorMessage = error instanceof Error 
        ? error.message 
        : String(error);
      
      const errorDetails = error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name
          }
        : { raw: String(error) };
      
      console.error("Podcast generation/upload failed:", errorDetails);
      
      return NextResponse.json(
        { error: errorMessage || "Podcast generation and saving failed." }, 
        { status: 500 }
      );
    }
  }
