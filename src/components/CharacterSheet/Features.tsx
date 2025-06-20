import React from 'react';
import styled from '@emotion/styled';
import { FeaturesTraits } from '@/data/character';
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
  featuresAndTraits: FeaturesTraits;
}

interface Feature {
  name: string;
  description: string;
}

const featureText = (feature: string | Feature) => {
  if (typeof feature === 'string') {
    return feature;
  }
  return feature.name;
};

const Features: React.FC<FeaturesProps> = ({ featuresAndTraits }) => {
  if (!featuresAndTraits) return null;
  return (
    <FeatureList>
      {featuresAndTraits.backgroundFeature && (
        <FeatureItem>{featureText(featuresAndTraits.backgroundFeature)}</FeatureItem>
      )}
      {featuresAndTraits.classFeatures.map((feature, index) => (
        <FeatureItem key={`feature-${index}`}>{featureText(feature)}</FeatureItem>
      ))}
      {featuresAndTraits.raceTraits.map((feature, index) => (
        <FeatureItem key={`feature-${index}`}>{featureText(feature)}</FeatureItem>
      ))}
      {featuresAndTraits.subclassFeatures.map((feature, index) => (
        <FeatureItem key={`feature-${index}`}>{featureText(feature)}</FeatureItem>
      ))}
      {featuresAndTraits.customFeatures.map((feature, index) => (
        <FeatureItem key={`feature-${index}`}>{featureText(feature)}</FeatureItem>
      ))}
      {featuresAndTraits.description && (
        <FeatureItem>{featuresAndTraits.description}</FeatureItem>
      )}
    </FeatureList>
  );
};

export default Features;
