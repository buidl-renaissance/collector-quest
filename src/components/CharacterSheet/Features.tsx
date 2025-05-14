import React from 'react';
import styled from '@emotion/styled';

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FeatureItem = styled.div`
  font-size: 0.875rem;
  color: #f5e6d3;
  padding: 0.25rem 0;
  border-bottom: 1px solid #a77d3e;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

interface FeaturesProps {
  features: string[];
}

const Features: React.FC<FeaturesProps> = ({ features }) => {
  if (!features || features.length === 0) return null;
  return (
    <FeatureList>
      {features.map((feature, index) => (
        <FeatureItem key={`feature-${index}`}>{feature}</FeatureItem>
      ))}
    </FeatureList>
  );
};

export default Features;
