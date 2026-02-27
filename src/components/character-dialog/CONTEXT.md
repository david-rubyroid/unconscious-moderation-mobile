# Character Dialog — контекст и решения

Контекст чата по компоненту диалога Buddy/Narissa: принятые решения, API, позиционирование облачков и ссылки на файлы.

---

## 1. Решения по архитектуре

- **CharacterDialogWindow — презентационный компонент:** только `View` с персонажами и облачками, без Modal, без навигации, без фона. Растягивается на весь контейнер (`flex: 1`, `width: '100%'`).
- **Контейнер и навигация — на стороне родителя:**
  - **Вариант 1 (модальное окно):** родитель оборачивает в `<Modal variant="gradient" heightPercentage={90}>` и рендерит кнопки навигации (стрелки) отдельно. Проп `heightPercentage` позволяет настроить высоту модального окна (например, 90% от высоты экрана), при этом убирается внутренний padding и контент растягивается на всю высоту.
  - **Вариант 2 (полный экран с блюром):** родитель создаёт overlay с блюром и вставляет CharacterDialogWindow внутрь.
  - **Вариант 3 (инлайн):** родитель вставляет CharacterDialogWindow в обычный контейнер (ScrollView, карточка и т.п.).
- **Кнопка закрытия:** управляется родителем (например, через backdrop Modal или кнопку X).
- **Градиент/фон:** контролируется родителем (Modal с `variant="gradient"`, overlay с блюром или фон контейнера).
- **Навигация:** стрелки и логика переключения сцен — в родителе, CharacterDialogWindow получает только текущую `scene`.
- **Облачко:** SVG из `assets/icons/buddy-dialog.tsx` и `assets/icons/narissa-dialog.tsx`. У Buddy хвостик слева (диалог справа налево), у Narissa — справа (диалог слева направо).

---

## 2. Позиционирование SpeechBubble

- Облачко располагается **над** персонажем и **двигается вместе с ним** (облачко и персонаж внутри одного `Animated.View`).
- **Buddy:** облачко слева сверху от персонажа.
- **Narissa:** облачко справа сверху от персонажа.

Стили в `dialog-character-slot.tsx`:

```ts
buddyBubble: {
  top: -verticalScale(60),
  left: -scale(70),
},
narissaBubble: {
  top: -verticalScale(40),
  right: -scale(85),
},
```

---

## 3. API компонентов

### CharacterDialogWindow

| Проп      | Тип         | Описание |
|-----------|-------------|----------|
| `scene`   | DialogScene | Текущая сцена (variant, buddy, narissa, размеры). |
| `onClose` | () => void  | Опционально. Родитель передаёт для закрытия (например, в Modal или в кнопку X). |
| `style`   | ViewStyle   | Опционально. Стиль корневого View. |

**Удалено:** `visible`, `onNext`, `onPrev`, `showNavigation`, `backgroundVariant`. Всё это контролируется родителем.

### Размеры и позиционирование

| Компонент           | Пропы                                                                 | Описание |
|---------------------|-----------------------------------------------------------------------|----------|
| **SpeechBubble**    | `width?`, `height?`                                                   | Явные размеры SVG облачка. Текст по центру (`textAlign: 'center'`, контейнер с `justifyContent`/`alignItems: 'center'`). |
| **DialogCharacterSlot** | `bubbleSize?: { width, height }`, `characterSize?: { width, height }`, `bubblePosition?: ViewStyle` | Размеры облачка и персонажа, а также позиция облачка относительно персонажа. |
| **DialogScene**     | У `buddy` и `narissa`: `bubbleSize?`, `size?`, `bubblePosition?`, `position?` | Опциональные размеры облачка, персонажа и позиционирование на уровне сцены. `position` — ViewStyle для позиционирования персонажа (напр., `{ position: 'absolute', top: 50, right: 0 }`). `bubblePosition` — ViewStyle для позиционирования облачка относительно персонажа (напр., `{ top: -60, left: -70 }`). |

---

## 4. Idle-анимация

- Синусоида через Reanimated: `translateY = amplitude * Math.sin(phase)`, цикл 1600 ms.
- **Solo:** amplitude 5; **duo:** amplitude 3.
- Учёт reduce motion через хук `useReduceMotion` (`@/hooks/use-reduce-motion`).

---

## 5. Файлы компонента

| Файл | Назначение |
|------|------------|
| `character-dialog-window.tsx` | **Презентационный View:** только персонажи и облачка, без Modal/навигации/фона. Рендерит одну сцену (`DialogScene`). |
| `dialog-character-slot.tsx`   | Слот: персонаж + облачко, idle-анимация, позиции облачка (buddyBubble / narissaBubble). |
| `speech-bubble.tsx`           | SVG облачко, пропсы width/height, центрированный текст. |
| `index.ts`                    | Реэкспорт компонентов и типов. |
| Демо: `src/app/(private)/character-dialog-demo.tsx` | Экран с примерами сцен (solo Buddy, solo Narissa, duo). Оборачивает CharacterDialogWindow в Modal, управляет навигацией и видимостью. |

---

## 6. Варианты сцен

1. **Только Buddy** — один персонаж + одно облачко.
2. **Только Narissa** — один персонаж + одно облачко.
3. **Дуэт** — оба персонажа, два облачка (Buddy справа сверху, Narissa слева снизу в layout окна).

### Пример с кастомным позиционированием

```tsx
const scene: DialogScene = {
  variant: 'duo',
  buddy: {
    text: 'We\'ll check in with you during this session.',
    size: { width: 146, height: 155 },
    bubbleSize: { width: 141, height: 100 },
    // Позиция персонажа на экране
    position: {
      position: 'absolute',
      top: verticalScale(50),
      right: scale(-10),
    },
    // Позиция облачка относительно персонажа
    bubblePosition: {
      top: -verticalScale(60),
      left: -scale(70),
    },
  },
  narissa: {
    text: 'Trust us, it really helps. We\'re here for you.',
    size: { width: 143, height: 149 },
    bubbleSize: { width: 140, height: 100 },
    // Позиция персонажа на экране
    position: {
      position: 'absolute',
      bottom: verticalScale(0),
      left: scale(0),
    },
    // Позиция облачка относительно персонажа
    bubblePosition: {
      top: -verticalScale(40),
      right: -scale(85),
    },
  },
}
```

Если `position` не указан для duo-варианта, используются дефолтные позиции из стилей компонента.
Если `bubblePosition` не указан, используются дефолтные позиции облачка относительно персонажа.
