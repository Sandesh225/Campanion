// src/components/Badges.tsx

import React, { useEffect, useState, useContext } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { Card, Avatar, Text } from "react-native-paper";
import api from "../services/api";
import { Badge, ApiResponse } from "../types/api";
import { useAuth } from "../hooks/useAuth"; // Custom hook to access AuthContext

const Badges: React.FC = () => {
  const { userId } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBadges = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<ApiResponse<Badge[]>>(
        `/users/${userId}/badges`
      );
      if (response.data.success) {
        setBadges(response.data.data);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error: any) {
      console.error("Fetch badges error:", error);
      Alert.alert("Error", "Failed to fetch badges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const renderItem = ({ item }: { item: Badge }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        subtitle={item.description}
        left={(props) => (
          <Avatar.Icon {...props} icon={item.iconUrl || "badge"} />
        )}
      />
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading badges...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={badges}
      keyExtractor={(item) => item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No badges earned yet.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
});

export default Badges;
