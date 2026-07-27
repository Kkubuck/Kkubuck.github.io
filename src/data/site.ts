export const SITE = {
  name: 'Kkubuck',
  title: 'Kkubuck — Computer Vision Research Notes',
  tagline: 'Paper reviews and research notes in computer vision.',
  description:
    'Paper reviews, implementation notes, and research logs on segmentation, remote sensing, and open-vocabulary learning.',
  url: 'https://kkubuck.github.io',
  author: 'Jisang Lee',
  locale: 'en_US',
  github: 'https://github.com/Kkubuck',
  email: '30251274@edu.hanbat.ac.kr'
} as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/papers/', label: 'Papers' },
  { href: '/notes/', label: 'Notes' },
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' }
] as const;
