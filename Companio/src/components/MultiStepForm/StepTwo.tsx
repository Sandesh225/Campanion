// frontend/src/components/MultiStepForm/StepTwo.tsx

import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button, Text, Checkbox} from 'react-native-paper';
import {useFormikContext} from 'formik';

import {FormData} from '../../types/form'; // Import FormData

const availableTravelStyles = [
  'Adventure',
  'Leisure',
  'Cultural',
  'Backpacking',
  'Luxury',
];
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

const StepTwo: React.FC<{nextStep: () => void; prevStep: () => void}> = ({
  nextStep,
  prevStep,
}) => {
  const {values, setFieldValue, errors, touched} = useFormikContext<FormData>();

  const toggleSelection = (
    section: keyof FormData['preferences'],
    item: string,
  ) => {
    const current = values.preferences[section];
    if (current.includes(item)) {
      setFieldValue(
        `preferences.${section}`,
        current.filter((i: string) => i !== item),
      );
    } else {
      setFieldValue(`preferences.${section}`, [...current, item]);
    }
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.title}>
          Your Preferences
        </Text>

        <Text style={styles.subtitle}>Travel Styles</Text>
        {availableTravelStyles.map(style => (
          <View key={style} style={styles.checkboxContainer}>
            <Checkbox
              status={
                values.preferences.travelStyles.includes(style)
                  ? 'checked'
                  : 'unchecked'
              }
              onPress={() => toggleSelection('travelStyles', style)}
            />
            <Text>{style}</Text>
          </View>
        ))}
        {touched.preferences?.travelStyles &&
          errors.preferences?.travelStyles && (
            <Text style={styles.errorText}>
              {errors.preferences.travelStyles}
            </Text>
          )}

        <Text style={styles.subtitle}>Interests</Text>
        {availableInterests.map(interest => (
          <View key={interest} style={styles.checkboxContainer}>
            <Checkbox
              status={
                values.preferences.interests.includes(interest)
                  ? 'checked'
                  : 'unchecked'
              }
              onPress={() => toggleSelection('interests', interest)}
            />
            <Text>{interest}</Text>
          </View>
        ))}
        {touched.preferences?.interests && errors.preferences?.interests && (
          <Text style={styles.errorText}>{errors.preferences.interests}</Text>
        )}

        <Text style={styles.subtitle}>Activities</Text>
        {availableActivities.map(activity => (
          <View key={activity} style={styles.checkboxContainer}>
            <Checkbox
              status={
                values.preferences.activities.includes(activity)
                  ? 'checked'
                  : 'unchecked'
              }
              onPress={() => toggleSelection('activities', activity)}
            />
            <Text>{activity}</Text>
          </View>
        ))}

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={prevStep} style={styles.button}>
            Back
          </Button>
          <Button mode="contained" onPress={handleNext} style={styles.button}>
            Next
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default StepTwo;
