// src/lib/elevenLabs.ts

export const generateAudio = async (script: string): Promise<Blob | null> => {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Default voice ID

  if (!apiKey) {
    console.error("ElevenLabs API key not found.");
    return null;
  }

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
    console.error("ElevenLabs API request failed:", response.status, response.statusText);
    return null;
  }

  return response.blob();
};