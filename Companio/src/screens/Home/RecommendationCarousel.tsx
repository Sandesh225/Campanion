// src/components/Home/RecommendationCarousel.tsx

import React, { useCallback } from "react";
import { View, StyleSheet, FlatList, ListRenderItem } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

interface RecommendationItem {
  id: string;
  image: string;
  title: string;
  description: string;
}

const data: RecommendationItem[] = [
  {
    id: "1",
    image: "https://via.placeholder.com/200x150",
    title: "Trip to Paris",
    description: "Experience the city of love with your new companions.",
  },
  {
    id: "2",
    image: "https://via.placeholder.com/200x150",
    title: "Hiking in the Alps",
    description: "Join fellow adventurers on a hiking expedition.",
  },
  // Add more items as needed
];

const RecommendationCarousel: React.FC = () => {
  const renderItem: ListRenderItem<RecommendationItem> = useCallback(
    ({ item }) => (
      <Card style={styles.carouselCard}>
        <Card.Cover source={{ uri: item.image }} />
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
        </Card.Content>
      </Card>
    ),
    []
  );

  const keyExtractor = useCallback((item: RecommendationItem) => item.id, []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.carousel}
      initialNumToRender={3}
      windowSize={5}
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  carouselCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
  },
});

export default React.memo(RecommendationCarousel);
