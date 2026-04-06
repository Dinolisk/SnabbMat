# SnabbMat - Snabba Recept App

En mobilapp för snabba och enkla recept på svenska. Perfekt för vardagsmat som går snabbt att laga!

## Funktioner

- 🏠 **Hem** - Översikt med populära recept och kategorier
- 📋 **Recept** - Sök och filtrera recept efter kategori
- ❤️ **Favoriter** - Spara dina favoritrecept
- 👤 **Profil** - Inställningar och appinformation

## Teknisk Stack

- **React Native** med Expo
- **TypeScript** för typsäkerhet
- **React Navigation** för navigation
- **AsyncStorage** för lokalt lagring av favoriter
- **Expo Vector Icons** för ikoner

## Installation

1. **Installera Node.js** (version 16 eller senare)
2. **Installera Expo CLI**:
   ```bash
   npm install -g @expo/cli
   ```

3. **Installera dependencies**:
   ```bash
   npm install
   ```

4. **Starta utvecklingsservern**:
   ```bash
   npm start
   ```

5. **Öppna appen**:
   - Installera Expo Go-appen på din telefon
   - Skanna QR-koden som visas i terminalen
   - Eller tryck 'a' för Android emulator eller 'i' för iOS simulator

## Projektstruktur

```
src/
├── screens/          # App-skärmar
│   ├── HomeScreen.tsx
│   ├── RecipeListScreen.tsx
│   ├── FavoritesScreen.tsx
│   └── ProfileScreen.tsx
├── data/             # Receptdata
│   └── recipes.ts
└── types/            # TypeScript-typer
    └── Recipe.ts
```

## Receptkategorier

- 🍝 Snabb Pasta
- 🥘 Wok & Stek
- 🥗 Sallader
- 🍲 Snabba Soppor
- 🥞 Frukost
- 🥪 Mellanmål

## Utveckling

Appen är byggd med moderna React Native-praxis:
- TypeScript för bättre kodkvalitet
- Komponentbaserad arkitektur
- Responsiv design
- Lokal lagring av användardata

## Nästa Steg

- [ ] Lägg till detaljerad receptvy
- [ ] Implementera favoritfunktionalitet
- [ ] Lägg till fler recept
- [ ] Förbättra sökfunktionen
- [ ] Lägg till bilder för recept
- [ ] Implementera receptdeling

## Licens

© 2024 SnabbMat - Alla rättigheter förbehållna
