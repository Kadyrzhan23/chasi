# CHASI-UZ — Бриф на hero-видео

Видео для полноэкранного hero на главной. Фон под наложенный текст, **без звука, без надписей, бесшовный луп**. Заменяет плейсхолдер `public/hero/hero.mp4`.

---

## 1. Промт для генератора видео (Runway / Kling / Veo / Sora / Pika / Hailuo)

Генераторы лучше понимают английский — промты на английском, пояснения ниже.

### 🥇 Основной вариант — макро люксовых часов (тема Noir: чёрное золото)

**Prompt:**
```
Cinematic macro shot of a luxury mechanical wristwatch on a dark matte stone surface,
extreme close-up slowly orbiting the dial, hands and polished bezel, warm golden key light
grazing the sapphire crystal and metal case, soft specular highlights, deep black background
with faint golden bokeh, shallow depth of field, slow smooth dolly-in with gentle rotation,
subtle ticking second hand, moody low-key luxury product cinematography, elegant and minimal,
photorealistic, ultra sharp, seamless loop, no text, no logo, no people
```

**Negative prompt (чего избегать):**
```
fast motion, jump cuts, flicker, text, captions, watermark, logo, brand names,
distorted or extra watch hands, cartoon, oversaturation, harsh lens flare, people, faces, hands of a person
```

**Настройки в тулзе:**
- Длительность: **8–10 c**, движение медленное и плавное (для лупа)
- Соотношение: **16:9** (десктоп) — основное
- Камера: slow orbit + лёгкий dolly-in, без резких движений
- Свет: low-key, тёплый золотой ключевой свет, глубокий чёрный фон
- Loop: включить «seamless / loopable», если есть

### 🥈 Вариант B — абстракция (безопасный, всегда выглядит дорого)
```
Abstract flowing liquid gold and black silk in slow motion, elegant swirling waves,
soft golden light reflections on a deep black background, luxury texture, macro,
shallow depth of field, seamless loop, no text, no logo, no people
```

### 🥉 Вариант C — тема Onyx (чёрный + серебро/алый)
```
Cinematic macro of a silver luxury wristwatch with deep crimson-red accents on matte black,
cool metallic reflections, a single soft red light streak sweeping across the polished case,
slow rotation, low-key moody lighting, photorealistic, seamless loop, no text, no logo, no people
```

> Совет: сгенерируй 3–4 клипа, выбери лучший по движению (медленное, без «дёрганых» стрелок и артефактов на цифрах).

---

## 2. Параметры финального файла (под текущий hero)

Hero растягивается `object-fit: cover` на весь экран, поэтому видео **обрезается** по краям — держи главный объект по центру.

| Параметр | Значение |
|---|---|
| Контейнер | **MP4 (H.264)** — базовый, максимальная совместимость |
| Доп. формат (опц.) | WebM (VP9) или MP4 (H.265) для меньшего веса |
| Разрешение | **1920×1080** (достаточно для фона); максимум 2560×1440 |
| Соотношение | 16:9 десктоп; опц. отдельный 9:16 для мобильных |
| Длительность | **8–12 c**, бесшовный луп |
| FPS | **24** (кинематографично) или 30 |
| Пиксель-формат | `yuv420p` (иначе не играет в Safari) |
| Звук | **удалить полностью** (видео muted) |
| Faststart | да (`+faststart` — старт до полной загрузки) |
| Целевой вес | **≤ 2–4 МБ** (это фон, не должен тормозить загрузку) |
| Постер | `hero-poster.webp`, первый кадр, 1440×810 |

Файлы кладём в `public/hero/`:
- `hero.mp4` — видео
- `hero-poster.webp` — постер (fallback, пока грузится видео)

Замена в коде не нужна — имена уже прописаны в `Home.tsx`.

---

## 3. Как дожать сгенерированное видео под спеку (ffmpeg)

Положи исходник как `raw.mp4` рядом и выполни:

**Основной MP4 (H.264, без звука, faststart):**
```bash
ffmpeg -y -i raw.mp4 -an \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p" \
  -r 24 -c:v libx264 -profile:v high -crf 30 -preset slow -movflags +faststart \
  public/hero/hero.mp4
```
`-crf` регулирует качество/вес: **26** — качественнее и тяжелее, **32** — легче. Целься в ≤ 4 МБ.

**Постер (первый кадр, webp):**
```bash
ffmpeg -y -i public/hero/hero.mp4 -frames:v 1 -vf "scale=1440:810" public/hero/hero-poster.webp
```

**Бесшовный луп (кроссфейд конца в начало, если стык виден), пример 10 c:**
```bash
ffmpeg -y -i raw.mp4 -an -filter_complex \
  "[0]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]" \
  -map "[v]" -r 24 -c:v libx264 -crf 30 -pix_fmt yuv420p -movflags +faststart public/hero/hero.mp4
```
(этот приём делает «туда-обратно» — движение никогда не дёргается на стыке).

**Опционально — мобильный портрет 9:16:**
```bash
ffmpeg -y -i raw.mp4 -an \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p" \
  -r 24 -c:v libx264 -crf 30 -preset slow -movflags +faststart public/hero/hero-mobile.mp4
```
(если захочешь отдельную мобильную версию — добавим `<source media="(max-width:720px)">` в разметку.)

---

## 4. Чек-лист качества (по принципам Emil / Taste)

- [ ] Движение **медленное и плавное** — hero и так делает параллакс/зум, быстрый ролик будет перегружать
- [ ] Стык лупа **не заметен** (проверь на 3–4 повторах)
- [ ] Нет артефактов на стрелках/цифрах, нет «пластилиновых» рук
- [ ] Тёмная картинка — текст поверх читается (проверь заголовок и кнопки)
- [ ] Звук удалён, `yuv420p`, faststart, вес ≤ 4 МБ
- [ ] Постер совпадает по цвету с первым кадром (без «прыжка» при старте)
