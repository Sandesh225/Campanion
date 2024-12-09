// src/utils/iconUtils.ts

export const getTravelStyleIcon = (style: string): string => {
  switch (style) {
    case "Solo Traveler":
      return "account";
    case "Family Traveler":
      return "family-tree";
    case "Backpacker":
      return "backpack";
    case "Luxury Traveler":
      return "crown";
    case "Adventure Traveler":
      return "mountain";
    // Add mappings for all travel styles
    default:
      return "airplane";
  }
};
