import React from "react";
import styled from "@emotion/styled";
import Emblem from "./Emblem";

interface EmblemsProps {
  abilities: Record<string, number>;
}

const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 1}, 1fr);
  gap: ${(props) => props.gap || "0.75rem"};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    margin-top: 0.5rem;
  }
`;

const Emblems: React.FC<EmblemsProps> = ({ abilities }) => {
  const getAbilityModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <Grid columns={2} gap="0.75rem" style={{ alignItems: "flex-start" }}>
      {Object.entries(abilities).map(([ability, score]) => (
        <Emblem
          key={ability}
          statName={ability}
          modifier={getAbilityModifier(score)}
          value={score}
        />
      ))}
    </Grid>
  );
};

export default Emblems;
