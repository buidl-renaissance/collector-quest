import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { FaArrowLeft, FaArrowRight, FaShoppingBag, FaCoins, FaDice, FaCheck, FaRandom } from "react-icons/fa";
import { useCharacter } from "@/hooks/useCharacter";
import { useRace } from "@/hooks/useRace";
import { useCharacterClass } from "@/hooks/useCharacterClass";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title, Subtitle } from "@/components/styled/typography";
import { BackButton, NextButton } from "@/components/styled/character";
import BottomNavigation from "@/components/BottomNavigation";
import { navigateTo } from "@/utils/navigation";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Cormorant Garamond", serif;
  animation: ${fadeIn} 0.5s ease-in;
  padding-bottom: 100px;
`;

const Section = styled.div`
  background-color: rgba(26, 26, 46, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid #bb8930;
  animation: ${slideUp} 0.5s ease-out;
`;

const SectionTitle = styled.h2`
  color: #bb8930;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EquipmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const EquipmentCard = styled.div`
  background-color: rgba(58, 38, 6, 0.4);
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid rgba(187, 137, 48, 0.5);
`;

const EquipmentCategory = styled.h3`
  color: #bb8930;
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const EquipmentList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const EquipmentItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(187, 137, 48, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const EquipmentName = styled.span`
  color: #e0e0e0;
`;

const EquipmentQuantity = styled.span`
  color: #bb8930;
  font-weight: bold;
`;

const OptionTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const OptionTab = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? 'rgba(187, 137, 48, 0.3)' : 'rgba(26, 26, 46, 0.7)'};
  color: ${props => props.active ? '#bb8930' : '#e0e0e0'};
  border: 1px solid #bb8930;
  border-radius: 4px;
  padding: 0.75rem 1.25rem;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(187, 137, 48, 0.2);
  }
`;

const GoldAmount = styled.div`
  background-color: rgba(187, 137, 48, 0.2);
  border: 1px solid #bb8930;
  border-radius: 4px;
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem;
  color: #bb8930;
  margin-bottom: 1rem;
`;

const EquipmentPage: React.FC = () => {
  const router = useRouter();
  const { character, updateCharacter, saveCharacter } = useCharacter();
  const { selectedRace, loading: raceLoading } = useRace();
  const { selectedClass, loading: classLoading } = useCharacterClass();
  const [equipmentOption, setEquipmentOption] = useState<'standard' | 'gold'>('standard');
  const [goldAmount, setGoldAmount] = useState<number>(0);
  
  // Mock equipment data - in a real app, this would come from your character data
  const standardEquipment = {
    weapons: [
      { name: "Longsword", quantity: 1 },
      { name: "Shortbow", quantity: 1 },
      { name: "Arrows", quantity: 20 }
    ],
    armor: [
      { name: "Chain Mail", quantity: 1 }
    ],
    adventuringGear: [
      { name: "Backpack", quantity: 1 },
      { name: "Bedroll", quantity: 1 },
      { name: "Mess Kit", quantity: 1 },
      { name: "Tinderbox", quantity: 1 },
      { name: "Torches", quantity: 10 },
      { name: "Rations", quantity: 10 },
      { name: "Waterskin", quantity: 1 },
      { name: "Rope, Hempen (50 feet)", quantity: 1 }
    ],
    tools: [
      { name: "Herbalism Kit", quantity: 1 }
    ],
    currency: [
      { name: "Gold Pieces", quantity: 15 }
    ]
  };

  // Generate random gold based on class
  const generateRandomGold = () => {
    // These would be based on the actual D&D rules for starting gold by class
    const goldByClass: Record<string, number> = {
      'Fighter': Math.floor(Math.random() * 4 + 2) * 10 + 100, // 5d4 × 10 gp
      'Wizard': Math.floor(Math.random() * 4 + 1) * 10 + 100,  // 4d4 × 10 gp
      'Cleric': Math.floor(Math.random() * 4 + 1) * 10 + 100,  // 5d4 × 10 gp
      'Rogue': Math.floor(Math.random() * 4 + 1) * 10 + 100,   // 4d4 × 10 gp
      // Add other classes as needed
    };
    
    // Default to a reasonable amount if class not found
    return goldByClass[selectedClass?.name || ''] || 150;
  };

  useEffect(() => {
    if (equipmentOption === 'gold' && goldAmount === 0) {
      setGoldAmount(generateRandomGold());
    }
  }, [equipmentOption]);

  // Redirect if no race or class is selected
  useEffect(() => {
    if (!raceLoading && !classLoading) {
      if (!selectedRace) {
        router.push("/character/race");
      } else if (!selectedClass) {
        router.push("/character/class");
      }
    }
  }, [selectedRace, selectedClass, raceLoading, classLoading, router]);

  const handleBack = () => {
    navigateTo(router, "/character/background");
  };

  const handleNext = async () => {
    // Save equipment choice to character
    if (equipmentOption === 'standard') {
      await updateCharacter({
        equipment: standardEquipment
      });
    } else {
      await updateCharacter({
        equipment: {
          currency: [{ name: "Gold Pieces", quantity: goldAmount }]
        }
      });
    }
    
    await saveCharacter();
    navigateTo(router, "/character/sheet");
  };

  const handleRollGold = () => {
    setGoldAmount(generateRandomGold());
  };

  if (raceLoading || classLoading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <Page width="narrow">
        <BackButton onClick={handleBack}>
          <FaArrowLeft /> Back to Background
        </BackButton>

        <Title>Starting Equipment</Title>
        <Subtitle>
          Choose how you want to equip your {selectedRace?.name} {selectedClass?.name}
        </Subtitle>

        <OptionTabs>
          <OptionTab 
            active={equipmentOption === 'standard'} 
            onClick={() => setEquipmentOption('standard')}
          >
            <FaShoppingBag /> Standard Equipment
          </OptionTab>
          <OptionTab 
            active={equipmentOption === 'gold'} 
            onClick={() => setEquipmentOption('gold')}
          >
            <FaCoins /> Starting Gold
          </OptionTab>
        </OptionTabs>

        {equipmentOption === 'standard' ? (
          <Section>
            <SectionTitle><FaShoppingBag /> Standard Equipment</SectionTitle>
            <p>Your class and background provide you with the following starting equipment:</p>
            
            <EquipmentGrid>
              <EquipmentCard>
                <EquipmentCategory>Weapons</EquipmentCategory>
                <EquipmentList>
                  {standardEquipment.weapons.map((item, index) => (
                    <EquipmentItem key={index}>
                      <EquipmentName>{item.name}</EquipmentName>
                      <EquipmentQuantity>×{item.quantity}</EquipmentQuantity>
                    </EquipmentItem>
                  ))}
                </EquipmentList>
              </EquipmentCard>
              
              <EquipmentCard>
                <EquipmentCategory>Armor</EquipmentCategory>
                <EquipmentList>
                  {standardEquipment.armor.map((item, index) => (
                    <EquipmentItem key={index}>
                      <EquipmentName>{item.name}</EquipmentName>
                      <EquipmentQuantity>×{item.quantity}</EquipmentQuantity>
                    </EquipmentItem>
                  ))}
                </EquipmentList>
              </EquipmentCard>
              
              <EquipmentCard>
                <EquipmentCategory>Adventuring Gear</EquipmentCategory>
                <EquipmentList>
                  {standardEquipment.adventuringGear.map((item, index) => (
                    <EquipmentItem key={index}>
                      <EquipmentName>{item.name}</EquipmentName>
                      <EquipmentQuantity>×{item.quantity}</EquipmentQuantity>
                    </EquipmentItem>
                  ))}
                </EquipmentList>
              </EquipmentCard>
              
              <EquipmentCard>
                <EquipmentCategory>Tools</EquipmentCategory>
                <EquipmentList>
                  {standardEquipment.tools.map((item, index) => (
                    <EquipmentItem key={index}>
                      <EquipmentName>{item.name}</EquipmentName>
                      <EquipmentQuantity>×{item.quantity}</EquipmentQuantity>
                    </EquipmentItem>
                  ))}
                </EquipmentList>
              </EquipmentCard>
              
              <EquipmentCard>
                <EquipmentCategory>Currency</EquipmentCategory>
                <EquipmentList>
                  {standardEquipment.currency.map((item, index) => (
                    <EquipmentItem key={index}>
                      <EquipmentName>{item.name}</EquipmentName>
                      <EquipmentQuantity>×{item.quantity}</EquipmentQuantity>
                    </EquipmentItem>
                  ))}
                </EquipmentList>
              </EquipmentCard>
            </EquipmentGrid>
          </Section>
        ) : (
          <Section>
            <SectionTitle><FaCoins /> Starting Gold</SectionTitle>
            <p>Instead of taking the standard equipment, you can purchase your own gear with gold pieces.</p>
            
            <GoldAmount>
              {goldAmount} gp
              <OptionTab 
                active={false} 
                onClick={handleRollGold}
                style={{ marginLeft: '1rem', padding: '0.5rem' }}
              >
                <FaDice /> Roll Again
              </OptionTab>
            </GoldAmount>
            
            <p>With this gold, you can purchase equipment from the Player&apos;s Handbook before your adventure begins.</p>
          </Section>
        )}

        <BottomNavigation
          onNext={handleNext}
          selectedItem={equipmentOption === 'standard' ? 'Standard Equipment' : `${goldAmount} Gold Pieces`}
          selectedItemLabel="Equipment"
        />
      </Page>
    </PageTransition>
  );
};

export default EquipmentPage;
