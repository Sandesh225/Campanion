// frontend/src/components/Common/ProgressIndicator.tsx

import React from 'react';
import {ProgressBar, Text} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = currentStep / totalSteps;

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={progress}
        color="#6200ee"
        style={styles.progressBar}
      />
      <Text style={styles.text}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 8,
    borderRadius: 4,
  },
  text: {
    marginTop: 5,
    color: '#333',
  },
});

export default ProgressIndicator;
