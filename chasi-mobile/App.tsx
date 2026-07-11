import { DarkTheme, NavigationContainer, Theme as NavTheme } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { I18nProvider } from './src/i18n/engine'
import { RootNavigator } from './src/navigation/RootNavigator'
import { AuthProvider } from './src/store/auth'
import { CartProvider } from './src/store/cart'
import { WishlistProvider } from './src/store/wishlist'
import { fontMap } from './src/theme/fonts'
import { ThemeProvider, useTheme } from './src/theme/ThemeContext'
import { ToastHost } from './src/toast/ToastHost'

void SplashScreen.preventAutoHideAsync()

/* Навигационная тема строится из активной темы приложения,
   чтобы фон/цвета контейнера совпадали с noir/onyx. */
function Navigation() {
  const { theme } = useTheme()
  const navTheme: NavTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: theme.bg,
      card: theme.bg2,
      text: theme.text,
      primary: theme.gold,
      border: theme.line2,
      notification: theme.gold,
    },
  }
  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
      <ToastHost />
      <StatusBar style="light" />
    </NavigationContainer>
  )
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontMap)

  const onLayout = useCallback(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync()
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) return null

  return (
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <SafeAreaProvider>
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <Navigation />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </View>
  )
}
