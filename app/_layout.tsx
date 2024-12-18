import { useEffect } from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from 'expo-router';
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { Sidebar } from "@/features/sidebar";
import { Widgets } from "@/components/Widgets";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  setupNotifications,
  requestNotificationPermissions,
  scheduleDemoNotification,
} from "@/utils/notifications";
import i18n from "i18next";
import { initReactI18next, I18nextProvider, useTranslation } from "react-i18next";
import en from "../locales/en.json";
import es from "../locales/es.json";
import it from "../locales/it.json";
import { View, StyleSheet, useWindowDimensions, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomBar } from "@/components/BottomBar";

SplashScreen.preventAutoHideAsync();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    it: { translation: it },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
}).catch(error => {
  console.error("Failed to initialize i18n:", error);
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { i18n } = useTranslation();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const windowHeight = Dimensions.get('window').height;

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function initializeApp() {
      try {
        if (loaded) {
          await setupNotifications();
          const hasPermission = await requestNotificationPermissions();

          if (hasPermission) {
            await scheduleDemoNotification();
          }
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.warn("Failed to set up notifications:", error);
      }
    }

    initializeApp();
  }, [loaded]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colorScheme === "dark" ? "#000" : "#1d9bf01a",
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      width: "100%",
      marginVertical: 0,
      marginHorizontal: "auto",
      maxWidth: 1265,
    },
    mainContentWrapper: {
      width: "100%",
      margin: isTablet || isDesktop ? 16 : 0,
      borderRadius: isTablet || isDesktop ? 35 : 0,
      maxWidth: 600,
    },
    mainContent: {
      flex: 1,
      minHeight: windowHeight - 32,
    },
    flatList: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
  });

  if (!loaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {(isTablet || isDesktop) && <Sidebar />}
            <View style={styles.mainContentWrapper}>
              <Stack
                screenOptions={{
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="@[username]/index" />
                <Stack.Screen name="bookmarks/index" />
                <Stack.Screen name="compose" />
                <Stack.Screen name="messages" />
                <Stack.Screen name="explore" />
                <Stack.Screen name="settings/display" />
                <Stack.Screen name="settings/index" />
              </Stack>
            </View>
            {isDesktop && <Widgets />}
          </View>
          {!isTablet && !isDesktop && <BottomBar />}
          <StatusBar style="auto" />
        </SafeAreaView>
      </ThemeProvider>
    </I18nextProvider>
  );
}
