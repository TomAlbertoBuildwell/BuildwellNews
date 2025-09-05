"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Your Supabase client for DB queries
import { Loader2, AlertCircle, Mic } from "lucide-react";

// Define a type for the data we expect to get back from our query.
// This tells TypeScript that `data` will be an object with a `minio_url` property that is a string.
type PodcastRecord = {
  minio_url: string;
};

export function PodcastPlayer() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestPodcast = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("news_podcasts")
        .select("minio_url")
        .order("created_at", { ascending: false })
        .limit(1)
        .single<PodcastRecord>(); // <-- Type is specified here

      if (error) {
        console.error("Error fetching podcast URL from Supabase:", error.message);
        setError("The daily briefing is not available yet. Please check back later.");
      } else if (data && data.minio_url) {
        setAudioUrl(data.minio_url);
      } else {
        setError("Could not find a valid URL for the latest briefing.");
      }

      setIsLoading(false);
    };

    fetchLatestPodcast();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Daily News Briefing</h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 text-orange-600 rounded-full p-3 mr-4">
              <Mic className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Listen to Today's Top Stories</h3>
              <p className="text-sm text-gray-600 mt-1">AI-powered audio summary of the latest construction industry news</p>
            </div>
          </div>
          
          <div>
            {isLoading && (
              <div className="flex items-center text-gray-600 bg-white border border-gray-200 p-4 rounded-lg">
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-gray-500" />
                <span>Loading latest briefing...</span>
              </div>
            )}

            {error && !isLoading && (
              <div className="flex items-center text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg">
                <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {audioUrl && !isLoading && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <audio controls src={audioUrl} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

  /*
  return (
    <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-lg container mx-auto mb-8">
      <div className="flex items-center mb-4">
        <div className="bg-orange-100 text-orange-600 rounded-full p-2 mr-4">
          <Mic className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Daily News Briefing</h3>
          <p className="text-sm text-gray-500">Listen to today's top stories, powered by AI.</p>
        </div>
      </div>
      
      <div className="mt-4">
        {isLoading && (
          <div className="flex items-center text-gray-500 bg-gray-50 p-4 rounded-md">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Loading latest briefing...
          </div>
        )}

        {error && !isLoading && (
           <div className="flex items-center text-red-700 bg-red-50 p-4 rounded-md">
            <AlertCircle className="mr-3 h-5 w-5" />
            {error}
          </div>
        )}

        {audioUrl && !isLoading && (
          <audio controls src={audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}

*/