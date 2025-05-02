import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import PageLayout from "@/components/PageLayout";
// import { registerHandle } from "../lib/getHandle";
import { SuiClient } from "@/lib/client";
import { getWallet } from "@/lib/wallet";
import PinCode from "@/components/PinCode";
import { getHandleByAddress } from "@/lib/getHandle";
import { UploadMedia } from "@/components/UploadMedia";

const RegisterPage = () => {
  const [handle, setHandle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pinCode, setPinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchHandle = async () => {
      const wallet = getWallet();
      if (!wallet) {
        setError("Please connect your wallet first");
        return;
      }
      try {
        const { handle: fetchedHandle, image: fetchedImage } = await getHandleByAddress(wallet.getPublicKey().toSuiAddress());
        console.log("HANDLE", fetchedHandle, fetchedImage);
        setHandle(fetchedHandle);
        setImageUrl(fetchedImage);
      } catch (err) {
        console.error("Error fetching handle:", err);
        setError("Failed to fetch handle");
      }
    };
    fetchHandle();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!handle.trim()) {
      setError("Please enter a valid handle");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const wallet = getWallet();
      if (!wallet) {
        setError("Please connect your wallet first");
        return;
      }

      const client = new SuiClient(wallet);
      const result = await client.registerHandle(
        handle,
        imageUrl || "",
        wallet.getPublicKey().toSuiAddress(),
        pinCode,
        []
      );

      console.log("REGISTRATION RESULT", result);

      setSuccess(true);
      // setTimeout(() => {
      //   router.push("/gallery");
      // }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register handle"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !handle.trim()) {
      setError("Please enter a valid handle");
      return;
    }
    if (currentStep === 2 && !imageUrl) {
      setError("Please upload an image");
      return;
    }
    setError(null);
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormGroup>
            <StepIndicator>Step 1 of 3: Choose Your Handle</StepIndicator>
            <Label htmlFor="handle">Choose Your Handle</Label>
            <Input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter your unique handle"
              disabled={isSubmitting}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonContainer>
              <NextButton onClick={nextStep}>Next</NextButton>
            </ButtonContainer>
          </FormGroup>
        );
      case 2:
        return (
          <FormGroup>
            <StepIndicator>Step 2 of 3: Upload Your Image</StepIndicator>
            <Label htmlFor="image">Upload Your Image</Label>
            <UploadMedia
              onUploadComplete={(url) => setImageUrl(url)}
              mediaUrl={imageUrl || undefined}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonContainer>
              <BackButton onClick={prevStep}>Back</BackButton>
              <NextButton onClick={nextStep}>Next</NextButton>
            </ButtonContainer>
          </FormGroup>
        );
      case 3:
        return (
          <FormGroup>
            <StepIndicator>Step 3 of 3: Set Your PIN Code</StepIndicator>
            <Label htmlFor="pinCode" style={{ textAlign: "center" }}>Enter your PIN Code</Label>
            <PinCode
              value={pinCode}
              onChange={(value: string) => setPinCode(value)}
              disabled={isSubmitting}
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ButtonContainer>
              <BackButton onClick={prevStep}>Back</BackButton>
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register Handle"}
              </SubmitButton>
            </ButtonContainer>
          </FormGroup>
        );
      default:
        return null;
    }
  };

  if (success) {
    return (
      <PageLayout
        title="Registration Successful"
        subtitle="Your character has been registered"
        backLink="/gallery"
        backLinkText="Go to Gallery"
      >
        <SuccessMessage>
          <h3>Registration Successful!</h3>
          <p>Your handle <strong>{handle}</strong> has been registered.</p>
          <p>You can now explore Lord Smearington's Gallery.</p>
        </SuccessMessage>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Register Your Character"
      subtitle="Create your unique identity in Lord Smearington's Gallery"
      backLink="/gallery"
      backLinkText="Back to Gallery"
    >
      <FormContainer>
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
        </form>
      </FormContainer>
    </PageLayout>
  );
};

const StepIndicator = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #a0aec0;
  font-size: 0.9rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const NextButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #805ad5, #6b46c1);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
  margin-left: auto;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #a0aec0;
  border: 1px solid #4a5568;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background: rgba(74, 85, 104, 0.2);
    color: #e2e8f0;
  }
`;

const FormContainer = styled.div`
  background: rgba(26, 32, 44, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #4a5568;
  background-color: #2d3748;
  color: white;
  font-size: 1rem;
  transition: border-color 0.3s;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #805ad5;
    box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.3);
  }

  &::placeholder {
    color: #718096;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, #805ad5, #d53f8c);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #fc8181;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  text-align: center;
  background: rgba(26, 32, 44, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;

  h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: #68d391;
  }

  p {
    margin-bottom: 0.5rem;
    color: #a0aec0;
  }
`;

export default RegisterPage;
