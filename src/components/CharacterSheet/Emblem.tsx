import React from 'react';
import styled from '@emotion/styled';

interface EmblemProps {
  statName: string;
  modifier: number | string;
  value: number | string;
}

const EmblemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  height: 80px;
  background: #2e1e0f;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  border: 2px solid #a77d3e;
  position: relative;
  font-family: 'Cinzel', serif;
  margin: auto;
  margin-bottom: 1.25rem;
  color: #d6b87b;
  padding: 0.5rem 0.25rem;
`;

const StatName = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-top: 0;
  margin-bottom: 2px;
  text-align: center;
  text-transform: uppercase;
  color: #d6b87b;
`;

const Modifier = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0.1rem 0;
  text-align: center;
  color: #d6b87b;
  margin-top: -0.4rem;
  margin-right: 0.6rem;
`;

const ValueOval = styled.div`
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 24px;
  background: #7e6230;
  border: 2px solid #a77d3e;
  border-radius: 50% / 45%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0,0,0,0.15);
  color: #f5e6d3;
  padding: 0.1rem;
`;

export const Emblem: React.FC<EmblemProps> = ({ statName, modifier, value }) => (
  <EmblemContainer>
    <StatName>{statName}</StatName>
    <Modifier>{modifier}</Modifier>
    <ValueOval>{value}</ValueOval>
  </EmblemContainer>
);

export default Emblem;
