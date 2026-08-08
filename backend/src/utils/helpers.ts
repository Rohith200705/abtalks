export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

export const calculateRank = (xp: number): string => {
  if (xp >= 5000) return 'Diamond';
  if (xp >= 3000) return 'Platinum';
  if (xp >= 2000) return 'Gold';
  if (xp >= 1000) return 'Silver';
  if (xp >= 500) return 'Bronze';
  return 'Rookie';
};
