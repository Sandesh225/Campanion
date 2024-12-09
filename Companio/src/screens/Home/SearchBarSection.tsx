// src/screens/Home/SearchBarSection.tsx

import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

const SearchBarSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query: string) => setSearchQuery(query);

  return (
    <Searchbar
      placeholder="Search for companions or activities..."
      onChangeText={onChangeSearch}
      value={searchQuery}
      style={styles.searchbar}
    />
  );
};

const styles = StyleSheet.create({
  searchbar: {
    marginHorizontal: 16,
    borderRadius: 8,
  },
});

export default SearchBarSection;
