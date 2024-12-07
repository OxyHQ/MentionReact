import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Post from "@/components/Post";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { samplePosts } from "@/constants/sampleData";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: t("Home") }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>{t("Home")}</ThemedText>
          <TouchableOpacity
            style={styles.composeButton}
            onPress={() => router.push("/compose")}
          >
            <Ionicons name="create-outline" size={24} color="#1DA1F2" />
          </TouchableOpacity>
        </ThemedView>
        <FlatList
          data={samplePosts}
          renderItem={({ item }) => <Post {...item} />}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/compose")}
        >
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  composeButton: {
    backgroundColor: "#1DA1F2",
    padding: 8,
    borderRadius: 9999,
  },
  fab: {
    position: "absolute",
    bottom: 65,
    right: 16,
    backgroundColor: "#1DA1F2",
    padding: 16,
    borderRadius: 9999,
    elevation: 4,
  },
});
