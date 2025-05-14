import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getImage = async (image: string) => {
  if (image.startsWith("data:image")) {
    const base64Data = image.split(",")[1];
    const imageBuffer = Buffer.from(base64Data, "base64");
    return new File([imageBuffer], "image.png", { type: "image/png" });
  } else if (image.startsWith("http")) {
    const response = await fetch(image);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return new File([buffer], "image.png", {
      type: response.headers.get("content-type") || "image/png",
    });
  }
  return new File([], "image.png", { type: "image/png" });
};

export const generateImageRequest = async (prompt: string, image?: string) => {
  let imageFile: File = new File([], "image.png", { type: "image/png" });
  const maskFile = await getImage("https://collectorquest.ai/images/mask.png");

  // Process the provided image if it exists
  if (image) {
    imageFile = await getImage(image);
  } else {
    imageFile = await getImage(
      "https://collectorquest.ai/images/COLLECTOR-quest-intro-1024.png"
    );
  }

  // Generate the image
  const response = await openai.images.edit({
    model: "gpt-image-1",
    image: imageFile,
    mask: maskFile,
    prompt: `replace the quest master, keeping the style of the image, with a ${prompt}`,
    n: 1,
    size: "1024x1024",
  });

  return `data:image/png;base64,${response.data[0].b64_json}`;
};
