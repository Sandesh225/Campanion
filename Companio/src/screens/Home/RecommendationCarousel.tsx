// src/components/home/RecommendationCarousel.tsx
import React, { useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { showInfoToast } from "../../utils/toast";
import { Activity } from "../../types/api";
import { useTranslation } from "react-i18next";

interface RecommendationItem extends Activity {}

const data: RecommendationItem[] = [
  {
    id: "1",
    name: "Trip to Paris",
    description: "Experience the city of love with your new companions.",
    location: "Paris, France",
  },
  {
    id: "2",
    name: "Hiking in the Alps",
    description: "Join fellow adventurers on a hiking expedition.",
    location: "Alps, Switzerland",
  },
  // Add more items as needed
];

const RecommendationCarousel: React.FC = () => {
  const { t } = useTranslation();

  const renderItem: ListRenderItem<RecommendationItem> = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() =>
          showInfoToast(t("selected"), `${t("you_selected")} ${item.name}`)
        }
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${t("select")} ${item.name}`}
      >
        <Card style={styles.card}>
          <Card.Cover source={{ uri: "https://via.placeholder.com/200x150" }} />
          <Card.Content>
            <Title>{item.name}</Title>
            <Paragraph>{item.description}</Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    ),
    [t]
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
  card: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
  },
});

export default React.memo(RecommendationCarousel);
