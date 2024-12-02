// src/components/MilestoneChips.tsx

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Chip, IconButton, Text } from "react-native-paper";

interface MilestoneChipsProps {
  milestones: string[];
  onAdd: (milestone: string) => void;
  onDelete: (milestone: string) => void;
}

const MilestoneChips: React.FC<MilestoneChipsProps> = ({
  milestones,
  onAdd,
  onDelete,
}) => {
  const [newMilestone, setNewMilestone] = useState("");

  return (
    <View>
      <View style={styles.chipsContainer}>
        {milestones.map((milestone) => (
          <Chip
            key={milestone}
            onClose={() => onDelete(milestone)}
            style={styles.chip}
          >
            {milestone}
          </Chip>
        ))}
      </View>
      <View style={styles.addContainer}>
        <TextInput
          mode="outlined"
          placeholder="Add custom milestone"
          value={newMilestone}
          onChangeText={setNewMilestone}
          style={{ flex: 1, marginRight: 8 }}
        />
        <IconButton
          icon="plus"
          onPress={() => {
            if (newMilestone.trim()) {
              onAdd(newMilestone.trim());
              setNewMilestone("");
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  chip: {
    margin: 4,
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default MilestoneChips;
