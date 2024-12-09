// src/components/Home/ActionButtons.tsx

import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MainStackParamList } from "../../types/navigation";

type ActionButtonsNavigationProp = NavigationProp<MainStackParamList>;

const ActionButtons: React.FC = () => {
  const navigation = useNavigation<ActionButtonsNavigationProp>();

  const navigateTo = useCallback(
    <T extends keyof MainStackParamList>(screen: T) =>
      () => {
        navigation.navigate(screen);
      },
    [navigation]
  );

  return (
    <View style={styles.actionButtonContainer}>
      <Button
        mode="contained"
        icon="account-search"
        onPress={navigateTo("FindCompanions")}
        style={styles.actionButton}
      >
        Find Companions
      </Button>
      <Button
        mode="contained"
        icon="map-plus"
        onPress={navigateTo("PlanTrips")}
        style={styles.actionButton}
      >
        Plan Trips
      </Button>
      <Button
        mode="contained"
        icon="compass-outline"
        onPress={navigateTo("NearbyActivities")}
        style={styles.actionButton}
      >
        Nearby Activities
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 30,
    paddingVertical: 8,
  },
});

export default React.memo(ActionButtons);
