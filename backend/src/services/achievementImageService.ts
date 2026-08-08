import sharp from 'sharp';

interface AchievementImageData {
  day: number;
  challengeTitle: string;
  difficulty: string;
  streak: number;
  xpEarned: number;
  totalXp: number;
  language: string;
  achievementTitle: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
};

export const generateAchievementImage = async (
  data: AchievementImageData
): Promise<Buffer> => {
  const {
    day,
    challengeTitle,
    difficulty,
    streak,
    xpEarned,
    totalXp,
    language,
    achievementTitle,
  } = data;

  const difficultyColor = DIFFICULTY_COLORS[difficulty] || '#6b7280';

  const svg = [
    '<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">',
    '  <defs>',
    '    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
    '      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />',
    '      <stop offset="100%" style="stop-color:#1e293b;stop-opacity:1" />',
    '    </linearGradient>',
    '    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">',
    '      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />',
    '      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />',
    '    </linearGradient>',
    '  </defs>',
    '',
    '  <!-- Background -->',
    '  <rect width="1200" height="630" fill="url(#bgGrad)" />',
    '  <rect x="0" y="0" width="1200" height="4" fill="url(#accentGrad)" />',
    '',
    '  <!-- ABTALKS Header -->',
    '  <text x="60" y="80" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="bold" fill="#3b82f6">ABTALKS</text>',
    '  <text x="175" y="80" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#94a3b8">|</text>',
    '  <text x="200" y="80" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#e2e8f0">60-Day Challenge</text>',
    '',
    '  <!-- Day Counter -->',
    '  <text x="60" y="160" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#f8fafc">Day ' + day + ' / 60</text>',
    '',
    '  <!-- Achievement Title -->',
    '  <text x="60" y="220" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#a5b4fc">' + (achievementTitle || 'Challenge Completed') + '</text>',
    '',
    '  <!-- Divider -->',
    '  <rect x="60" y="250" width="400" height="2" fill="#334155" />',
    '',
    '  <!-- Challenge Name -->',
    '  <text x="60" y="310" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#94a3b8">Challenge</text>',
    '  <text x="60" y="345" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="bold" fill="#f8fafc">' + challengeTitle + '</text>',
    '',
    '  <!-- SOLVED Badge -->',
    '  <rect x="60" y="375" width="140" height="40" rx="20" fill="#22c55e" />',
    '  <text x="130" y="401" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">SOLVED</text>',
    '',
    '  <!-- Difficulty Badge -->',
    '  <rect x="220" y="375" width="100" height="40" rx="20" fill="' + difficultyColor + '" />',
    '  <text x="270" y="401" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">' + difficulty.toUpperCase() + '</text>',
    '',
    '  <!-- Language Badge -->',
    '  <rect x="340" y="375" width="100" height="40" rx="20" fill="#6366f1" />',
    '  <text x="390" y="401" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">' + language + '</text>',
    '',
    '  <!-- Stats Panel -->',
    '  <rect x="680" y="120" width="460" height="360" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1" />',
    '',
    '  <!-- Streak Info -->',
    '  <text x="720" y="180" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">Current Streak</text>',
    '  <text x="720" y="220" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#f97316">' + streak + ' days</text>',
    '  <text x="720" y="255" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#64748b">🔥 Keep it going!</text>',
    '',
    '  <!-- XP Info -->',
    '  <rect x="720" y="285" width="380" height="1" fill="#334155" />',
    '  <text x="720" y="330" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">XP Earned</text>',
    '  <text x="720" y="370" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="bold" fill="#22c55e">+' + xpEarned + ' XP</text>',
    '',
    '  <rect x="720" y="395" width="380" height="1" fill="#334155" />',
    '  <text x="720" y="435" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">Total XP</text>',
    '  <text x="720" y="465" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="#f8fafc">' + totalXp + '</text>',
    '',
    '  <!-- Footer -->',
    '  <rect x="0" y="580" width="1200" height="50" fill="#0f172a" />',
    '  <text x="600" y="612" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">ABTalks - Building Habits, One Challenge at a Time</text>',
    '',
    '</svg>',
  ].join('\n');

  const imageBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return imageBuffer;
};
