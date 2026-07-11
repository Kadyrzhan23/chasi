import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

/* Временная заглушка экрана. Реальное наполнение появится
   в соответствующей сессии переноса (см. ROADMAP.md). */
export function Placeholder({ title, session }: { title: string; session: string }) {
  const { theme } = useTheme()
  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      contentContainerStyle={styles.wrap}
    >
      <Text style={[styles.label, { color: theme.gold, fontFamily: theme.fonts.bodySemibold }]}>
        CHASI.UZ
      </Text>
      <Text
        style={[
          styles.title,
          {
            color: theme.text,
            fontFamily: theme.fonts.display,
            textTransform: theme.uppercaseHeadings ? 'uppercase' : 'none',
          },
        ]}
      >
        {title}
      </Text>
      <View style={[styles.badge, { borderColor: theme.line }]}>
        <Text style={[styles.badgeText, { color: theme.muted, fontFamily: theme.fonts.body }]}>
          Экран будет реализован · {session}
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  label: { fontSize: 12, letterSpacing: 3 },
  title: { fontSize: 34, textAlign: 'center' },
  badge: { borderWidth: 1, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, marginTop: 8 },
  badgeText: { fontSize: 12.5, letterSpacing: 0.5 },
})
