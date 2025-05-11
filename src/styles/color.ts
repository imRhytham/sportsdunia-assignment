import { MantineColorsTuple } from '@mantine/core';

export const tailwindColorsPalette = {
   primary: {
      50: '#EEF5FF',
      100: '#D9E7FF',
      200: '#BCD6FF',
      300: '#8EBDFF',
      400: '#5999FF',
      500: '#2569FF',
      600: '#1B50F5',
      700: '#143CE1',
      800: '#1731B6',
      900: '#192F8F',
      950: '#141E57',
      DEFAULT: '#2569FF',
   },
   warning: {
      25: '#FFFCF5',
      50: '#FFFAEB',
      100: '#FEF0C7',
      200: '#FEDF89',
      300: '#FEC84B',
      400: '#FDB022',
      500: '#F79009',
      600: '#DC6803',
      700: '#B54708',
      800: '#93370D',
      900: '#7A2E0E',
      DEFAULT: '#F79009',
   },
   success: {
      25: '#F6FEF9',
      50: '#ECFDF3',
      100: '#D1FADF',
      200: '#A6F4C5',
      300: '#6CE9A6',
      400: '#32D583',
      500: '#12B76A',
      600: '#039855',
      700: '#027A48',
      800: '#05603A',
      900: '#054F31',
      DEFAULT: '#12B76A',
   },
   danger: {
      25: '#FFFBFA',
      50: '#FEF3F2',
      100: '#FEE4E2',
      200: '#FECDCA',
      300: '#FDA29B',
      400: '#F97066',
      500: '#F04438',
      600: '#D92D20',
      700: '#B42318',
      800: '#912018',
      900: '#7A271A',
      DEFAULT: '#F04438',
   },
};

export type TailwindColorsPaletteKeys = keyof typeof tailwindColorsPalette;
export const mantineColorsPalette = Object.entries(tailwindColorsPalette).reduce(
   (acc, [key, colors]) => ({
      ...acc,
      [key]: Object.entries(colors)
         .filter(([k]) => k !== 'DEFAULT')
         .map(([, v]) => v),
   }),
   {} as Record<TailwindColorsPaletteKeys, MantineColorsTuple>
);
export type MantineColorsPaletteKeys = keyof typeof mantineColorsPalette;
