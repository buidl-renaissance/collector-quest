import { inngest } from '@/inngest/client';
import { getArtifact, updateArtifact } from '@/db/artifacts';
import { generateRelic } from '@/lib/generateRelic';
import { updateResult, completeResult } from '@/lib/storage';

export const generateRelicFunction = inngest.createFunction(
  { 
    name: "Generate Relic",
    id: "generate-relic"
  },
  { event: "relic/generate" },
  async ({ event, step }) => {
    const { artifactId, resultId } = event.data;

    // Get the artifact
    const artifact = await step.run("get-artifact", async () => {
      updateResult(resultId!, JSON.stringify({
        message: "Fetching artifact details",
        step: "get-artifact",
      }));
      
      const artifact = await getArtifact(artifactId);
      if (!artifact) {
        throw new Error('Artifact not found');
      }
      return artifact;
    });

    // Generate the relic
    updateResult(resultId!, JSON.stringify({
      message: "Generating relic image",
      step: "generate-relic",
    }));
    
    const result = await step.run("generate-relic", async () => {
      return await generateRelic(artifact, 'https://www.collectorquest.ai/images/relic-example.png');
    });

    if (!result.success) {
      updateResult(resultId!, JSON.stringify({
        message: "Failed to generate relic",
        step: "generate-relic-failed",
      }));
      throw new Error('Failed to generate relic');
    }

    // Update the artifact with the new relic image URL
    updateResult(resultId!, JSON.stringify({
      message: "Updating artifact with relic image",
      step: "update-artifact",
    }));
    
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

    completeResult(resultId!, JSON.stringify({
      message: "Relic generation complete",
      step: "complete",
      artifact: updatedArtifact,
    }));

    return updatedArtifact;
  }
); 