import React from 'react';
import styled from '@emotion/styled';
import { FaSpinner, FaUserPlus } from 'react-icons/fa';
import AddressDisplay from './AddressDisplay';
import { Character } from '@/data/character';

interface RegisterCharacterProps {
  character: Character;
  isRegistering: boolean;
  error: string | null;
  registeredCharacterId: string | null;
  onRegister: () => Promise<void>;
  onCopyId: (id: string) => void;
}

const RegisterCharacter: React.FC<RegisterCharacterProps> = ({
  character,
  isRegistering,
  error,
  registeredCharacterId,
  onRegister,
  onCopyId,
}) => {
  if (registeredCharacterId) {
    return (
      <RegisterSection>
        <RegisterTitle>Character Registered!</RegisterTitle>
        <RegisterDescription>
          Your character has been successfully registered on the blockchain. 
          You can now create artifacts, join realms, and begin your journey.
        </RegisterDescription>
        <AddressDisplay
          address={registeredCharacterId}
          label="Character ID"
          onCopy={() => onCopyId(registeredCharacterId)}
          explorerUrl={`https://suiscan.xyz/testnet/object/${registeredCharacterId}/tx-blocks`}
        />
      </RegisterSection>
    );
  }

  return (
    <RegisterSection>
      <RegisterTitle>Begin Your Quest</RegisterTitle>
      <RegisterDescription>
        Register your character to begin your journey. Create and discover 
        artifacts, join realms, and forge your legacy.
      </RegisterDescription>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <RegisterButton onClick={onRegister} disabled={isRegistering}>
        {isRegistering ? (
          <>
            <FaSpinner className="animate-spin" /> Registering...
          </>
        ) : (
          <>
            <FaUserPlus /> Register Character
          </>
        )}
      </RegisterButton>
    </RegisterSection>
  );
};

const RegisterSection = styled.div`
  background-color: #2d2d44;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid #4a3b6b;
  margin-top: 2rem;
  text-align: center;
`;

const RegisterTitle = styled.h3`
  color: #bb8930;
  font-family: "Cinzel", serif;
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;

const RegisterDescription = styled.p`
  color: #a89bb4;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const RegisterButton = styled.button`
  background-color: #bb8930;
  color: #1e1e2d;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-family: "Cinzel", serif;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #d4a03c;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  margin-bottom: 1rem;
  font-family: "Cormorant Garamond", serif;
`;

export default RegisterCharacter; 