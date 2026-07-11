import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LANGS, useI18n } from '../i18n/engine'
import { useAuth } from '../store/auth'
import { useCart } from '../store/cart'
import { useWishlist } from '../store/wishlist'
import { THEMES } from '../theme/themes'
import { useTheme } from '../theme/ThemeContext'
import { toast } from '../toast/toast'
import type { RootStackParamList } from '../navigation/types'

type Nav = NativeStackNavigationProp<RootStackParamList>

function Badge({ count, color, on }: { count: number; color: string; on: string }) {
  if (count <= 0) return null
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.badgeTxt, { color: on }]}>{count}</Text>
    </View>
  )
}

export function AppHeader() {
  const { theme, themeId, setTheme } = useTheme()
  const { lang, setLang, t } = useI18n()
  const { authed, name, toggle } = useAuth()
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const insets = useSafeAreaInsets()
  const nav = useNavigation<Nav>()

  const onLogin = () => {
    toggle()
    toast(
      !authed
        ? { kind: 'gold', title: `Добро пожаловать, ${name}!`, text: 'Цены открыты. Система подберёт персональное предложение.' }
        : { kind: 'gold', title: 'Вы вышли', text: 'Цены снова скрыты — доступны только клиентам.' },
    )
  }

  const cycleTheme = () => {
    const next = themeId === 'noir' ? 'onyx' : 'noir'
    setTheme(next)
    const info = THEMES.find(x => x.id === next)!
    toast({ kind: 'gold', title: `Дизайн: ${info.label}`, text: info.sub })
  }

  const cycleLang = () => {
    const idx = LANGS.findIndex(l => l.id === lang)
    setLang(LANGS[(idx + 1) % LANGS.length].id)
  }

  return (
    <View
      style={[
        styles.wrap,
        { paddingTop: insets.top + 8, backgroundColor: theme.hdrbg, borderBottomColor: theme.line },
      ]}
    >
      <Pressable onPress={() => nav.navigate('Tabs')}>
        <Text
          style={[
            styles.logo,
            { color: theme.gold2, fontFamily: theme.fonts.logo, letterSpacing: themeId === 'onyx' ? 6 : 4 },
          ]}
        >
          CHASI<Text style={{ color: theme.muted }}>.UZ</Text>
        </Text>
      </Pressable>

      <View style={styles.right}>
        <Pressable onPress={cycleLang} style={[styles.pill, { borderColor: theme.line }]}>
          <Text style={[styles.pillTxt, { color: theme.gold2, fontFamily: theme.fonts.bodySemibold }]}>
            {LANGS.find(l => l.id === lang)?.label}
          </Text>
        </Pressable>
        <Pressable onPress={cycleTheme} style={[styles.pill, { borderColor: theme.line }]}>
          <Text style={[styles.pillTxt, { color: theme.gold2, fontFamily: theme.fonts.bodySemibold }]}>
            {THEMES.find(x => x.id === themeId)?.n}
          </Text>
        </Pressable>

        <Pressable onPress={() => nav.navigate('Wishlist')} hitSlop={6}>
          <Svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke={theme.gold2} strokeWidth={1.5}>
            <Path d="M12 20.5s-7.5-4.7-9.7-9.2C.9 8.5 2.2 5.4 5.2 5c1.9-.2 3.5.9 4.3 2.3L12 10l2.5-2.7C15.3 5.9 16.9 4.8 18.8 5c3 .4 4.3 3.5 2.9 6.3-2.2 4.5-9.7 9.2-9.7 9.2Z" />
          </Svg>
          <Badge count={wishCount} color={theme.gold} on={theme.ongold} />
        </Pressable>

        <Pressable onPress={() => nav.navigate('Tabs', { screen: 'Cart' } as never)} hitSlop={6}>
          <Svg viewBox="0 0 24 24" width={21} height={21} fill="none" stroke={theme.gold2} strokeWidth={1.3}>
            <Path d="M4.5 7.5h15l-1.1 11.2a1.6 1.6 0 0 1-1.6 1.45H7.2a1.6 1.6 0 0 1-1.6-1.45L4.5 7.5Z" />
            <Path d="M8.6 7.5V6.4a3.4 3.4 0 0 1 6.8 0v1.1" />
          </Svg>
          <Badge count={count} color={theme.gold} on={theme.ongold} />
        </Pressable>

        <Pressable
          onPress={onLogin}
          style={[
            styles.auth,
            {
              borderColor: theme.gold,
              backgroundColor: authed ? theme.gold : 'transparent',
              borderRadius: theme.btnrad > 0 ? 999 : 2,
            },
          ]}
        >
          <Text
            style={[
              styles.authTxt,
              { color: authed ? theme.ongold : theme.gold, fontFamily: theme.fonts.bodySemibold },
            ]}
          >
            {authed ? `${name} ✦` : t('common.login')}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  logo: { fontSize: 20 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTxt: { fontSize: 11 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTxt: { fontSize: 10, fontWeight: '700' },
  auth: { borderWidth: 1, paddingVertical: 7, paddingHorizontal: 14 },
  authTxt: { fontSize: 12, letterSpacing: 1 },
})
