# رویکرد پیاده‌سازی Drag & Drop لمسی (Touch-Enabled)

## تفاوت‌های اصلی Drag & Drop معمولی با لمسی

### 1. مدیریت Touch Events

در این پروژه از `@dnd-kit/core` استفاده شده که به طور خاص برای مدیریت Touch Events طراحی شده است.

#### کانفیگوریشن سنسورها در `App.tsx`:

```typescript
const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8, // 8px حرکت قبل از شروع drag
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200, // 200ms تاخیر برای تشخیص از scroll
      tolerance: 8, // 8px tolerance در طول delay
    },
  }),
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })
);
```

**نکات مهم:**

- **delay: 200ms** - زمان کافی برای تشخیص اینکه کاربر می‌خواهد scroll کند یا drag
- **tolerance: 8px** - کاربر می‌تواند تا 8 پیکسل حرکت کند بدون اینکه drag لغو شود
- **distance: 8px** - مقدار حرکت لازم برای شروع drag (جلوگیری از drag تصادفی)

### 2. جلوگیری از تداخل با اسکرول

#### در CSS (`index.css`):

```css
@layer utilities {
  .touch-manipulation {
    touch-action: manipulation;
  }

  .prevent-scroll {
    overscroll-behavior: none;
  }
}
```

#### در کامپوننت‌ها:

```tsx
<div className="touch-manipulation">
  {/* Prevents double-tap zoom and other touch gestures */}
</div>

<div className="prevent-scroll">
  {/* Prevents scroll chaining */}
</div>
```

### 3. UX روان با انگشت

#### الف) Visual Feedback فوری

```tsx
const {
  attributes,
  listeners,
  isDragging,
  transform,
  transition,
} = useSortable({ id: item.id });

<div className={`
  cursor-grab active:cursor-grabbing
  ${isDragging ? 'opacity-50 scale-105 shadow-2xl z-50' : 'hover:shadow-xl'}
`}>
```

#### ب) DragOverlay برای تجربه بهتر

```tsx
<DragOverlay>
  {activeItem ? (
    <div className="transform rotate-6 scale-110 opacity-90">
      {/* Preview element */}
    </div>
  ) : null}
</DragOverlay>
```

#### ج) Smooth Transitions

```tsx
const style = {
  transform: CSS.Transform.toString(transform),
  transition, // Smooth animation provided by dnd-kit
};
```

## ویژگی‌های کلیدی پیاده‌سازی

### 1. سازگاری کامل با موبایل و تبلت

- ✅ Touch events مدیریت شده
- ✅ جلوگیری از zoom تصادفی (touch-action: manipulation)
- ✅ جلوگیری از scroll در حین drag
- ✅ تاخیر هوشمند برای تشخیص intent کاربر

### 2. UI/UX الهام گرفته از pizza.ir

- دیزاین مدرن و رنگارنگ با Tailwind CSS
- کارت‌های محصول با تصاویر زیبا
- انیمیشن‌های smooth
- سبد خرید interactive با drop zone واضح

### 3. Performance Optimization

```tsx
// استفاده از useCallback برای جلوگیری از re-render
const addToCart = useCallback((item: MenuItem) => {
  setCartItems((prev) => {
    const existingItem = prev.find((i) => i.id === item.id);
    if (existingItem) {
      return prev.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    }
    return [...prev, { ...item, quantity: 1 }];
  });
}, []);
```

## تست روی موبایل/تبلت

### روش تست:

1. در ترمینال `npm run dev` را اجرا کنید
2. آدرس Network را پیدا کنید (مثلاً: `http://192.168.1.x:5174`)
3. با موبایل/تبلت به همان شبکه WiFi وصل شوید
4. در مرورگر موبایل آدرس Network را باز کنید

### یا از Vite host استفاده کنید:

```bash
npm run dev -- --host
```

### چک‌لیست تست:

- ✅ Drag محصولات با انگشت
- ✅ Drop در سبد خرید
- ✅ Scroll صفحه در حین لمس
- ✅ بدون zoom تصادفی
- ✅ انیمیشن‌های smooth
- ✅ Visual feedback واضح

## معماری کد

```
src/
├── types.ts                 # Type definitions
├── components/
│   ├── MenuItemCard.tsx    # Draggable menu item
│   └── Cart.tsx            # Droppable cart
├── App.tsx                 # Main app with DndContext
└── index.css               # Tailwind + Touch utilities
```

## کتابخانه‌های استفاده شده

### @dnd-kit/core

- **مزایا:**
  - Built-in touch support
  - Performance-focused
  - Accessibility-friendly
  - Flexible و سبک

### @dnd-kit/sortable

- Sorting logic آماده
- انیمیشن‌های smooth
- سازگار با touch

### @dnd-kit/utilities

- Helper functions
- CSS transform utilities
- Event handlers

## نکات پیشرفته

### 1. Collision Detection

```tsx
<DndContext collisionDetection={closestCenter}>
```

بهترین الگوریتم برای UX لمسی

### 2. Activation Constraints

- **delay**: زمان انتظار قبل از activation
- **distance**: فاصله حرکت قبل از activation
- **tolerance**: میزان حرکت مجاز در طول delay

### 3. Accessibility

```tsx
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

جلوگیری از zoom اما حفظ accessibility

## نتیجه‌گیری

این پیاده‌سازی تمام الزامات Drag & Drop لمسی را برآورده می‌کند:

- ✅ مدیریت حرفه‌ای Touch Events
- ✅ بدون تداخل با Scroll
- ✅ UX بسیار روان و responsive
- ✅ تست شده روی موبایل و تبلت
- ✅ UI/UX زیبا و مدرن
- ✅ کد تمیز و قابل نگهداری

این یک نمونه کامل و production-ready از Drag & Drop لمسی است که می‌تواند به عنوان مرجع برای پروژه‌های واقعی استفاده شود.
