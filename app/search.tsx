import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Post from "@/components/Post";

const searchResults = [
  {
    id: "1",
    user: {
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/50",
    },
    content: "This is a sample post",
    timestamp: "2h ago",
  },
  {
    id: "2",
    user: {
      name: "Bob Johnson",
      avatar: "https://via.placeholder.com/50",
    },
    content: "Another example post",
    timestamp: "4h ago",
  },
  // Add more search results
];

const trends = [
  { id: "1", topic: "#ReactNative", countTotal: "120K" },
  { id: "2", topic: "#JavaScript", countTotal: "80K" },
  { id: "3", topic: "#TypeScript", countTotal: "50K" },
  { id: "4", topic: "#GraphQL", countTotal: "30K" },
  { id: "5", topic: "#ApolloClient", countTotal: "20K" },
  { id: "6", topic: "#Hasura", countTotal: "10K" },
  { id: "7", topic: "#Expo", countTotal: "5K" },
  { id: "8", topic: "#ReactNavigation", countTotal: "2K" },
  { id: "9", topic: "#ReactQuery", countTotal: "1K" },
  { id: "10", topic: "#ReactHooks", countTotal: "500" },
];

type SearchResult = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
};

type Trend = {
  id: string;
  topic: string;
  countTotal: string;
};

const SearchResultItem = ({ result }: { result: SearchResult }) => (
  <View style={styles.resultContainer}>
    <Image source={{ uri: result.user.avatar }} style={styles.avatar} />
    <View style={styles.resultContent}>
      <ThemedText style={styles.userName}>{result.user.name}</ThemedText>
      <ThemedText style={styles.resultText}>{result.content}</ThemedText>
      <ThemedText style={styles.timestamp}>{result.timestamp}</ThemedText>
    </View>
  </View>
);

const TrendItem = ({
  trend,
  onPress,
}: {
  trend: Trend;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.trendContainer} onPress={onPress}>
    <ThemedText style={styles.trendTopic}>{trend.topic}</ThemedText>
    <ThemedText style={styles.trendcountTotal}>
      {trend.countTotal} Posts
    </ThemedText>
  </TouchableOpacity>
);

const renderPost = ({ item }: { item: SearchResult }) => (
  <SearchResultItem result={item} />
);

export default function SearchScreen() {
  const { t } = useTranslation();
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false); // Assume a way to determine if user is premium
  const [filters, setFilters] = useState({
    showImages: true,
    showVideos: true,
    showText: true,
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    sortByDate: false,
    sortByRelevance: false,
  });

  const handleHashtagPress = (hashtag: string) => {
    setSelectedHashtag(hashtag);
  };

  const handleFilterChange = (filter: string, value: boolean) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: value }));
  };

  const handleAdvancedFilterChange = (filter: string, value: boolean) => {
    setAdvancedFilters((prevFilters) => ({ ...prevFilters, [filter]: value }));
  };

  const filteredResults = searchResults.filter((result) => {
    if (!filters.showImages && result.content.includes("image")) return false;
    if (!filters.showVideos && result.content.includes("video")) return false;
    if (!filters.showText && result.content.includes("text")) return false;
    return true;
  });

  return (
    <>
      <Stack.Screen options={{ title: "Search" }} />
      <ThemedView style={styles.container}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#ccc"
            style={styles.searchIcon}
          />
          <TextInput placeholder={t("Explore")} style={styles.searchInput} />
        </View>
        <View style={styles.filtersContainer}>
          <ThemedText>{t("Filters")}</ThemedText>
          <View style={styles.filterItem}>
            <ThemedText>{t("Show Images")}</ThemedText>
            <Switch
              value={filters.showImages}
              onValueChange={(value) => handleFilterChange("showImages", value)}
            />
          </View>
          <View style={styles.filterItem}>
            <ThemedText>{t("Show Videos")}</ThemedText>
            <Switch
              value={filters.showVideos}
              onValueChange={(value) => handleFilterChange("showVideos", value)}
            />
          </View>
          <View style={styles.filterItem}>
            <ThemedText>{t("Show Text")}</ThemedText>
            <Switch
              value={filters.showText}
              onValueChange={(value) => handleFilterChange("showText", value)}
            />
          </View>
          {isPremium && (
            <>
              <ThemedText>{t("Advanced Filters")}</ThemedText>
              <View style={styles.filterItem}>
                <ThemedText>{t("Sort by Date")}</ThemedText>
                <Switch
                  value={advancedFilters.sortByDate}
                  onValueChange={(value) =>
                    handleAdvancedFilterChange("sortByDate", value)
                  }
                />
              </View>
              <View style={styles.filterItem}>
                <ThemedText>{t("Sort by Relevance")}</ThemedText>
                <Switch
                  value={advancedFilters.sortByRelevance}
                  onValueChange={(value) =>
                    handleAdvancedFilterChange("sortByRelevance", value)
                  }
                />
              </View>
            </>
          )}
        </View>
        <FlatList
          data={trends}
          renderItem={({ item }) => (
            <TrendItem
              trend={item}
              onPress={() => handleHashtagPress(item.topic)}
            />
          )}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<ThemedText style={styles.trendsHeader}>
            {t("Trends for you")}
          </ThemedText>}
          style={styles.trendsList}
        />
        <FlatList
          data={filteredResults}
          renderItem={({ item }) => (
            <Post
              id={item.id}
              avatar={item.user.avatar}
              name={item.user.name}
              username={item.user.name} // Assuming username is the same as name
              time={item.timestamp}
              content={item.content}
              likes={0} // Assuming default value
              reposts={0} // Assuming default value
              replies={0} // Assuming default value
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {

  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginVertical: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
  },
  trendsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  trendsList: {
    marginBottom: 16,
  },
  trendContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  trendTopic: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trendcountTotal: {
    color: "gray",
  },
  resultContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  resultContent: {
    width: "100%",
  },
  userName: {
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 16,
    marginTop: 4,
  },
  timestamp: {
    color: "gray",
    marginTop: 5,
  },
  filtersContainer: {
    marginVertical: 16,
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
});
