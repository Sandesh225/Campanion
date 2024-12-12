// src/components/home/SearchBarSection.tsx

import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { showInfoToast, showErrorToast } from "../../utils/toast";

const SearchBarSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = useCallback(
    (query: string) => setSearchQuery(query),
    []
  );

  const onSubmitSearch = useCallback(() => {
    if (searchQuery.trim()) {
      showInfoToast("Search", `Searching for "${searchQuery}"`);
      // Implement search functionality here, e.g., navigate to a search results screen
    } else {
      showErrorToast("Empty Search", "Please enter a search term.");
    }
  }, [searchQuery]);

  return (
    <Searchbar
      placeholder="Search for companions or activities..."
      onChangeText={onChangeSearch}
      value={searchQuery}
      onSubmitEditing={onSubmitSearch}
      style={styles.searchbar}
      accessibilityLabel="Search Bar"
      accessibilityHint="Search for companions or activities"
    />
  );
};

const styles = StyleSheet.create({
  searchbar: {
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default React.memo(SearchBarSection);
