import { inngest } from '../inngest';
import { getArtifact, updateArtifact } from '@/db/artifacts';
import { generateRelic } from '@/lib/generateRelic';

export const generateRelicFunction = inngest.createFunction(
  { 
    name: "Generate Relic",
    id: "generate-relic"
  },
  { event: "relic/generate" },
  async ({ event, step }) => {
    const { artifactId } = event.data;

    // Get the artifact
    const artifact = await step.run("get-artifact", async () => {
      const artifact = await getArtifact(artifactId);
      if (!artifact) {
        throw new Error('Artifact not found');
      }
      return artifact;
    });

    // Generate the relic
    const result = await step.run("generate-relic", async () => {
      return await generateRelic(artifact, 'https://www.collectorquest.ai/images/relic-example.png');
    });

    if (!result.success) {
      throw new Error('Failed to generate relic');
    }

    // Update the artifact with the new relic image URL
    const updatedArtifact = await step.run("update-artifact", async () => {
      // Check if result is the success type before accessing data
      if ('data' in result) {
        return await updateArtifact(artifactId, {
          relicImageUrl: result.data.relicImageUrl
        });
      } else {
        throw new Error('Result does not contain data property');
      }
    });

    return updatedArtifact;
  }
); 