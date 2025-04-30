import React, { useState } from "react";
import styled from "@emotion/styled";
import { useWallet } from '@suiet/wallet-kit';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  FormContainer,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
} from "./Forms";
import { SubmitButton } from "./Buttons";

const RegisterHandleContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(to bottom right, #2d3748, #1a202c);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: #e2e8f0;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
`;

const Description = styled.p`
  color: #a0aec0;
  margin-bottom: 2rem;
  text-align: center;
`;

const RegisterHandle: React.FC = () => {
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const wallet = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate handle
      if (handle.length < 3) {
        throw new Error("Handle must be at least 3 characters long");
      }
      if (handle.length > 20) {
        throw new Error("Handle must be at most 20 characters long");
      }
      if (!/^[a-zA-Z0-9_]+$/.test(handle)) {
        throw new Error("Handle can only contain letters, numbers, and underscores");
      }

      // Create transaction block
      const packageId = process.env.NEXT_PUBLIC_HANDLE_PACKAGE_ID || "0xab59c7c0acd861d656ae5cdf2df969c35fcefbc28ac28d9173064826f36bd182";
      const tx = new TransactionBlock();
      
      // Get registry object ID (this would need to be provided or fetched)
      // For this example, we're assuming it's passed as a prop or environment variable
      const registryId = '0xf9eeb8be3970b84025cafee8c1c6b0a7eca99b9bec3b5d54408a97895d4bcdee';

      if (!registryId) {
        throw new Error("Wallet address not found");
      }
      
      // Call the register_handle function
      tx.moveCall({
        target: `${packageId}::handle::register_handle`,
        arguments: [
          tx.object(registryId),
          tx.pure(Array.from(new TextEncoder().encode(handle))),
        ],
      });

      // Execute the transaction
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx as any,
      });

      console.log("Handle registration successful:", response);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error registering handle:", err);
      setError(err.message || "Failed to register handle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterHandleContainer>
      <Title>Register Your Handle</Title>
      <Description>
        Secure your unique handle on the Sui blockchain. This handle will be
        associated with your wallet address.
      </Description>

      {isSuccess ? (
        <div style={{ textAlign: "center", color: "#48BB78" }}>
          <h3>Success!</h3>
          <p>Your handle &quot;{handle}&quot; has been successfully registered.</p>
        </div>
      ) : (
        <FormContainer onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="handle">Handle</Label>
            <Input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter your desired handle"
              required
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={isLoading || !wallet.connected}
          >
            {isLoading ? "Registering..." : "Register Handle"}
          </SubmitButton>

          {!wallet.connected && (
            <ErrorMessage>
              Please connect your wallet to register a handle
            </ErrorMessage>
          )}
        </FormContainer>
      )}
    </RegisterHandleContainer>
  );
};

export default RegisterHandle;
