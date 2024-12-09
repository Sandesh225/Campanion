import React, { useContext, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import { Card, Avatar, Text } from "react-native-paper";
import api from "../services/api";
import { Badge, ApiResponse } from "../types/api";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

const Badges: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Badge[], Error>(
    ["badges", user?.id],
    async () => {
      const res = await api.get<ApiResponse<Badge[]>>(
        `/users/${user?.id}/badges`
      );
      if (res.data.success) {
        return res.data.data;
      } else {
        throw new Error(res.data.message || "Failed to fetch badges.");
      }
    },
    {
      enabled: !!user, // Only fetch data if user exists
      onError: (err: Error) => {
        console.error("Fetch badges error:", err);
        Alert.alert("Error", "Failed to fetch badges.");
      },
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Text>Loading badges...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text>Error loading badges.</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.emptyText}>No badges earned yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title
            title={item.name}
            subtitle={item.description}
            left={(props) =>
              item.iconUrl ? (
                <Avatar.Image {...props} source={{ uri: item.iconUrl }} />
              ) : (
                <Avatar.Icon {...props} icon="badge" />
              )
            }
          />
        </Card>
      )}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#777",
  },
});

export default Badges;
