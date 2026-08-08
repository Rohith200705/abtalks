import axios from 'axios';
import { encrypt, decrypt } from '../utils/crypto';

interface LinkedInConnection {
  connected: boolean;
  token?: string;
  profileUrl?: string;
  connectedAt?: string;
  status?: string;
}

interface PublishResult {
  success: boolean;
  postId?: string;
  postUrl?: string;
  status: string;
  timestamp: string;
}

interface AchievementData {
  day: number;
  challengeTitle: string;
  difficulty: string;
  xpEarned: number;
  streak: number;
  totalXp: number;
  language: string;
}

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID || 'demo';
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET || '';
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

export const connectUser = async (
  userId: string,
  code: string
): Promise<LinkedInConnection> => {
  if (LINKEDIN_CLIENT_ID === 'demo') {
    return {
      connected: true,
      token: encrypt('demo_linkedin_token_' + userId),
      profileUrl: 'https://linkedin.com/in/demo-user-' + userId.slice(-6),
      connectedAt: new Date().toISOString(),
      status: 'demo_connected',
    };
  }

  try {
    const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || 'http://localhost:3000/auth/linkedin/callback',
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = tokenResponse.data.access_token;

    const profileResponse = await axios.get(LINKEDIN_API_URL + '/userinfo', {
      headers: { Authorization: 'Bearer ' + accessToken },
    });

    return {
      connected: true,
      token: encrypt(accessToken),
      profileUrl: 'https://linkedin.com/in/' + profileResponse.data.sub,
      connectedAt: new Date().toISOString(),
      status: 'connected',
    };
  } catch (error: any) {
    throw new Error('LinkedIn connection failed: ' + error.message);
  }
};

export const publishAchievement = async (
  userId: string,
  achievementData: AchievementData
): Promise<PublishResult> => {
  if (LINKEDIN_CLIENT_ID === 'demo') {
    return {
      success: true,
      postId: 'demo_post_' + Math.random().toString(36).substring(2, 10),
      postUrl: 'https://linkedin.com/feed/update/demo-post-' + userId.slice(-6),
      status: 'demo_published',
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const postContent = generatePostContent(achievementData);

    const postResponse = await axios.post(
      LINKEDIN_API_URL + '/ugcPosts',
      {
        author: 'urn:li:person:' + userId,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: postContent,
            },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      },
      {
        headers: {
          Authorization: 'Bearer ' + decrypt(userId),
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    return {
      success: true,
      postId: postResponse.data.id,
      postUrl: 'https://linkedin.com/feed/update/' + postResponse.data.id,
      status: 'published',
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error('LinkedIn publish failed: ' + error.message);
  }
};

export const getLinkedInStatus = async (userId: string): Promise<LinkedInConnection> => {
  if (LINKEDIN_CLIENT_ID === 'demo') {
    return {
      connected: true,
      profileUrl: 'https://linkedin.com/in/demo-user-' + userId.slice(-6),
      connectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'demo_connected',
    };
  }

  return {
    connected: false,
    status: 'not_connected',
  };
};

export const generatePostContent = (achievementData: AchievementData): string => {
  const { day, challengeTitle, difficulty, xpEarned, streak, totalXp, language } = achievementData;

  const difficultyEmoji = difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴';
  const streakMessage = streak >= 7 ? ' (Week streak!)' : streak >= 30 ? ' (Month streak!)' : '';

  return [
    'Day ' + day + ' of #ABTalks 60-Day Coding Challenge completed!',
    '',
    'Solved: ' + challengeTitle,
    'Language: ' + language,
    'Difficulty: ' + difficultyEmoji + ' ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    '',
    'Stats:',
    '- XP Earned: +' + xpEarned,
    '- Total XP: ' + totalXp,
    '- Current Streak: ' + streak + ' days' + streakMessage,
    '',
    'Consistency is key! Each day brings new challenges and growth.',
    '',
    '#100DaysOfCode #CodingChallenge #Programming #' + language.charAt(0).toUpperCase() + language.slice(1),
  ].join('\n');
};
