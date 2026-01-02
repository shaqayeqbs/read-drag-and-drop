# 🍕 Online Restaurant - Multilingual Food Ordering App

A modern, touch-enabled drag-and-drop food ordering application with comprehensive features including internationalization, authentication, category filtering, and order management.

## ✨ Features

### 🌍 **Internationalization (i18n)**

- Full bilingual support (English/Persian)
- Vazir font for Persian text
- RTL/LTR layout switching
- Localized number formatting and date display

### 🔐 **Authentication System**

- User registration and login
- Session management
- Protected cart operations
- User-specific order history

### 📱 **Category Navigation**

- Interactive tab selector for food categories
- Filter by: Pizza, Burgers, Pasta, Salads, Drinks, Desserts, Cafe, Sandwiches
- Smooth category switching with icons

### 🛒 **Enhanced Shopping Cart**

- Touch-enabled drag & drop
- Quantity management with visual feedback
- Real-time total calculation
- Cart persistence per user session

### 📦 **Order Management**

- Complete order flow
- Order history and status tracking
- Order status: Pending → Confirmed → Preparing → Ready → Delivered
- User-specific order filtering

### 🎨 **Modern UI/UX**

- Blue-based color scheme (no more orange!)
- Optimized smaller images (300x200px)
- Smooth animations and transitions
- Mobile-responsive design
- Touch-optimized interactions

### 🚀 **Performance Features**

- Optimized image sizes
- Smooth drag & drop animations
- Touch delay for better scrolling
- Prevent rapid successive actions

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom scrollbars
- **Drag & Drop**: @dnd-kit/core (touch-enabled)
- **Internationalization**: react-i18next + i18next
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Authentication**: Better Auth (mock implementation)

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd drag-and-drop

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:5174/
```

## 📱 Testing on Mobile

To test on mobile devices:

```bash
# Start server with network access
npm run dev -- --host

# Access from mobile browser using your network IP
# Example: http://192.168.1.xxx:5174/
```

## 🌟 Usage Guide

### Authentication

1. Click "Login" in the top navigation
2. Use demo credentials: `test@test.com` / `password`
3. Or register a new account

### Ordering Food

1. Browse categories using the tab selector
2. **Drag & Drop**: Long press and drag items to cart
3. **Click**: Use "Add to Cart" button on each item
4. Adjust quantities in the cart
5. Complete order with checkout button

### Language Switching

- Click the language toggle (EN/فا) in navigation
- Interface switches between English and Persian
- Layout adjusts for RTL/LTR automatically

### Order History

- Access via "My Orders" button (requires login)
- View past orders with status tracking
- See order details and totals

## 🎯 Demo Credentials

**Email**: test@test.com  
**Password**: password

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.tsx   # Login/Register modal
│   ├── Cart.tsx        # Shopping cart
│   ├── CategoryTabs.tsx # Category selector
│   ├── MenuItemCard.tsx # Food item card
│   ├── Navigation.tsx   # Top navigation
│   └── OrderModal.tsx   # Order history
├── data/
│   └── menuData.ts     # Menu items database
├── i18n/
│   ├── locales/        # Translation files
│   │   ├── en.json    # English translations
│   │   └── fa.json    # Persian translations
│   └── index.ts       # i18n configuration
├── lib/
│   └── auth.ts        # Authentication setup
├── types.ts           # TypeScript definitions
├── App.tsx           # Main application
└── main.tsx          # Entry point
```

## 🌈 Color Scheme

- **Primary**: Blue (#3b82f6)
- **Secondary**: Dark Blue (#1e40af)
- **Accent**: Light Blue (#60a5fa)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)

## 📝 Troubleshooting

### Port Issues

If port 5173 is in use, Vite automatically tries 5174, 5175, etc.

### Font Loading

Vazir font is loaded from Google Fonts. Check internet connection if Persian text doesn't display correctly.

### Touch Issues

Ensure your device supports touch events. Desktop testing can be done with Chrome DevTools device simulation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile and desktop
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Ordering! 🍕✨**
