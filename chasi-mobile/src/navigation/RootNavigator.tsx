import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Text } from 'react-native'
import { AppHeader } from '../components/AppHeader'
import { useI18n } from '../i18n/engine'
import { useTheme } from '../theme/ThemeContext'
import AccountScreen from '../screens/AccountScreen'
import CartScreen from '../screens/CartScreen'
import CatalogScreen from '../screens/CatalogScreen'
import GiftSetsScreen from '../screens/GiftSetsScreen'
import HomeScreen from '../screens/HomeScreen'
import LoyaltyScreen from '../screens/LoyaltyScreen'
import PassportScreen from '../screens/PassportScreen'
import ProductScreen from '../screens/ProductScreen'
import WishlistScreen from '../screens/WishlistScreen'
import type { RootStackParamList, TabParamList } from './types'

const Tab = createBottomTabNavigator<TabParamList>()
const Stack = createNativeStackNavigator<RootStackParamList>()

const TAB_GLYPH: Record<keyof TabParamList, string> = {
  Home: '⌂',
  Catalog: '▤',
  GiftSets: '✦',
  Cart: '⛃',
  Account: '☰',
}

function Tabs() {
  const { theme } = useTheme()
  const { t } = useI18n()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.gold,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.bg2,
          borderTopColor: theme.line2,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: theme.fonts.body },
        tabBarIcon: ({ color }) => (
          <Text style={{ color, fontSize: 18 }}>{TAB_GLYPH[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('nav.home') }} />
      <Tab.Screen name="Catalog" component={CatalogScreen} options={{ title: t('nav.catalog') }} />
      <Tab.Screen name="GiftSets" component={GiftSetsScreen} options={{ title: t('nav.gifts') }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: t('common.cartTitle') }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: t('nav.account') }} />
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  const { theme } = useTheme()
  const { t } = useI18n()
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.bg2 },
        headerTintColor: theme.gold2,
        headerTitleStyle: { fontFamily: theme.fonts.heading, color: theme.text },
        contentStyle: { backgroundColor: theme.bg },
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} options={{ header: () => <AppHeader /> }} />
      <Stack.Screen name="Product" component={ProductScreen} options={{ title: t('product.crumb') }} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: t('wish.label') }} />
      <Stack.Screen name="Loyalty" component={LoyaltyScreen} options={{ title: t('footer.loyalty') }} />
      <Stack.Screen name="Passport" component={PassportScreen} options={{ title: 'Паспорт' }} />
    </Stack.Navigator>
  )
}
