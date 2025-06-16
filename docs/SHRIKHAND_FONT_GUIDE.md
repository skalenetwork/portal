# Shrikhand Font Implementation Guide

## Overview
This document provides comprehensive guidance on using the Shrikhand font across all browsers with reliable fallbacks.

## What's Implemented

### 1. HTML Head Optimizations (`index.html`)
- **Preconnect**: Establishes early connection to Google Fonts
- **Preload**: Critical font file preloading for faster rendering
- **Font-face**: Inline font-face declaration with proper fallbacks
- **Utility class**: `.font-shrikhand` for easy application

### 2. SCSS Font Utilities (`src/styles/fonts.scss`)
- **Font variables**: Consistent font stacks
- **Utility classes**: `.font-shrikhand`, `.font-shrikhand-title`, `.font-shrikhand-display`
- **Responsive classes**: `.shrikhand-responsive` with clamp() sizing
- **Performance optimizations**: Font loading with `font-display: swap`

### 3. TypeScript Utilities (`src/utils/fontUtils.ts`)
- **FontChecker class**: Programmatic font loading and checking
- **React hook**: `useShrikhandFont()` for component-level font management
- **CSS-in-JS styles**: Ready-to-use style objects
- **Font constants**: `SHRIKHAND_FONT_STACK` for consistency

## Usage Examples

### 1. CSS Classes
```html
<!-- Basic Shrikhand -->
<h1 class="font-shrikhand">Welcome to SKALE</h1>

<!-- Display style (optimized for large text) -->
<h1 class="font-shrikhand-display">SKALE Portal</h1>

<!-- Responsive sizing -->
<h1 class="shrikhand-responsive">Responsive Title</h1>
```

### 2. SCSS Variables
```scss
.my-title {
  font-family: $font-shrikhand-stack;
  font-size: 2rem;
}

.my-display {
  @extend .font-shrikhand-display;
  color: #93B8EC;
}
```

### 3. React with TypeScript
```tsx
import { useShrikhandFont, shrikhandStyles, SHRIKHAND_FONT_STACK } from '@/utils/fontUtils';

function MyComponent() {
  const { isLoaded, isLoading, error } = useShrikhandFont();
  
  return (
    <h1 style={shrikhandStyles.display}>
      {isLoading ? 'Loading...' : 'SKALE Portal'}
    </h1>
  );
}

// Or using the font stack directly
const titleStyle = {
  fontFamily: SHRIKHAND_FONT_STACK,
  fontSize: '2.5rem'
};
```

### 4. Programmatic Font Loading
```typescript
import { FontChecker } from '@/utils/fontUtils';

// Check if font is available
const isLoaded = await FontChecker.isShrikhandLoaded();

// Ensure font is loaded before proceeding
await FontChecker.ensureShrikhandLoaded(() => {
  console.log('Shrikhand font is ready!');
});

// Apply to existing elements
FontChecker.applyShrikhandToElements('.my-title');
```

## Browser Compatibility

### Supported Browsers
- ✅ **Chrome 38+**: Full support with WOFF2
- ✅ **Firefox 39+**: Full support with WOFF2
- ✅ **Safari 14+**: Full support with WOFF2
- ✅ **Edge 18+**: Full support with WOFF2
- ✅ **iOS Safari 14+**: Full support
- ✅ **Android Chrome 90+**: Full support

### Fallback Strategy
1. **Primary**: `'Shrikhand'` (Google Fonts)
2. **Secondary**: `cursive` (system cursive fonts)
3. **Tertiary**: `'Comic Sans MS'` (widely available)
4. **Quaternary**: `'Trebuchet MS'` (Windows/Mac fallback)
5. **Final**: `fantasy, sans-serif` (system fallbacks)

### Legacy Browser Support
- **IE 11**: WOFF format with graceful degradation
- **Older Android**: WOFF format support
- **Legacy iOS**: System font fallbacks

## Performance Optimizations

### 1. Font Loading Strategy
- **Preload**: Critical font files loaded early
- **Font-display: swap**: Prevents invisible text during font load
- **Resource hints**: Preconnect to font CDN

### 2. Fallback Prevention
- **Local font checking**: Programmatic verification
- **Graceful degradation**: Multiple fallback fonts
- **Loading states**: React hook provides loading feedback

### 3. Caching
- **Google Fonts CDN**: Automatic browser caching
- **Long cache headers**: 1-year font file caching
- **Version-specific URLs**: Cache busting when needed

## Troubleshooting

### Common Issues

1. **Font not loading**
   ```typescript
   // Check browser console for CORS or network errors
   FontChecker.isShrikhandLoaded().then(loaded => {
     console.log('Shrikhand loaded:', loaded);
   });
   ```

2. **Invisible text during load**
   - Ensure `font-display: swap` is applied
   - Use loading states in React components

3. **Inconsistent rendering**
   - Use the provided font stack consistently
   - Avoid mixing different font declarations

### Debug Tools
```typescript
// Check what fonts are actually loaded
console.log([...document.fonts].map(f => f.family));

// Check if specific font is available
console.log(document.fonts.check('1em Shrikhand'));

// Force font load
FontChecker.loadShrikhandFont()
  .then(() => console.log('Loaded!'))
  .catch(console.error);
```

## Best Practices

1. **Consistency**: Use the provided utilities rather than custom declarations
2. **Performance**: Preload only critical font weights/styles
3. **Accessibility**: Ensure sufficient contrast with Shrikhand text
4. **Responsive**: Use `clamp()` or responsive classes for scalable text
5. **Fallbacks**: Always include the full fallback stack
6. **Testing**: Test across different browsers and connection speeds

## Migration Guide

If you're updating existing Shrikhand usage:

1. Replace direct font-family declarations:
   ```scss
   // Old
   font-family: 'Shrikhand', sans-serif;
   
   // New
   font-family: $font-shrikhand-stack;
   ```

2. Add loading states to React components:
   ```tsx
   const { isLoaded } = useShrikhandFont();
   ```

3. Use CSS classes instead of inline styles:
   ```html
   <!-- Old -->
   <h1 style="font-family: Shrikhand">Title</h1>
   
   <!-- New -->
   <h1 class="font-shrikhand-display">Title</h1>
   ```

This implementation ensures Shrikhand fonts work reliably across all modern browsers with proper fallbacks and performance optimizations.
