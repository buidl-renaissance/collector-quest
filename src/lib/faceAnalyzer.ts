import OpenAI from 'openai';

export interface FacialCharacteristics {
  faceShape?: string;
  eyeShape?: string;
  eyeColor?: string;
  noseShape?: string;
  mouthShape?: string;
  hairStyle?: string;
  hairColor?: string;
  skinTone?: string;
  distinctiveFeatures?: string[];
  [key: string]: string | string[] | undefined;
}

export interface GenerateCharacterParams {
  characteristics: FacialCharacteristics;
  race: string;
}

export class FaceAnalyzer {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Analyzes a face image and extracts facial characteristics
   * @param imageData Base64 encoded image data
   * @returns Object containing facial characteristics
   */
  async analyzeFace(imageData: string): Promise<FacialCharacteristics> {
    // Remove the data URL prefix if present
    const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract facial characteristics that we can use to fuse with a generated video game character. Focus on: face shape, eye shape and color, nose shape, mouth shape, hair style and color, skin tone, and any distinctive features. Format the response as a JSON object with these characteristics."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    // Clean up the response content by removing markdown formatting
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the response to ensure it's valid JSON
    return JSON.parse(cleanedContent);
  }

  /**
   * Generates a character image based on facial characteristics and race
   * @param params Parameters for character generation
   * @returns URL of the generated image
   */
  async generateCharacter(params: GenerateCharacterParams): Promise<string> {
    const { characteristics, race } = params;

    const response = await this.openai.images.generate({
      model: "dall-e-3",
      prompt: this.buildCharacterPrompt(characteristics, race),
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    return imageUrl;
  }

  /**
   * Builds a prompt for character generation based on characteristics and race
   */
  private buildCharacterPrompt(characteristics: FacialCharacteristics, race: string): string {
    const features = Object.entries(characteristics)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        return `${formattedKey}: ${Array.isArray(value) ? value.join(', ') : value}`;
      })
      .join(', ');

    return `Create a fantasy character portrait of a ${race} with the following features: ${features}. 
    The character should be in a heroic pose, with dramatic lighting, and a fantasy RPG style. 
    The image should be highly detailed and suitable for a video game character.`;
  }
}
