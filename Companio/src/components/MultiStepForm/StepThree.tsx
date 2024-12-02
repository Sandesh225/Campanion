// frontend/src/components/MultiStepForm/StepThree.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, RadioButton} from 'react-native-paper';
import {useFormikContext} from 'formik';

import {FormData} from '../../types/form'; // Import FormData

const StepThree: React.FC<{nextStep: () => void; prevStep: () => void}> = ({
  nextStep,
  prevStep,
}) => {
  const {values, setFieldValue, errors, touched} = useFormikContext<FormData>();

  const handlePrivacyChange = (value: string) => {
    setFieldValue('settings.privacy', value);
  };

  const handleNotificationsChange = (
    type: keyof FormData['settings']['notifications'],
    value: boolean,
  ) => {
    setFieldValue(`settings.notifications.${type}`, value);
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Settings
      </Text>

      <Text style={styles.subtitle}>Profile Privacy</Text>
      <RadioButton.Group
        onValueChange={handlePrivacyChange}
        value={values.settings.privacy}>
        <View style={styles.radioContainer}>
          <RadioButton value="public" />
          <Text>Public</Text>
        </View>
        <View style={styles.radioContainer}>
          <RadioButton value="private" />
          <Text>Private</Text>
        </View>
      </RadioButton.Group>
      {touched.settings?.privacy && errors.settings?.privacy && (
        <Text style={styles.errorText}>{errors.settings.privacy}</Text>
      )}

      <Text style={styles.subtitle}>Notifications</Text>
      <View style={styles.checkboxContainer}>
        <Button
          mode={
            values.settings.notifications.emailNotifications
              ? 'contained'
              : 'outlined'
          }
          onPress={() =>
            handleNotificationsChange(
              'emailNotifications',
              !values.settings.notifications.emailNotifications,
            )
          }
          style={styles.toggleButton}>
          Email Notifications
        </Button>
      </View>
      <View style={styles.checkboxContainer}>
        <Button
          mode={
            values.settings.notifications.pushNotifications
              ? 'contained'
              : 'outlined'
          }
          onPress={() =>
            handleNotificationsChange(
              'pushNotifications',
              !values.settings.notifications.pushNotifications,
            )
          }
          style={styles.toggleButton}>
          Push Notifications
        </Button>
      </View>

      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={prevStep} style={styles.button}>
          Back
        </Button>
        <Button mode="contained" onPress={handleNext} style={styles.button}>
          Submit
        </Button>
      </View>
    </View>
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
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginVertical: 5,
  },
  toggleButton: {
    width: '100%',
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

export default StepThree;
