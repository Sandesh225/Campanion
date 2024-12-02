// src/utils/errorHandler.ts

import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import {Alert} from 'react-native';

export const handleError = (
  error: any,
  navigation: StackNavigationProp<RootStackParamList> | null,
) => {
  if (error.response) {
    // Server responded with a status other than 200 range
    Alert.alert('Error', error.response.data.message || 'An error occurred.');
  } else if (error.request) {
    // Request was made but no response received
    Alert.alert('Error', 'No response from server. Please try again later.');
  } else {
    // Something else happened
    Alert.alert('Error', 'An unexpected error occurred.');
  }

  // Optionally, handle specific status codes
  if (error.response?.status === 401 && navigation) {
    // Unauthorized, navigate to login
    navigation.navigate('Login');
  }
};
