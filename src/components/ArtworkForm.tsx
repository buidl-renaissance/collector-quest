import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  TextArea,
  ErrorMessage,
} from "./Forms";
import { SubmitButton } from "./Buttons";
import { ImageUploader } from "./ImageUploader";
import { AIGenerator } from "./AIGeneratorButton";
import { useState } from "react";
import { Artwork, createArtwork } from "@/lib/dpop";
import styled from "@emotion/styled";
import { convertDefaultToResized } from "@/lib/image";
import { useWallet } from '@suiet/wallet-kit';
import { TransactionBlock } from "@mysten/sui.js/transactions";

type ArtworkFormProps = {
  onSubmitSuccess: (artwork: Artwork) => void;
};

// Currency Input Component
const CurrencyInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CurrencySymbol = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  pointer-events: none;
`;

const CurrencyInput = styled(Input)`
  padding-left: 2.5rem;
`;

// Toggle Switch Component
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ToggleLabel = styled.span`
  color: #e2e8f0;
  margin-left: 0.75rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #805ad5;
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(45, 55, 72, 0.7);
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

// ArtworkForm Component
const ArtworkForm = ({ onSubmitSuccess }: ArtworkFormProps) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [artworkName, setArtworkName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isForSale, setIsForSale] = useState(false);
  const [price, setPrice] = useState("");
  const [collaborators, setCollaborators] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const wallet = useWallet();

  // useEffect(() => {
  //   const username = localStorage.getItem('username');
  //   if (username) {
  //     setArtistName(username);
  //   }
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Here you would implement the actual submission logic
      // For example, uploading to IPFS and then calling the Sui contract
      const uploadedBy = localStorage.getItem("username");

      // Upload image to API
      if (imagePreview) {
        // Check if wallet is connected
        if (!wallet.connected) {
          throw new Error("Wallet is not connected. Please connect your wallet first.");
        }
        
        const packageId = "0x033332b5de804714bdea0f0db308ebd7a8ddad039e3a08da5acb2ed8046827a7";
        
        // Create a transaction block to mint the artwork on-chain
        const tx = new TransactionBlock();
        
        // Call the create_artwork function from the artwork module
        tx.moveCall({
          target: `${packageId}::artwork::create_artwork`,
          arguments: [
            tx.pure(Array.from(new TextEncoder().encode(artworkName))),
            tx.pure(Array.from(new TextEncoder().encode(description))),
            tx.pure(Array.from(new TextEncoder().encode(imagePreview))),
            tx.pure(isForSale ? parseInt(price) : 0),
          ],
        });
        
        // Sign and execute the transaction
        const response = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: tx as any,
          options: {
            showEffects: true,
            showEvents: true,
          },
        });
        
        console.log("Transaction executed:", response);

        // Create the artwork in the database
        const artwork = await createArtwork({
          title: artworkName,
          description: description,
          data: {
            artist_name: artistName,
            image: imagePreview,
            is_for_sale: isForSale,
            price: isForSale ? parseFloat(price) : undefined,
            num_collaborators: parseInt(collaborators),
            uploaded_by: uploadedBy || undefined,
            transaction_digest: response.digest,
          },
        });

        console.log("Artwork created successfully:", artwork);
        onSubmitSuccess(artwork);
      } else {
        throw new Error("No image file selected");
      }

      // Reset form
      setArtworkName("");
      setDescription("");
      setImagePreview(null);
      setIsForSale(false);
      setPrice("");
      setCollaborators("1");
    } catch (error) {
      setSubmitError("Failed to submit artwork. Please try again.");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIMetadata = async () => {
    if (!imagePreview) return;
    if (isGeneratingAI) return;
    if (artworkName && description) return;

    setIsGeneratingAI(true);
    try {
      const response = await fetch("/api/ai/artwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: convertDefaultToResized(imagePreview),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI metadata");
      }

      const data = await response.json();
      setArtworkName(data.artwork.title);
      setDescription(data.artwork.description);
    } catch (error) {
      console.error("Error generating AI metadata:", error);
      setSubmitError(
        "Failed to generate AI metadata. Please try again or fill in manually."
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };
  return (
    <FormContainer onSubmit={handleSubmit}>
      <ImageUploader
        imagePreview={imagePreview || ""}
        setImagePreview={setImagePreview}
        onFileSelected={() => setIsUploadingImage(true)}
        onUploadComplete={() => setIsUploadingImage(false)}
      />

      <AIGenerator
        generateAIMetadata={generateAIMetadata}
        isSubmitting={isSubmitting}
        isGeneratingAI={isGeneratingAI}
        isDisabled={isUploadingImage}
      />

      <FormGroup>
        <Label htmlFor="artworkName">Title</Label>
        <Input
          id="artworkName"
          type="text"
          value={artworkName}
          onChange={(e) => setArtworkName(e.target.value)}
          placeholder="e.g., 'Screaming Void of Technicolor Nightmares'"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your artistic vision in excruciating detail..."
          rows={4}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="artistName">Artist Name</Label>
        <Input
          id="artistName"
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Artist's name"
          required
        />
      </FormGroup>

      {/* <FormGroup>
        <Label htmlFor="collaborators">Number of Collaborators</Label>
        <Input
          id="collaborators"
          type="number"
          value={collaborators}
          onChange={(e) => setCollaborators(e.target.value)}
          placeholder="1"
          min="1"
          step="1"
          required
        />
      </FormGroup> */}

      <FormGroup>
        <ToggleContainer>
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={isForSale}
              onChange={(e) => setIsForSale(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
          <ToggleLabel>List for Sale</ToggleLabel>
        </ToggleContainer>
      </FormGroup>

      {isForSale && (
        <FormGroup>
          <Label htmlFor="price">Price (in USDC)</Label>
          <CurrencyInputContainer>
            <CurrencySymbol>$</CurrencySymbol>
            <CurrencyInput
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="100"
              min="0"
              step="1"
              required={isForSale}
            />
          </CurrencyInputContainer>
        </FormGroup>
      )}

      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}

      <SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit to Lord Smearington"}
      </SubmitButton>
    </FormContainer>
  );
};

export default ArtworkForm;
