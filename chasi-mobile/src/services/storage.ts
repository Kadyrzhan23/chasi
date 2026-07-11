import AsyncStorage from '@react-native-async-storage/async-storage'

/* ============ Обёртки над AsyncStorage (JSON) ============
   Единая точка для персистентности. Все ключи хранят JSON.
   Ошибки чтения/парсинга не роняют приложение — возвращаем fallback. */

export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* переполнение / недоступность хранилища — молча пропускаем */
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key)
  } catch {
    /* noop */
  }
}
