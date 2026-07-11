import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../theme/ThemeContext'
import { onToast, ToastMsg } from './toast'

/* ============ Хост тостов (нативные всплывающие уведомления) ============
   Слушает toast() и показывает карточку сверху с анимацией
   появления/исчезновения. Стиль зависит от темы. */

const SHOW_MS = 5200

export function ToastHost() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const [msg, setMsg] = useState<ToastMsg | null>(null)
  const anim = useRef(new Animated.Value(0)).current
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const off = onToast(t => {
      setMsg(t)
      if (timer.current) clearTimeout(timer.current)
      Animated.timing(anim, { toValue: 1, duration: 320, useNativeDriver: true }).start()
      timer.current = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 320, useNativeDriver: true }).start()
      }, SHOW_MS)
    })
    return () => {
      off()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [anim])

  if (!msg) return null
  const isTg = msg.kind !== 'gold'
  const head = msg.channel ?? (isTg ? '✈ Telegram · CHASI.UZ Bot' : '✦ CHASI.UZ')

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          top: insets.top + 8,
          opacity: anim,
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.panel2,
            borderColor: isTg ? theme.line2 : theme.gold,
            borderRadius: theme.rad > 0 ? 16 : 4,
          },
        ]}
      >
        <Text style={[styles.head, { color: isTg ? theme.muted : theme.gold, fontFamily: theme.fonts.bodySemibold }]}>
          {head}
        </Text>
        <Text style={[styles.title, { color: theme.text, fontFamily: theme.fonts.bodySemibold }]}>
          {msg.title}
        </Text>
        <Text style={[styles.text, { color: theme.muted, fontFamily: theme.fonts.body }]}>
          {msg.text}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, zIndex: 100 },
  card: { borderWidth: 1, padding: 14, gap: 4 },
  head: { fontSize: 11, letterSpacing: 0.5 },
  title: { fontSize: 14 },
  text: { fontSize: 12.5, lineHeight: 18 },
})
