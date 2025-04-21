import React, { useState } from "react";
import styled from "@emotion/styled";
import { FormContainer, FormGroup, Label, Input, ErrorMessage } from "./Forms";
import { SubmitButton } from "./Buttons";

type UsernameFormProps = {
  onSubmit: (username: string) => void;
  initialUsername?: string;
};

const UsernameForm = ({
  onSubmit,
  initialUsername = "",
}: UsernameFormProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (username.length > 20) {
      setError("Username must be less than 20 characters long");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError(
        "Username can only contain letters, numbers, underscores, and hyphens"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you might want to check if the username is available
      // const response = await fetch('/api/check-username', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username }),
      // });

      // if (!response.ok) {
      //   throw new Error('Username is already taken');
      // }

      // Store username in localStorage
      localStorage.setItem("username", username);

      // Dispatch a storage event to notify other tabs/windows of the username change
      if (typeof window !== "undefined") {
        const storageEvent = new Event("storage");
        window.dispatchEvent(storageEvent);
      }

      onSubmit(username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your artistic alias"
          required
          disabled={isSubmitting}
        />
        <UsernameHint>
          Choose a unique name for your artistic identity in Lord
          Smearington&apos;s gallery
        </UsernameHint>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormGroup>

      <SubmitButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Username"}
      </SubmitButton>
    </FormContainer>
  );
};

const UsernameHint = styled.p`
  color: #a0aec0;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export default UsernameForm;
