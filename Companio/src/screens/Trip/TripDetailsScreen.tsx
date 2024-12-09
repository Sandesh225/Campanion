// src/screens/Trip/TripDetailsScreen.tsx

import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Card, Button, ActivityIndicator } from "react-native-paper";
import {
  useRoute,
  useNavigation,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import api from "../../services/api";
import { Trip, ApiResponse } from "../../types";
import PageLayout from "../../components/common/PageLayout";
import { showToast } from "./../../utils/helpers";

type TripDetailsRouteProp = RouteProp<RootStackParamList, "TripDetails">;
const handleDeleteTrip = async () => {
  Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          const response = await api.delete<ApiResponse<null>>(
            `/trips/${tripId}`
          );
          if (response.data.success) {
            showToast("success", "Trip Deleted", "Your trip has been deleted.");
            navigation.navigate("Dashboard");
          } else {
            showToast(
              "error",
              "Delete Failed",
              response.data.message || "Failed to delete trip."
            );
          }
        } catch (error: any) {
          console.error("Delete trip error:", error);
          showToast(
            "error",
            "Delete Failed",
            error.message || "Failed to delete trip."
          );
        }
      },
    },
  ]);
};
const TripDetailsScreen: React.FC = () => {
  const route = useRoute<TripDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { tripId } = route.params;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTripDetails = async () => {
    try {
      const response = await api.get<ApiResponse<Trip>>(`/trips/${tripId}`);
      if (response.data.success) {
        setTrip(response.data.data);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to fetch trip details."
        );
      }
    } catch (error: any) {
      console.error("Fetch trip details error:", error);
      Alert.alert("Error", "Failed to fetch trip details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, []);

  if (loading) {
    return (
      <PageLayout title="Trip Details">
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      </PageLayout>
    );
  }

  if (!trip) {
    return (
      <PageLayout title="Trip Details">
        <View style={styles.container}>
          <Text>No trip data available.</Text>
        </View>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Trip Details">
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title={trip.title}
            subtitle={`${new Date(
              trip.startDate
            ).toLocaleDateString()} - ${new Date(
              trip.endDate
            ).toLocaleDateString()}`}
          />
          <Card.Content>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text>{trip.description}</Text>

            <Text style={styles.sectionTitle}>Origin</Text>
            <Text>{trip.origin}</Text>

            <Text style={styles.sectionTitle}>Destination</Text>
            <Text>{trip.destination}</Text>

            <Text style={styles.sectionTitle}>Travel Mode</Text>
            <Text>{trip.travelMode}</Text>

            {trip.budget && (
              <>
                <Text style={styles.sectionTitle}>Budget</Text>
                <Text>
                  {trip.budget.currency} {trip.budget.amount}
                </Text>
              </>
            )}

            {/* Add more trip details as needed */}
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => navigation.navigate("TripCreation")}>
              Edit Trip
            </Button>
            <Button onPress={() => navigation.navigate("Dashboard")}>
              Back to Dashboard
            </Button>
            <Button onPress={handleDeleteTrip} color="red">
              Delete Trip
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2E7D32",
  },
});

export default TripDetailsScreen;
