import React from 'react';
import styled from '@emotion/styled';
import { Attack } from '@/data/attacks';

const AttackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const AttackHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
  font-weight: bold;
  color: #f5e6d3;
  font-size: 0.9rem;
  gap: 0.5rem;
  padding: 0.25rem 0;
  border-bottom: 1px solid #a77d3e;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    gap: 0.25rem;
    padding: 0.15rem 0;
  }
`;

const AttackItem = styled.div`
  border-bottom: 1px solid #a77d3e;
  &:last-child {
    border-bottom: none;
  }
`;

const AttackDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.25rem;
  background-color: #7e6230;
  border-radius: 0.25rem;

  @media (max-width: 768px) {
    gap: 0.15rem;
    padding: 0.15rem;
  }
`;

const AttackInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #f5e6d3;
  padding: 0.25rem 0;

  @media (max-width: 768px) {
    gap: 0.25rem;
    font-size: 0.7rem;
    padding: 0.15rem 0;
  }
`;

const AttackDescription = styled.div`
  font-size: 0.8rem;
  color: #f5e6d3;
  font-style: italic;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

interface AttacksProps {
  attacks: Attack[];
}

const Attacks: React.FC<AttacksProps> = ({ attacks }) => {
  if (!attacks || attacks.length === 0) return null;
  return (
    <AttackList>
      <AttackHeader>
        <span>Name</span>
        <span>Element</span>
        <span>Type</span>
      </AttackHeader>
      {attacks.map((attack, index) => (
        <AttackItem key={index}>
          <AttackDetails>
            <AttackInfo>
              <span>{attack.name}</span>
              <span>{attack.element}</span>
              <span>{attack.attackType}</span>
            </AttackInfo>
            <AttackDescription>{attack.effect}</AttackDescription>
          </AttackDetails>
        </AttackItem>
      ))}
    </AttackList>
  );
};

export default Attacks;
