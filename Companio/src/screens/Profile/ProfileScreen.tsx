// src/screens/Profile/ProfileScreen.tsx

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  Linking,
  Animated,
} from "react-native";
import { Text, Button, Avatar, Card, IconButton } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import ProfilePicture from "../../components/ProfilePicture";
import PhotoGallery from "../../components/mistake/PhotoGallery";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { ApiResponse, UserProfile } from "../../types/api";
import CustomAppBar from "../../components/common/CustomAppBar";
import { showToast } from "../../utils/toast";

const { width } = Dimensions.get("window");

const ProfileScreen: React.FC = () => {
  const { logout, userId } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity value

  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<ApiResponse<UserProfile>>(
          `/users/${userId}`
        );
        if (response.data.success) {
          setProfile(response.data.data);
          // Start fade-in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        } else {
          console.error("Failed to fetch profile:", response.data.message);
          showToast("error", "Error", "Failed to load profile.");
        }
      } catch (error: any) {
        console.error("Profile fetch error:", error);
        showToast("error", "Error", "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, fadeAnim]);

  const handleLogout = async () => {
    await logout();
  };

  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          showToast("info", "Cancelled", "Image selection was cancelled.");
        } else if (response.errorMessage) {
          showToast("error", "Error", response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const { uri } = response.assets[0];
          if (uri) {
            uploadProfilePicture(uri);
          }
        }
      }
    );
  };

  const uploadProfilePicture = async (uri: string) => {
    if (!userId) return;

    setUploading(true);

    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("profilePicture", {
        uri,
        name: filename,
        type,
      });

      const response = await api.post<{
        success: boolean;
        data: { profilePictureUrl: string };
      }>(`/users/${userId}/profile/picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                profile: {
                  ...prev.profile,
                  profilePictureUrl: response.data.data.profilePictureUrl,
                },
              }
            : prev
        );
        showToast("success", "Success", "Profile picture updated!");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Profile picture upload error:", error);
      showToast("error", "Error", "Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <CustomAppBar title="Profile" canGoBack={true} />
        <Text>No profile data available.</Text>
        <Button onPress={handleLogout} style={styles.button}>
          Logout
        </Button>
      </View>
    );
  }

  // Safely destructure preferences
  const {
    fullName,
    profilePictureUrl,
    bio,
    preferences = { travelStyles: [], interests: [], activities: [] },
    settings,
    badges = [],
  } = profile.profile;

  // Mock statistics data (replace with actual data from backend)
  const statistics = {
    totalTrips: 15,
    destinationsVisited: 30,
    matchesMade: 20,
    upcomingTrips: 5,
  };

  // Mock data for charts (replace with actual data)
  const tripData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [5, 6, 4, 7, 5, 6],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Trips Over Months"], // optional
  };

  return (
    <View style={styles.container}>
      <CustomAppBar title="Profile" canGoBack={false} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Section */}
        <Animated.View style={[styles.headerSection, { opacity: fadeAnim }]}>
          <Avatar.Image
            size={100}
            source={{
              uri: profilePictureUrl || "https://via.placeholder.com/100",
            }}
          />
          <IconButton
            icon="camera"
            size={24}
            style={styles.cameraIcon}
            onPress={pickImage}
            accessibilityLabel="Edit Profile Picture"
          />
          <Text style={styles.fullName}>{fullName}</Text>
          <Text style={styles.bioText}>{bio || "World Explorer"}</Text>
          <View style={styles.badgeContainer}>
            {badges.map((badge, index) => (
              <Avatar.Icon
                key={index}
                size={30}
                icon="check-circle"
                style={styles.badge}
                color="#4CAF50"
                accessibilityLabel={`Badge: ${badge}`}
              />
            ))}
          </View>
        </Animated.View>

        {/* Statistics/Overview Section */}
        <View style={styles.statisticsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>{statistics.totalTrips}</Text>
                <Text style={styles.statLabel}>Trips Completed</Text>
              </Card.Content>
            </Card>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {statistics.destinationsVisited}
                </Text>
                <Text style={styles.statLabel}>Destinations Visited</Text>
              </Card.Content>
            </Card>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>{statistics.matchesMade}</Text>
                <Text style={styles.statLabel}>Matches Made</Text>
              </Card.Content>
            </Card>
            <Card style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Text style={styles.statNumber}>
                  {statistics.upcomingTrips}
                </Text>
                <Text style={styles.statLabel}>Upcoming Trips</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{bio || "This is your bio..."}</Text>
          <View style={styles.interestsContainer}>
            {preferences.interests.map((interest, index) => (
              <View key={index} style={styles.interestItem}>
                <Avatar.Icon
                  size={30}
                  icon="hiking"
                  style={styles.interestIcon}
                />
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Travel Preferences Section */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Travel Preferences</Text>
          <Card style={styles.preferenceCard}>
            <Card.Title title="Favorite Destinations" />
            <Card.Content>
              {preferences.travelStyles.map((style, index) => (
                <Text key={index} style={styles.preferenceItem}>
                  • {style}
                </Text>
              ))}
            </Card.Content>
          </Card>
          <Card style={styles.preferenceCard}>
            <Card.Title title="Preferred Travel Companions" />
            <Card.Content>
              <Text style={styles.preferenceItem}>
                {settings?.privacy === "public" ? "Solo" : "Groups"}
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.preferenceCard}>
            <Card.Title title="Activity Preferences" />
            <Card.Content>
              {preferences.activities.map((activity, index) => (
                <Text key={index} style={styles.preferenceItem}>
                  • {activity}
                </Text>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Contact & Social Media Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact & Social Media</Text>
          <View style={styles.socialContainer}>
            <Button
              icon="instagram"
              mode="contained"
              style={styles.socialButton}
              onPress={() => Linking.openURL("https://instagram.com")}
              accessibilityLabel="Instagram Profile"
            >
              Instagram
            </Button>
            <Button
              icon="linkedin"
              mode="contained"
              style={styles.socialButton}
              onPress={() => Linking.openURL("https://linkedin.com")}
              accessibilityLabel="LinkedIn Profile"
            >
              LinkedIn
            </Button>
          </View>
          <Button
            mode="contained"
            icon="message"
            style={styles.connectButton}
            onPress={() =>
              Alert.alert("Connect", "Message functionality coming soon!")
            }
            accessibilityLabel="Connect with User"
          >
            Connect
          </Button>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="outlined"
            icon="account-edit"
            onPress={() => navigation.navigate("EditProfile")}
            style={styles.actionButton}
            accessibilityLabel="Edit Profile"
          >
            Edit Profile
          </Button>
          <Button
            mode="outlined"
            icon="tray-arrow-up"
            onPress={() => navigation.navigate("ManageTrips")}
            style={styles.actionButton}
            accessibilityLabel="Manage Trips"
          >
            Manage Trips
          </Button>
          <Button
            mode="outlined"
            icon="magnify"
            onPress={() => navigation.navigate("SwipeMatch")}
            style={styles.actionButton}
            accessibilityLabel="Find New Matches"
          >
            Find Matches
          </Button>
        </View>

        {/* Floating Action Button */}
        <Button
          mode="contained"
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("PlanTrip")}
          accessibilityLabel="Plan a Trip"
        >
          Plan a Trip
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "#fff",
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2E7D32",
    fontFamily: "Poppins_700Bold",
  },
  bioText: {
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
    marginTop: 5,
    fontFamily: "Poppins_400Regular",
  },
  badgeContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  badge: {
    backgroundColor: "#FFC107",
    marginHorizontal: 5,
  },
  statisticsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
    fontFamily: "Poppins_700Bold",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  statContent: {
    alignItems: "center",
    padding: 15,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    fontFamily: "Poppins_700Bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#616161",
    fontFamily: "Poppins_400Regular",
  },
  aboutSection: {
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  interestItem: {
    alignItems: "center",
    margin: 5,
  },
  interestIcon: {
    backgroundColor: "#81C784",
  },
  interestText: {
    marginTop: 5,
    fontSize: 12,
    color: "#424242",
    fontFamily: "Poppins_400Regular",
  },
  preferencesSection: {
    marginBottom: 20,
  },
  preferenceCard: {
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    marginBottom: 10,
  },
  preferenceItem: {
    fontSize: 14,
    color: "#424242",
    marginBottom: 5,
    fontFamily: "Poppins_400Regular",
  },
  contactSection: {
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#81C784",
  },
  connectButton: {
    backgroundColor: "#4CAF50",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 80,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#81C784",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#2E7D32",
  },
});

export default ProfileScreen;
