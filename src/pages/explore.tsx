import { useState } from "react";
import styled from "@emotion/styled";
import PageTransition from "@/components/PageTransition";
import Page from "@/components/Page";
import { Title, Subtitle } from "@/components/styled/typography";
import {
  Section,
  Grid,
  GridItem,
  ItemTitle,
  ItemDescription,
  FeaturedGrid,
  FeaturedItem,
  FeaturedTitle,
  FeaturedDescription,
  FeaturedIcon,
} from "@/components/styled/section";
import { CTAButton } from "@/components/styled/buttons";

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-size: cover;
  background-position: center;
  color: white;
  padding: 1rem;
`;

const RiddleCard = styled(GridItem)`
  position: relative;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LockIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export default function ExplorePage() {
  const [activeRiddles] = useState([
    { id: 1, status: "locked", unlockDate: "June 6 @ Noon" },
    { id: 2, status: "locked", unlockDate: "June 13 @ Noon" },
    { id: 3, status: "locked", unlockDate: "June 20 @ Noon" },
    { id: 4, status: "locked", unlockDate: "June 27 @ Noon" },
    { id: 5, status: "locked", unlockDate: "July 4 @ Noon" },
  ]);

  return (
    <PageTransition>
      <Page>
        <HeroSection>
          <Title>Unlock the Golden Tickets. Become a Collector.</Title>
          <Subtitle>
            A city-wide mural quest powered by art, riddles, and magic.
          </Subtitle>
          <CTAButton
            onClick={() =>
              document
                .getElementById("riddles")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start the Hunt
          </CTAButton>
        </HeroSection>

        <Section>
          <Title>How It Works</Title>
          <Grid>
            <GridItem>
              <ItemTitle>Solve the Riddle</ItemTitle>
              <ItemDescription>Read clues tied to a mural</ItemDescription>
            </GridItem>
            <GridItem>
              <ItemTitle>Find the Location</ItemTitle>
              <ItemDescription>
                Explore the city and visit the mural
              </ItemDescription>
            </GridItem>
            <GridItem>
              <ItemTitle>Tap to Unlock</ItemTitle>
              <ItemDescription>
                Use your GPS location to try the unlock
              </ItemDescription>
            </GridItem>
            <GridItem>
              <ItemTitle>Earn a Golden Ticket</ItemTitle>
              <ItemDescription>
                Win digital entries, collectibles, and prizes
              </ItemDescription>
            </GridItem>
          </Grid>
        </Section>

        <Section id="riddles">
          <Title>Riddle Vault</Title>
          <Grid>
            {activeRiddles.map((riddle) => (
              <RiddleCard key={riddle.id}>
                <LockIcon>🔒</LockIcon>
                <ItemTitle>Riddle #{riddle.id}</ItemTitle>
                <ItemDescription>Unlocks: {riddle.unlockDate}</ItemDescription>
              </RiddleCard>
            ))}
          </Grid>
        </Section>

        <Section>
          <Title>What Do You Win?</Title>
          <FeaturedGrid>
            <FeaturedItem>
              <FeaturedIcon>🧿</FeaturedIcon>
              <FeaturedTitle>Golden Ticket</FeaturedTitle>
              <FeaturedDescription>
                $10 tickets to be redeemed at art raffles
              </FeaturedDescription>
            </FeaturedItem>
            <FeaturedItem>
              <FeaturedIcon>🎨</FeaturedIcon>
              <FeaturedTitle>Art Night Invites</FeaturedTitle>
              <FeaturedDescription>
                Invites to exclusive art nights and events
              </FeaturedDescription>
            </FeaturedItem>
            <FeaturedItem>
              <FeaturedIcon>🧰</FeaturedIcon>
              <FeaturedTitle>Game Items</FeaturedTitle>
              <FeaturedDescription>
                Exclusive COLLECTOR QUEST items
              </FeaturedDescription>
            </FeaturedItem>
          </FeaturedGrid>
        </Section>

        <Section center>
          <Title>Think You Can Solve the City?</Title>
          <Subtitle>
            Magic is hidden in plain sight. Only the clever will claim the gold.
          </Subtitle>
          <CTAButton>Join the Quest</CTAButton>
        </Section>
      </Page>
    </PageTransition>
  );
}
