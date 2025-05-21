export type ArtifactClass = "Tool" | "Weapon" | "Symbol" | "Wearable" | "Key";
export type Effect = "Reveal" | "Heal" | "Unlock" | "Boost" | "Summon";
export type Element =
  | "Fire"
  | "Water"
  | "Nature"
  | "Shadow"
  | "Light"
  | "Electric";
export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic";

export interface ArtifactProperties {
  class: ArtifactClass;
  element: Element;
  effect: Effect;
  rarity: Rarity;
  visualAsset?: string;
  passiveBonus?: string;
  activeUse?: string;
  unlockCondition?: string;
  reflectionTrigger?: string;
}

export interface Artifact {
  id: string;
  title: string;
  artist: string;
  owner?: string;
  year: string;
  medium: string;
  description: string;
  properties: ArtifactProperties;
  story: string;
  imageUrl: string;
  relicImageUrl?: string;
  created_at: string;
  updated_at: string;
}

export const getArtifact = (id: string): Artifact | undefined => {
  return mockArtifacts.find((artifact) => artifact.id === id);
};

export const mockArtifacts: Artifact[] = [
  {
    id: "artifact-001",
    title: "The Golden Chalice",
    artist: "Elara Moonwhisper",
    year: "2023",
    medium: "Digital Art",
    description:
      "A mystical chalice that glows with an inner light, revealing hidden truths to those who drink from it. Ancient runes circle its rim, telling stories of forgotten realms.",
    properties: {
      class: "Symbol",
      effect: "Reveal",
      element: "Light",
      rarity: "Epic",
      visualAsset: "The chalice appears as a softly glowing artifact in ancient temple ruins, its light pulsing gently with the player's heartbeat.",
      passiveBonus: "Truth Seeker – Enhances perception checks and reveals hidden clues in dialogue.",
      activeUse: "Illumination – Once per quest, reveals all hidden objects and passages in the current area.",
      unlockCondition: "Must be recovered from the Forgotten Catacombs after solving the Riddle of Reflections.",
      reflectionTrigger: "What truth do you fear to bring to light?"
    },
    story:
      "Legend tells that the Golden Chalice was crafted by the last High Priestess of the Luminous Order before their temple fell to darkness. She imbued it with her dying breath, ensuring that truth would always find a way to shine through deception. For centuries, it was thought lost until it appeared in the collection of a reclusive collector who claimed it spoke to him in dreams.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2023-01-15",
    updated_at: "2023-01-15",
  },
  {
    id: "artifact-002",
    title: "Ember Blade",
    artist: "Kael Fireheart",
    year: "2022",
    medium: "Oil on Canvas",
    description:
      "A sword forged in dragon's breath, its blade eternally wreathed in dancing flames. The hilt bears the mark of the ancient fire temple.",
    properties: {
      class: "Weapon",
      effect: "Boost",
      element: "Fire",
      rarity: "Rare",
      visualAsset: "The sword hangs above a volcanic forge, its blade flickering with real-time fire effects that intensify during combat.",
      passiveBonus: "Blazing Edge – Adds fire damage to all melee attacks and provides resistance to cold environments.",
      activeUse: "Dragon's Fury – Unleashes a devastating flame attack that can burn through barriers.",
      unlockCondition: "Must defeat the Guardian of Embers in single combat without using water-based abilities.",
      reflectionTrigger: "What inner fire drives you forward when all hope seems lost?"
    },
    story:
      "The Ember Blade was forged by the legendary blacksmith Kael Fireheart, who climbed the Volcanic Peaks to capture the breath of the last fire dragon. The blade has passed through the hands of many heroes, each adding to its legacy. It's said that the sword chooses its wielder, remaining cold and dull until it finds one worthy of its power.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2022-11-03",
    updated_at: "2022-11-03",
  },
  {
    id: "artifact-003",
    title: "Whispering Amulet",
    artist: "Thorne Shadowweaver",
    year: "2021",
    medium: "Mixed Media",
    description:
      "An obsidian amulet that absorbs ambient light. When worn, it allows the bearer to hear whispers from the shadow realm.",
    properties: {
      class: "Wearable",
      effect: "Reveal",
      element: "Shadow",
      rarity: "Uncommon",
      visualAsset: "The amulet hangs in a dimly lit alcove, occasionally emitting barely audible whispers when players approach.",
      passiveBonus: "Shadow Sense – Alerts the wearer to hidden enemies and traps through whispered warnings.",
      activeUse: "Veil Pierce – Temporarily reveals invisible entities and secret passages in the shadow realm.",
      unlockCondition: "Must be purchased from the Midnight Merchant who only appears during new moons.",
      reflectionTrigger: "What secrets do you keep hidden in your own shadows?"
    },
    story:
      "Created by the enigmatic Thorne Shadowweaver during a total eclipse, the Whispering Amulet serves as a conduit between worlds. Its first owner, a court advisor, rose to prominence by seemingly predicting the future—until the amulet drove him to madness with its incessant whispers. The amulet disappeared for decades before resurfacing in an antique shop where no one could explain how it arrived.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2021-08-22",
    updated_at: "2021-08-22",
  },
  {
    id: "artifact-004",
    title: "Verdant Gauntlets",
    artist: "Willow Greenmantle",
    year: "2023",
    medium: "Sculpture",
    description:
      "Gauntlets woven from living vines and flowers. They heal both the wearer and the land around them, bringing life to barren soil.",
    properties: {
      class: "Wearable",
      effect: "Heal",
      element: "Nature",
      rarity: "Rare",
      visualAsset: "The gauntlets rest on a bed of moss in a sunbeam, small flowers blooming and fading in cycles around them.",
      passiveBonus: "Life's Touch – Gradually restores health while in natural environments and improves the potency of healing items.",
      activeUse: "Renewal Surge – Creates a healing zone that restores allies and can revive fallen companions with limited health.",
      unlockCondition: "Must complete the quest to save the Ancient Grove from the spreading blight.",
      reflectionTrigger: "What would you sacrifice to heal that which you love most?"
    },
    story:
      "The Verdant Gauntlets were grown rather than made by the druid Willow Greenmantle after her homeland was ravaged by drought. She sacrificed her own life force to create them, becoming one with the ancient oak of her grove. The gauntlets have since been passed to those with pure intentions, helping to restore blighted lands across the realm. They must be kept in sunlight or they begin to wither.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2023-02-14",
    updated_at: "2023-02-14",
  },
  {
    id: "artifact-005",
    title: "Tidal Key",
    artist: "Marina Wavecaller",
    year: "2022",
    medium: "Watercolor",
    description:
      "A key made of coral and pearl that can unlock any door, but only during high tide. It smells of salt and distant shores.",
    properties: {
      class: "Key",
      effect: "Unlock",
      element: "Water",
      rarity: "Epic",
      visualAsset: "The key floats in a small pool of water that rises and falls with actual tide times, glowing brightest at high tide.",
      passiveBonus: "Ocean's Favor – Enhances swimming speed and allows underwater breathing for extended periods.",
      activeUse: "Tidal Breach – Opens any locked door or container, but can only be used when water is nearby or during rainstorms.",
      unlockCondition: "Must be retrieved from the Siren's Grotto after proving your heart's true desire to the Guardian of the Deep.",
      reflectionTrigger: "What prison holds you captive that no key can unlock?"
    },
    story:
      "Marina Wavecaller crafted the Tidal Key from coral grown at the convergence of seven ocean currents and a pearl from the deepest trench. It was commissioned by a sea captain who sought to rescue his beloved from a prison on a remote island. Though he succeeded, both were lost at sea during their escape. The key washed ashore years later, still carrying their enduring love story in its pearlescent sheen.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2022-06-30",
    updated_at: "2022-06-30",
  },
  {
    id: "artifact-006",
    title: "Thunderstrike Hammer",
    artist: "Bjorn Stormforge",
    year: "2021",
    medium: "Digital Sculpture",
    description:
      "A massive hammer that channels lightning from storm clouds. Its wielder can summon thunder with each mighty swing.",
    properties: {
      class: "Weapon",
      effect: "Summon",
      element: "Electric",
      rarity: "Epic",
      visualAsset: "The hammer stands embedded in a stone anvil, electricity crackling around it during thunderstorms or when enemies are nearby.",
      passiveBonus: "Storm's Might – Grants resistance to electric damage and adds shock effects to all attacks.",
      activeUse: "Thunder Call – Summons a localized lightning storm that strikes multiple enemies and can overload electrical mechanisms.",
      unlockCondition: "Must complete the Trials of Worthiness in the Cavern of Storms and defeat the Lightning Elemental.",
      reflectionTrigger: "Is power without restraint a blessing or a curse?"
    },
    story:
      "Bjorn Stormforge, last of the Sky Titan bloodline, crafted the Thunderstrike Hammer during a storm that lasted one hundred days. He used it to defend his mountain home against an invading army, calling down lightning that scorched the earth for miles. After his victory, Bjorn realized the hammer's power was too great and sealed it away in a cavern where only the worthy could claim it by surviving its guardian's trials.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2021-12-01",
    updated_at: "2021-12-01",
  },
  {
    id: "artifact-007",
    title: "Healer's Mortar and Pestle",
    artist: "Sage Herblight",
    year: "2023",
    medium: "Ceramic",
    description:
      "A simple clay mortar and pestle that enhances the healing properties of any herbs ground within it. Glows with a soft green light when in use.",
    properties: {
      class: "Tool",
      effect: "Heal",
      element: "Nature",
      rarity: "Common",
      visualAsset: "The mortar and pestle sits on a simple wooden table surrounded by dried herbs, occasionally releasing small puffs of green-tinted steam.",
      passiveBonus: "Herbal Wisdom – Increases the effectiveness of all crafted healing items and extends their duration.",
      activeUse: "Vital Infusion – Creates a powerful healing potion that can cure disease and neutralize poison.",
      unlockCondition: "Must help heal at least ten villagers suffering from various ailments in Greendale.",
      reflectionTrigger: "In your quest to heal others, have you neglected your own wounds?"
    },
    story:
      "Unlike many artifacts of power, the Healer's Mortar and Pestle was created with humble intentions. Sage Herblight, a village healer, crafted it from clay mixed with the soil of a sacred grove and fired it in an oven stoked with herbs. She used it to save her village from a devastating plague, working tirelessly until she herself succumbed to illness. The mortar and pestle has since passed through many hands, always finding its way to those with the gift of healing when they need it most.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2023-03-21",
    updated_at: "2023-03-21",
  },
  {
    id: "artifact-008",
    title: "Prismatic Lens",
    artist: "Iris Lightbender",
    year: "2022",
    medium: "Glass Art",
    description:
      "A crystal lens that reveals hidden messages and pathways when sunlight passes through it. Each angle shows a different hidden truth.",
    properties: {
      class: "Tool",
      effect: "Reveal",
      element: "Light",
      rarity: "Uncommon",
      visualAsset: "The lens floats in a beam of light, slowly rotating and projecting rainbow patterns that shift to reveal hidden symbols when examined.",
      passiveBonus: "Spectrum Sight – Highlights interactive objects in the environment and reveals color-based puzzles.",
      activeUse: "Truth Prism – When held up to light sources, reveals invisible writing, hidden doorways, and illusions within the area.",
      unlockCondition: "Must solve the light reflection puzzle in the abandoned Observatory Tower.",
      reflectionTrigger: "If you could see all truths at once, would you still recognize yourself?"
    },
    story:
      "Iris Lightbender spent twenty years perfecting the art of crystal manipulation before creating the Prismatic Lens. She designed it as a tool for scholars to decode ancient texts, but soon discovered it revealed far more—including doorways to places that shouldn't exist. After her mysterious disappearance while studying the lens under a solar eclipse, her workshop was sealed. The lens was later recovered by explorers who claimed they followed a path of light that appeared only at dawn.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2022-09-15",
    updated_at: "2022-09-15",
  },
  {
    id: "artifact-009",
    title: "Shadowstep Boots",
    artist: "Raven Nightwalker",
    year: "2021",
    medium: "Leather Craft",
    description:
      "Boots made from shadow-tanned leather that allow the wearer to step between shadows, crossing great distances in an instant.",
    properties: {
      class: "Wearable",
      effect: "Unlock",
      element: "Shadow",
      rarity: "Rare",
      visualAsset: "The boots rest on a pedestal surrounded by shifting shadows, occasionally disappearing and reappearing in different positions.",
      passiveBonus: "Shadow Walker – Increases stealth capabilities and muffles movement sounds.",
      activeUse: "Shadow Leap – Allows teleportation between connected shadows within line of sight.",
      unlockCondition: "Must complete the Umbral Heist quest without being detected by any guards.",
      reflectionTrigger: "What parts of yourself do you leave behind each time you escape?"
    },
    story:
      "The notorious thief Raven Nightwalker crafted these boots after stealing the shadow of a sleeping umbral dragon—a feat thought impossible. The dragon's curse ensures that wearers of the boots can never truly rest, as their own shadows occasionally move independently. Raven used the boots to perform impossible heists before vanishing completely. Some say she stepped into a shadow and found she could not step back out, trapped forever between moments.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2021-10-31",
    updated_at: "2021-10-31",
  },
  {
    id: "artifact-010",
    title: "Phoenix Feather Quill",
    artist: "Ember Ashwright",
    year: "2023",
    medium: "Mixed Media",
    description:
      "A writing quill crafted from the feather of a phoenix. Words written with it glow with inner fire and can summon small flames when read aloud.",
    properties: {
      class: "Tool",
      effect: "Summon",
      element: "Fire",
      rarity: "Uncommon",
      visualAsset: "The quill stands upright in an inkwell, occasionally writing fiery words in the air that fade after a few moments.",
      passiveBonus: "Burning Memory – Allows perfect recall of any text previously read and enhances comprehension of ancient languages.",
      activeUse: "Flame Script – Creates temporary fire constructs based on written descriptions, from light sources to small flame creatures.",
      unlockCondition: "Must recover at least five lost manuscripts from the Ashen Archives.",
      reflectionTrigger: "What knowledge would you save if all else were consumed by flames?"
    },
    story:
      "Ember Ashwright didn't create the Phoenix Feather Quill so much as discover it. While exploring the ruins of an ancient library, she found a single glowing feather in the ashes of what must have been thousands of burned books. The quill seems to have a will of its own, sometimes adding words to what its wielder intended to write. Scholars debate whether it's preserving knowledge from the lost library or creating new wisdom from the collective memory of the flames.",
    imageUrl: "/images/lord-smearington.jpg",
    created_at: "2023-04-05",
    updated_at: "2023-04-05",
  },
];
