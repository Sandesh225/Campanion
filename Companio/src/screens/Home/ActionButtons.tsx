// src/components/home/ActionButtons.tsx
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MainStackParamList } from "../../types/navigation";
import { showInfoToast } from "../../utils/toast";

type ActionButtonsNavigationProp = NavigationProp<MainStackParamList>;

const ActionButtons: React.FC = () => {
  const navigation = useNavigation<ActionButtonsNavigationProp>();

  const navigateTo = useCallback(
    (screen: keyof MainStackParamList) => () => {
      navigation.navigate(screen);
      showInfoToast("Navigation", `Navigating to ${screen}`);
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="account-search"
        onPress={navigateTo("FindCompanions")}
        style={styles.button}
        accessibilityLabel="Find Companions Button"
      >
        Find Companions
      </Button>
      <Button
        mode="contained"
        icon="map-plus"
        onPress={navigateTo("PlanTrips")}
        style={styles.button}
        accessibilityLabel="Plan Trips Button"
      >
        Plan Trips
      </Button>
      <Button
        mode="contained"
        icon="compass-outline"
        onPress={navigateTo("NearbyActivities")}
        style={styles.button}
        accessibilityLabel="Nearby Activities Button"
      >
        Nearby Activities
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 30,
    paddingVertical: 8,
  },
});

export default React.memo(ActionButtons);
