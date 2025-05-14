import React from 'react';
import styled from '@emotion/styled';

const HitDiceBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #7e6230;
  border-radius: 0.25rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
    padding: 0.25rem;
    margin-bottom: 0.5rem;
  }
`;

const HitDiceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #f5e6d3;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

interface HitDiceProps {
  hitDice: {
    current: string | number;
    type: string;
    bonus: number;
  };
}

const HitDice: React.FC<HitDiceProps> = ({ hitDice }) => {
  if (!hitDice) return null;
  return (
    <HitDiceBox>
      <HitDiceInfo>
        <span>Hit Dice:</span>
        <span>{hitDice.current}</span>
      </HitDiceInfo>
      <HitDiceInfo>
        <span>Type:</span>
        <span>{hitDice.type}</span>
      </HitDiceInfo>
      <HitDiceInfo>
        <span>Constitution Bonus:</span>
        <span>{hitDice.bonus >= 0 ? '+' : ''}{hitDice.bonus}</span>
      </HitDiceInfo>
    </HitDiceBox>
  );
};

export default HitDice;
