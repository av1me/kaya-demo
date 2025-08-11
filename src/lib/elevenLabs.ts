// src/lib/elevenLabs.ts

export const generateAudio = async (script: string): Promise<Blob | null> => {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice - professional and clear

  console.log('🎙️ ElevenLabs: Starting audio generation');
  console.log('🎙️ ElevenLabs: API Key present:', !!apiKey);
  console.log('🎙️ ElevenLabs: Script length:', script.length);

  if (!apiKey) {
    console.error("🎙️ ElevenLabs: API key not found. Please set VITE_ELEVENLABS_API_KEY in your environment.");
    throw new Error("ElevenLabs API key not found. Please set VITE_ELEVENLABS_API_KEY in your environment.");
  }

  if (!script || script.trim().length === 0) {
    console.error("🎙️ ElevenLabs: Empty script provided");
    throw new Error("Empty script provided for audio generation");
  }

  try {
    console.log('🎙️ ElevenLabs: Making API request to generate audio...');
    
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

    console.log('🎙️ ElevenLabs: API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🎙️ ElevenLabs: API request failed:", response.status, response.statusText);
      console.error("🎙️ ElevenLabs: Error details:", errorText);
      
      if (response.status === 401) {
        throw new Error("Invalid ElevenLabs API key. Please check your API key.");
      } else if (response.status === 429) {
        throw new Error("ElevenLabs API rate limit exceeded. Please try again later.");
      } else {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }
    }

    const audioBlob = await response.blob();
    console.log('🎙️ ElevenLabs: Audio blob generated successfully, size:', audioBlob.size, 'bytes');
    
    return audioBlob;
  } catch (error) {
    console.error('🎙️ ElevenLabs: Error during audio generation:', error);
    throw error;
  }
};