import React from 'react';
import styled from 'styled-components';
import { FaCheckCircle, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';

const RegistredCharacter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
  width: fit-content;

  &:hover {
    background: rgba(0, 255, 0, 0.2);
    border-color: rgba(0, 255, 0, 0.5);
  }

  svg:first-child {
    color: #00ff00;
  }

  span {
    font-family: monospace;
    font-size: 14px;
    color: #ffffff;
  }
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const ExternalLinkButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

interface AddressDisplayProps {
  address: string;
  label?: string;
  onCopy?: (address: string) => void;
  explorerUrl?: string;
  className?: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({
  address,
  label = "Address",
  onCopy,
  explorerUrl,
  className = ""
}) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    if (onCopy) {
      onCopy(address);
    }
  };

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (explorerUrl) {
      window.open(explorerUrl, "_blank");
    }
  };

  return (
    <RegistredCharacter
      className={className}
      onClick={() => handleCopy({ stopPropagation: () => {} } as React.MouseEvent)}
      data-full-id={address}
    >
      <FaCheckCircle />
      <span>
        {address.slice(0, 6)}...
        {address.slice(-4)}
      </span>
      <CopyButton
        onClick={handleCopy}
        title={`Copy ${label}`}
      >
        <FaCopy />
      </CopyButton>
      {explorerUrl && (
        <ExternalLinkButton
          onClick={handleExternalLink}
          title="View on Explorer"
        >
          <FaExternalLinkAlt />
        </ExternalLinkButton>
      )}
    </RegistredCharacter>
  );
};

export default AddressDisplay;