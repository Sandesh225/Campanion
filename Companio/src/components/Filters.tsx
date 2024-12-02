// frontend/src/components/Filters.tsx

import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Chip, Button} from 'react-native-paper';

interface FiltersProps {
  onApply: (filters: {interests: string[]; activities: string[]}) => void;
}

const availableInterests = [
  'Hiking',
  'Photography',
  'Cooking',
  'Reading',
  'Traveling',
  'Music',
  'Fitness',
  'Gaming',
  'Art',
  'Technology',
];

const availableActivities = [
  'Mountain Biking',
  'Yoga',
  'Painting',
  'Cycling',
  'Running',
  'Swimming',
  'Dancing',
  'Coding',
  'Writing',
  'Gardening',
];

const Filters: React.FC<FiltersProps> = ({onApply}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest],
    );
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(item => item !== activity)
        : [...prev, activity],
    );
  };

  const applyFilters = () => {
    onApply({interests: selectedInterests, activities: selectedActivities});
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Filter Interests"
        mode="outlined"
        editable={false}
        value=""
        style={styles.input}
      />
      <View style={styles.chipsContainer}>
        {availableInterests.map(interest => (
          <Chip
            key={interest}
            selected={selectedInterests.includes(interest)}
            onPress={() => toggleInterest(interest)}
            style={styles.chip}>
            {interest}
          </Chip>
        ))}
      </View>

      <TextInput
        label="Filter Activities"
        mode="outlined"
        editable={false}
        value=""
        style={styles.input}
      />
      <View style={styles.chipsContainer}>
        {availableActivities.map(activity => (
          <Chip
            key={activity}
            selected={selectedActivities.includes(activity)}
            onPress={() => toggleActivity(activity)}
            style={styles.chip}>
            {activity}
          </Chip>
        ))}
      </View>

      <Button mode="contained" onPress={applyFilters} style={styles.button}>
        Apply Filters
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
  button: {
    marginTop: 10,
  },
});

export default Filters;
