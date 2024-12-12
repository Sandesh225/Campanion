// src/screens/FindCompanions/FindCompanionsScreen.tsx
import React, { useCallback } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import {
  Card,
  Avatar,
  Button,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useSearchUsersQuery, useLikeUserMutation } from "../../api/authApi";
import useAppSelector from "../../hooks/useAppSelector";
import { selectAuthUser } from "../../store/slices/authSlice";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { User } from "../../types/api";

const FindCompanionsScreen: React.FC = () => {
  const user = useAppSelector(selectAuthUser);
  const { data, error, isLoading, refetch } = useSearchUsersQuery({
    excludeUserId: user?.id,
  });
  const [likeUser] = useLikeUserMutation();

  const handleLike = async (likedUserId: string) => {
    try {
      await likeUser({ userId: user?.id || "", likedUserId }).unwrap();
      showSuccessToast("Liked", "You have liked this user.");
    } catch (error: any) {
      showErrorToast(
        "Like Failed",
        error?.data?.message || "Please try again."
      );
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <Card style={styles.card}>
        <Card.Title
          title={item.username}
          left={(props) => (
            <Avatar.Image
              {...props}
              source={{
                uri:
                  item.profilePictureUrl || "https://via.placeholder.com/100",
              }}
            />
          )}
        />
        <Card.Content>
          <Text>{item.bio}</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => handleLike(item.id)}>Like</Button>
        </Card.Actions>
      </Card>
    ),
    [handleLike]
  );

  const keyExtractor = useCallback((item: User) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0083FF" />
        <Text>Searching for companions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error fetching users. Please try again later.</Text>
        <Button onPress={refetch}>Retry</Button>
      </View>
    );
  }

  if (data?.data?.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No companions found. Try again later!</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContainer}
      data={data?.data || []}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={21}
      removeClippedSubviews
    />
  );
};

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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});

export default FindCompanionsScreen;
