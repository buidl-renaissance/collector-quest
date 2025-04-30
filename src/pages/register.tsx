import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import PageLayout from "@/components/PageLayout";
// import { registerHandle } from "../lib/getHandle";
import { SuiClient } from "@/lib/client";
import { getWallet } from "@/lib/wallet";
import PinCode from "@/components/PinCode";
import { getHandleByAddress } from "@/lib/getHandle";

const RegisterPage = () => {
  const [handle, setHandle] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHandle = async () => {
      const wallet = getWallet();
      if (!wallet) {
        setError("Please connect your wallet first");
        return;
      }
      const handle = await getHandleByAddress(wallet.getPublicKey().toSuiAddress());
      console.log("HANDLE", handle);
      setHandle(handle);
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

  return (
    <PageLayout
      title="Register Your Character"
      subtitle="Create your unique identity in Lord Smearington's Gallery"
      backLink="/gallery"
      backLinkText="Back to Gallery"
    >
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="handle">Choose Your Handle</Label>
            <Input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter your unique handle"
              disabled={isSubmitting}
            />
            <Label htmlFor="pinCode" style={{ textAlign: "center" }}>Enter your PIN Code</Label>
            <PinCode
              value={pinCode}
              onChange={(value: string) => setPinCode(value)}
              disabled={isSubmitting}
            />
          </FormGroup>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Handle"}
          </SubmitButton>
        </form>
      </FormContainer>
    </PageLayout>
  );
};


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
