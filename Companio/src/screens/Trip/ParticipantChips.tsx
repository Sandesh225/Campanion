import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Chip, TextInput, IconButton, HelperText } from "react-native-paper";

interface ParticipantChipsProps {
  participants: string[];
  onAdd: (participant: string) => void;
  onDelete: (participant: string) => void;
}

const ParticipantChips: React.FC<ParticipantChipsProps> = ({
  participants,
  onAdd,
  onDelete,
}) => {
  const [newParticipant, setNewParticipant] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    if (newParticipant.trim()) {
      if (participants.includes(newParticipant.trim())) {
        setError("Participant already added.");
      } else {
        onAdd(newParticipant.trim());
        setNewParticipant("");
        setError(null);
      }
    } else {
      setError("Participant name cannot be empty.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chipsContainer}>
        {participants.map((participant) => (
          <Chip
            key={participant}
            onClose={() => onDelete(participant)}
            style={styles.chip}
          >
            {participant}
          </Chip>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Add Participant"
          value={newParticipant}
          onChangeText={setNewParticipant}
          style={styles.input}
        />
        <IconButton icon="plus" size={28} onPress={handleAdd} />
      </View>
      {error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  chip: {
    margin: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
});

export default ParticipantChips;
