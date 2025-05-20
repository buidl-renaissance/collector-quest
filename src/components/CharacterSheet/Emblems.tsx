import React from "react";
import styled from "@emotion/styled";
import Emblem from "./Emblem";
import { DetailedAbilityScores } from "@/lib/generateAbilities";

interface EmblemsProps {
  abilitiesScores: DetailedAbilityScores;
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

const Emblems: React.FC<EmblemsProps> = ({ abilitiesScores }) => {
  return (
    <Grid columns={2} gap="0.75rem" style={{ alignItems: "flex-start" }}>
      {Object.entries(abilitiesScores).map(([ability, scores]) => (
        <Emblem
          key={ability}
          statName={ability}
          modifier={scores.modifier}
          value={scores.total}
        />
      ))}
    </Grid>
  );
};

export default Emblems;
