// frontend/src/screens/Match/MatchScreen.tsx

import React, { useEffect, useState, useContext } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import {
  Card,
  Avatar,
  Text,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import api from "../../services/api";
import { UserProfile, ApiResponse } from "../../types/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";

const MatchScreen: React.FC = () => {
  const { userId } = useContext(AuthContext);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchMatches = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<ApiResponse<UserProfile[]>>(
        "/users/matchmaking",
        {
          params: { userId },
        }
      );
      if (response.data.success) {
        setMatches(response.data.data);
      } else {
        console.error("Failed to fetch matches:", response.data.message);
        Alert.alert("Error", "Failed to fetch matches.");
      }
    } catch (error: any) {
      console.error("Error fetching matches:", error);
      Alert.alert("Error", "An error occurred while fetching matches.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const handleConnect = (matchedUserId: string) => {
    // Implement connection logic, e.g., send a request or navigate to chat
    Alert.alert("Connect", `You have connected with user ID: ${matchedUserId}`);
    navigation.navigate("Chat", { otherUserId: matchedUserId });
  };

  const renderItem = ({ item }: { item: UserProfile }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.profile.fullName}
        subtitle={`@${item.username}`}
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
        <Button onPress={() => handleConnect(item._id)}>Connect</Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No matches found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
});

export default MatchScreen;
