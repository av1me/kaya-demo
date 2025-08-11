// src/lib/elevenLabs.ts

export const generateAudio = async (script: string): Promise<Blob | null> => {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice - professional and clear

  if (!apiKey) {
    console.error("ElevenLabs API key not found. Please set VITE_ELEVENLABS_API_KEY environment variable.");
    console.log("To set the API key, run: export VITE_ELEVENLABS_API_KEY='your_api_key_here'");
    return null;
  }

  if (!script || script.trim().length === 0) {
    console.error("No script provided for audio generation");
    return null;
  }

  console.log("🎙️ Generating audio for podcast script...");
  console.log("Script length:", script.length, "characters");

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: script,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API request failed:", response.status, response.statusText);
      console.error("Error details:", errorText);
      return null;
    }

    const audioBlob = await response.blob();
    console.log("✅ Audio generated successfully! Size:", audioBlob.size, "bytes");
    return audioBlob;
  } catch (error) {
    console.error("❌ Error generating audio:", error);
    return null;
  }
};

// Test function to verify ElevenLabs integration
export const testElevenLabsConnection = async (): Promise<boolean> => {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    console.error("❌ ElevenLabs API key not found");
    return false;
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
      },
    });

    if (response.ok) {
      console.log("✅ ElevenLabs API connection successful");
      return true;
    } else {
      console.error("❌ ElevenLabs API connection failed:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ ElevenLabs API connection error:", error);
    return false;
  }
};

// Generate a sample audio for testing
export const generateSampleAudio = async (): Promise<Blob | null> => {
  const sampleScript = "Welcome to the Labfox Weekly Pulse. This is a test of our audio generation system. The podcast feature is now working correctly.";
  return await generateAudio(sampleScript);
};