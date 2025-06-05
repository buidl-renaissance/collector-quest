import styled from "@emotion/styled";
import { FaMap, FaChevronDown } from "react-icons/fa";
import { MdLocationOn, MdOutlineExplore } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useCurrentCampaign } from "@/hooks/useCurrentCampaign";
import { useRouter } from "next/router";
import { TeamButton } from "./TeamButton";
import { CharacterMenu } from "./CharacterMenu";

interface LocationData {
  location: string;
  village: string;
  region: string;
  nearbyPOIs: string[];
  activeQuests: number;
  description?: string;
}

interface BottomNavigationBarProps {
  locationData: LocationData;
}

export const BottomNavigationBar = ({ locationData }: BottomNavigationBarProps) => {
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const { characters, charactersLoading, currentCampaign } = useCurrentCampaign();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationButtonRef.current &&
        !locationButtonRef.current.contains(event.target as Node) &&
        isLocationExpanded
      ) {
        setIsLocationExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationExpanded]);

  const handleMapClick = () => {
    if (currentCampaign) {
      router.push(`/campaign/${currentCampaign.id}/map`);
    }
  };

  return (
    <BottomNavigation>
      <IconNavButton 
        title="Realm Map"
        onClick={handleMapClick}
      >
        <FaMap />
      </IconNavButton>
      <LocationButton 
        ref={locationButtonRef}
        expanded={isLocationExpanded}
        onClick={() => setIsLocationExpanded(!isLocationExpanded)}
        title="Current Location"
      >
        <ButtonContent>
          <MdLocationOn />
          <LocaleInfo>
            <LocaleName>{locationData.location}</LocaleName>
            <LocaleDetails>{locationData.village}, {locationData.region}</LocaleDetails>
          </LocaleInfo>
          <FaChevronDown 
            style={{ 
              transform: isLocationExpanded ? 'rotate(180deg)' : 'none',
              fontSize: '0.8rem'
            }} 
          />
        </ButtonContent>
        <AnimatePresence>
          {isLocationExpanded && (
            <LocationDetails
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DetailRow>
                <MdOutlineExplore />
                <strong>{locationData.location}</strong>
              </DetailRow>
              <DetailRow>
                <span>{locationData.village}</span>
                <span>•</span>
                <span>{locationData.region}</span>
              </DetailRow>
              <DetailRow>
                <span>{locationData.nearbyPOIs.length} Points of Interest</span>
                <span>•</span>
                <span>{locationData.activeQuests} Quests</span>
              </DetailRow>
              {locationData.description && (
                <DescriptionRow>
                  {locationData.description}
                </DescriptionRow>
              )}
            </LocationDetails>
          )}
        </AnimatePresence>
      </LocationButton>
      <TeamButton characters={characters || []} loading={charactersLoading} />
      <CharacterMenu size="small" />
    </BottomNavigation>
  );
};

const BottomNavigation = styled.div`
  display: grid;
  grid-template-columns: 40px calc(100% - 120px - 1.5rem) 40px 40px;
  gap: 0.5rem;
  align-items: center;
  height: 60px;
  padding: 0.5rem;
  background: rgba(26, 26, 46, 0.95);
  border-top: 1px solid rgba(187, 137, 48, 0.3);
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
`;

const IconNavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  position: relative;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    color: #f5cc50;
    border-color: #f5cc50;
    background: #221e1c;
  }
`;

const LocationButton = styled.button<{ expanded: boolean }>`
  display: flex;
  flex-direction: column;
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  width: auto;
  height: 40px;
  align-items: center;
  position: relative;

  &:hover {
    color: #f5cc50;
    border-color: #f5cc50;
    background: #221e1c;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.5rem;
  height: 100%;
  width: 100%;
  font-size: 1rem;

  svg:first-of-type {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  svg:last-of-type {
    flex-shrink: 0;
  }
`;

const LocaleInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  line-height: 1.1;
  text-align: left;
`;

const LocaleName = styled.div`
  font-size: 0.8rem;
  color: #d4af37;
  font-weight: bold;
`;

const LocaleDetails = styled.div`
  font-size: 0.6rem;
  color: #d4af37;
`;

const LocationDetails = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.98);
  border: 1px solid #d4af37;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  padding: 0.5rem;
  margin-bottom: -1px;
  overflow: hidden;
  z-index: 1000;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  padding: 0.25rem 0;
  color: #fff;

  svg {
    color: #d4af37;
  }

  strong {
    color: #d4af37;
  }

  span {
    &:nth-of-type(odd) {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const DescriptionRow = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  padding: 0.5rem 0 0;
  line-height: 1.4;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  margin-top: 0.5rem;
`;