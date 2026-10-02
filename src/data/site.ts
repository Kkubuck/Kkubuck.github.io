export const SITE = {
  name: 'Kkubuck',
  title: 'Jisang Lee — Computer Vision & Research Notes',
  tagline: 'Computer vision. Papers, connections, and notes.',
  description:
    'Paper reviews, implementation notes, and research logs on segmentation, remote sensing, and open-vocabulary learning.',
  url: 'https://kkubuck.github.io',
  author: 'Jisang Lee',
  locale: 'en_US',
  github: 'https://github.com/Kkubuck',
  email: 'nacl3084@gmail.com'
} as const;

export const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/research/', label: 'Research' },
  { href: '/papers/', label: 'Papers' },
  { href: '/reading/', label: 'Reading' },
  { href: '/about/', label: 'About' }
] as const;
