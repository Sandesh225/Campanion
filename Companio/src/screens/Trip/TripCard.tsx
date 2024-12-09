// src/components/Trip/TripCard.tsx

import React from "react";
import { StyleSheet } from "react-native";
import { Card, Avatar, Text, Button } from "react-native-paper";
import { Trip } from "../../types";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate("TripDetails", { tripId: trip._id })}
    >
      <Card.Title
        title={trip.title}
        subtitle={`${new Date(
          trip.startDate
        ).toLocaleDateString()} - ${new Date(
          trip.endDate
        ).toLocaleDateString()}`}
        left={(props) => <Avatar.Icon {...props} icon="airplane" />}
      />
      <Card.Content>
        <Text numberOfLines={2}>{trip.description}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() =>
            navigation.navigate("TripDetails", { tripId: trip._id })
          }
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
  },
});

export default TripCard;
