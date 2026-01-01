# How to Change the App Icon

The app icon (favicon) appears in browser tabs, bookmarks, and when sharing your app.

## Current Setup

I've added icon configuration in `app/layout.tsx` that looks for:
- `/public/icon.svg` - SVG icon (recommended, scalable)
- `/public/icon.png` - PNG icon (fallback)
- `/public/apple-icon.png` - Apple touch icon (for iOS devices)

## Option 1: Replace the SVG Icon (Recommended)

1. Create or find an SVG icon (32x32px or larger, square)
2. Replace `/public/icon.svg` with your icon file
3. Keep the same filename: `icon.svg`

**Tips for SVG icons:**
- Use a simple, recognizable design
- Keep it square (1:1 aspect ratio)
- Use solid colors or simple gradients
- Test at small sizes (16x16px) to ensure it's readable

## Option 2: Use a PNG Icon

1. Create a PNG icon (32x32px, 64x64px, or 128x128px)
2. Replace `/public/icon.png` with your PNG file
3. Keep the same filename: `icon.png`

## Option 3: Use an Online Icon Generator

1. Go to https://realfavicongenerator.net/ or https://favicon.io/
2. Upload your logo/image
3. Download the generated favicon files
4. Replace the files in `/public/` directory:
   - `icon.svg` or `icon.png`
   - `apple-icon.png` (180x180px for iOS)

## Option 4: Create Icon from Text/Emoji

You can use tools like:
- https://favicon.io/favicon-generator/ (text to icon)
- https://favicon.io/emoji-favicons/ (emoji to icon)

## Quick Test

After replacing the icon:
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. Check the browser tab - you should see your new icon

## Icon Specifications

- **SVG**: Any size, square format, simple design
- **PNG**: 32x32px minimum, 128x128px recommended
- **Apple Icon**: 180x180px PNG (for iOS home screen)

## Current Icon

The current icon is a simple document/resume icon with a checkmark. You can replace it with:
- Your logo
- A resume/document icon
- A job search related icon
- Any brand icon

