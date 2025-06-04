interface TurnStep {
  type: "movement" | "action" | "bonus_action" | "end_turn" | "resolution" | "enemy_response" | "conditions" | "enemy_hp" | "map_position" | "next_player";
  description: string;
  name?: string;
  distance?: number;
  roll?: {
    dice: string;
    modifier: number;
    type: "attack" | "healing" | "damage";
  };
}

interface TurnScript {
  name: string;
  steps: TurnStep[];
}

export const playerBTurn: TurnScript = {
  name: "DM RESOLUTION for Player B",
  steps: [
    {
      type: "movement",
      description: "✅ Movement: Advanced 20ft to engage the Orc",
      distance: 20
    },
    {
      type: "action",
      name: "Longsword Attack",
      description: "🎯 Action: [Roll result] on Longsword attack, [hit/miss], [damage], [effects]",
      roll: {
        dice: "1d20",
        modifier: 6,
        type: "attack"
      }
    },
    {
      type: "bonus_action",
      name: "Second Wind",
      description: "➕ Bonus Action: Used Second Wind to heal [roll] HP",
      roll: {
        dice: "1d10",
        modifier: 4,
        type: "healing"
      }
    },
    {
      type: "enemy_response",
      description: "🧱 Environment/Enemy Response: [If triggered]"
    },
    {
      type: "conditions",
      description: "🧾 Conditions: [Apply any effects]"
    },
    {
      type: "enemy_hp",
      description: "📉 Enemy HP: [If visible]"
    },
    {
      type: "map_position",
      description: "🗺️ Map Position Updated: [Optional grid note]"
    },
    {
      type: "end_turn",
      description: "🔚 End of Player B's Turn"
    },
    {
      type: "next_player",
      description: "🎯 Next up: [Next Player], you're on deck!"
    }
  ]
};
