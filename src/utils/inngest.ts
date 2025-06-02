import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "collector-quest",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

// Event types
export interface TextToSpeechEvent {
  name: "tts/convert";
  data: {
    text: string;
    speaker?: string;
    emotion?: string;
    metadata?: {
      characterId?: string;
      artifactId?: string;
      relicId?: string;
    };
  };
} 