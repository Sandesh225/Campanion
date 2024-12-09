// src/components/Trip/MilestoneItem.tsx

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { Milestone } from "../../types";

interface MilestoneItemProps {
  milestone: Milestone;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({ milestone }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return "airplane";
      case "accommodation":
        return "home";
      case "activity":
        return "run";
      default:
        return "dots-horizontal";
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={40} icon={getIcon(milestone.type)} />
      <View style={styles.details}>
        <Text style={styles.description}>{milestone.description}</Text>
        <Text style={styles.date}>
          {new Date(milestone.date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  details: {
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
  },
  date: {
    fontSize: 14,
    color: "#757575",
  },
});

export default MilestoneItem;
