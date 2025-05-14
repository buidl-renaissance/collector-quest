import React from 'react';
import styled from '@emotion/styled';

const SkillCheckbox = styled.input`
  width: 1rem;
  height: 1rem;
  background-color: #2e1e0f;
  border: 1px solid #a77d3e;

  @media (max-width: 768px) {
    width: 0.85rem;
    height: 0.85rem;
  }
`;

interface Skill {
  name: string;
  proficient: boolean;
}

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  if (!skills || skills.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem' }}>
      {skills.map((skill) => (
        <div
          key={skill.name}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <SkillCheckbox type="checkbox" checked={skill.proficient} readOnly />
          <span>{skill.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Skills;
