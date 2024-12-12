// src/screens/NearbyActivities/NearbyActivitiesScreen.tsx

import React, { useEffect } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { useGetNearbyActivitiesQuery } from "../../api/authApi";
import { showErrorToast, showInfoToast } from "../../utils/toast";
import useAppSelector from "../../hooks/useAppSelector";
import { selectAuthUser } from "../../features/authSlice";
import Loading from "../../components/Loading";
import { Activity } from "../../types/Activity";

const NearbyActivitiesScreen: React.FC = () => {
  const user = useAppSelector(selectAuthUser);
  const { data, error, isLoading } = useGetNearbyActivitiesQuery(
    user?.id || "",
    {
      skip: !user?.id,
    }
  );

  useEffect(() => {
    if (error) {
      showErrorToast(
        "Error",
        error?.data?.message || "Failed to fetch nearby activities."
      );
    }
  }, [error]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error fetching activities.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={data?.data || []}
      keyExtractor={(item: Activity) => item.id}
      renderItem={({ item }: { item: Activity }) => (
        <Card style={styles.card}>
          <Card.Title title={item.name} />
          <Card.Content>
            <Text>{item.description}</Text>
            <Text>Location: {item.location}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              onPress={() => showInfoToast("Join", `Joined ${item.name}`)}
              accessibilityLabel={`Join ${item.name} Button`}
            >
              Join
            </Button>
          </Card.Actions>
        </Card>
      )}
    />
  );
};

export default NearbyActivitiesScreen;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  card: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
