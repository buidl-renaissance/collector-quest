import React from 'react';
import styled from '@emotion/styled';

const DeathSaveBox = styled.div`
  display: flex;
  gap: 0.25rem;

  @media (max-width: 768px) {
    gap: 0.15rem;
  }
`;

const DeathSaveCheck = styled.div<{ checked?: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid ${(props) => (props.checked ? "#d6b87b" : "#a77d3e")};
  border-radius: 0.25rem;
  background-color: ${(props) => (props.checked ? "#d6b87b" : "transparent")};

  @media (max-width: 768px) {
    width: 1rem;
    height: 1rem;
    border-width: 1px;
  }
`;

interface DeathSavesProps {
  deathSaves: {
    successes: number;
    failures: number;
  };
}

const DeathSaves: React.FC<DeathSavesProps> = ({ deathSaves }) => {
  if (!deathSaves) return null;
  return (
    <div style={{ display: "inline-flex", flexDirection: "row", gap: "1rem", padding: "0.5rem" }}>
      <div>
        <div style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Successes</div>
        <DeathSaveBox>
          {[0, 1, 2].map((i) => (
            <DeathSaveCheck key={`success-${i}`} checked={i < deathSaves.successes} />
          ))}
        </DeathSaveBox>
      </div>
      <div>
        <div style={{ fontSize: "0.75rem", marginBottom: "0.25rem" }}>Failures</div>
        <DeathSaveBox>
          {[0, 1, 2].map((i) => (
            <DeathSaveCheck key={`failure-${i}`} checked={i < deathSaves.failures} />
          ))}
        </DeathSaveBox>
      </div>
    </div>
  );
};

export default DeathSaves;
