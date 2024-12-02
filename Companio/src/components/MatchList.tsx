// src/components/MatchList.tsx

import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Alert } from "react-native";
import { Card, Avatar, Text, Button } from "react-native-paper";
import api from "../services/api";
import { UserProfile, ApiResponse } from "../types/api";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import CustomAppBar from "./common/CustomAppBar";

interface MatchListProps {
  userId: string | null;
}

const MatchList: React.FC<MatchListProps> = ({ userId }) => {
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchMatches = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<ApiResponse<UserProfile[]>>("/matches", {
        params: { userId },
      });
      if (response.data.success) {
        setMatches(response.data.data);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error: any) {
      console.error("Fetch matches error:", error);
      Alert.alert("Error", "Failed to fetch matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleViewProfile = (profileId: string) => {
    navigation.navigate("Profile", { profileId });
  };

  const renderItem = ({ item }: { item: UserProfile }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.username}
        subtitle={item.profile.location}
        left={(props) => (
          <Avatar.Image
            {...props}
            source={{
              uri:
                item.profile.profilePictureUrl ||
                "https://via.placeholder.com/100",
            }}
          />
        )}
      />
      <Card.Content>
        <Text>{item.profile.bio || "No bio available."}</Text>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleViewProfile(item._id)}>
          View Profile
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading matches...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No matches found.</Text>
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

export default MatchList;
