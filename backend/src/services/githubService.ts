import axios from 'axios';
import { encrypt, decrypt } from '../utils/crypto';
import { slugify } from '../utils/helpers';

interface GitHubConnection {
  connected: boolean;
  token?: string;
  repoUrl?: string;
  repoName?: string;
  connectedAt?: string;
}

interface CommitInfo {
  commitSha: string;
  commitUrl: string;
  fileName: string;
  message: string;
  timestamp: string;
}

interface ReadmeUpdateInfo {
  updated: boolean;
  timestamp: string;
  commitSha: string;
}

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'demo';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const GITHUB_API_URL = 'https://api.github.com';

export const connectUser = async (
  userId: string,
  code: string
): Promise<GitHubConnection> => {
  if (GITHUB_CLIENT_ID === 'demo') {
    const repoName = 'abtalks-' + userId.slice(-8);
    return {
      connected: true,
      token: encrypt('demo_github_token_' + userId),
      repoUrl: 'https://github.com/demo-user/' + repoName,
      repoName,
      connectedAt: new Date().toISOString(),
    };
  }

  try {
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }, {
      headers: { Accept: 'application/json' },
    });

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get(GITHUB_API_URL + '/user', {
      headers: { Authorization: 'Bearer ' + accessToken },
    });

    const username = userResponse.data.login;
    const repoName = 'abtalks-' + userId.slice(-8);

    let repoUrl = '';
    try {
      const existingRepo = await axios.get(GITHUB_API_URL + '/repos/' + username + '/' + repoName, {
        headers: { Authorization: 'Bearer ' + accessToken },
      });
      repoUrl = existingRepo.data.html_url;
    } catch {
      const newRepo = await axios.post(GITHUB_API_URL + '/user/repos', {
        name: repoName,
        description: 'ABTalks 60-day coding challenge solutions',
        auto_init: true,
        private: false,
      }, {
        headers: { Authorization: 'Bearer ' + accessToken },
      });
      repoUrl = newRepo.data.html_url;
    }

    return {
      connected: true,
      token: encrypt(accessToken),
      repoUrl,
      repoName,
      connectedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error('GitHub connection failed: ' + error.message);
  }
};

export const commitSolution = async (
  userId: string,
  day: number,
  challengeTitle: string,
  code: string,
  language: string
): Promise<CommitInfo> => {
  if (GITHUB_CLIENT_ID === 'demo') {
    const ext = language === 'javascript' ? 'js' : language === 'python' ? 'py' : language;
    const fileName = 'day-' + day + '/' + slugify(challengeTitle) + '.' + ext;
    return {
      commitSha: 'demo_' + Math.random().toString(36).substring(2, 10),
      commitUrl: 'https://github.com/demo-user/abtalks-demo/commit/demo123abc',
      fileName,
      message: 'Day ' + day + ': ' + challengeTitle + ' solution in ' + language,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const repoName = 'abtalks-' + userId.slice(-8);
    const userResponse = await axios.get(GITHUB_API_URL + '/user', {
      headers: { Authorization: 'Bearer ' + decrypt(userId) },
    });
    const username = userResponse.data.login;

    const ext = language === 'javascript' ? 'js' : language === 'python' ? 'py' : language;
    const fileName = 'day-' + day + '/' + slugify(challengeTitle) + '.' + ext;
    const fileContent = Buffer.from(code).toString('base64');

    const commitResponse = await axios.put(
      GITHUB_API_URL + '/repos/' + username + '/' + repoName + '/contents/' + fileName,
      {
        message: 'Day ' + day + ': ' + challengeTitle + ' solution in ' + language,
        content: fileContent,
      },
      {
        headers: { Authorization: 'Bearer ' + decrypt(userId) },
      }
    );

    return {
      commitSha: commitResponse.data.commit.sha,
      commitUrl: commitResponse.data.commit.html_url,
      fileName,
      message: 'Day ' + day + ': ' + challengeTitle + ' solution in ' + language,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error('GitHub commit failed: ' + error.message);
  }
};

export const updateReadme = async (
  userId: string,
  progress: any
): Promise<ReadmeUpdateInfo> => {
  if (GITHUB_CLIENT_ID === 'demo') {
    return {
      updated: true,
      timestamp: new Date().toISOString(),
      commitSha: 'demo_readme_' + Math.random().toString(36).substring(2, 10),
    };
  }

  try {
    const repoName = 'abtalks-' + userId.slice(-8);
    const userResponse = await axios.get(GITHUB_API_URL + '/user', {
      headers: { Authorization: 'Bearer ' + decrypt(userId) },
    });
    const username = userResponse.data.login;

    const completedDaysStr = progress.completedDays.map(function(d: number) { return '- Day ' + d; }).join('\n');
    const readmeContent = [
      '# ABTalks 60-Day Coding Challenge',
      '',
      '## Progress: ' + progress.completedDays.length + '/60 days completed',
      '',
      '### Stats',
      '- Total XP: ' + progress.totalXp,
      '- Current Streak: ' + progress.currentStreak + ' days',
      '- Longest Streak: ' + progress.longestStreak + ' days',
      '',
      '### Completed Days',
      completedDaysStr,
      '',
      '### Difficulty Distribution',
      '- Easy: ' + progress.easyCount,
      '- Medium: ' + progress.mediumCount,
      '- Hard: ' + progress.hardCount,
      '',
      '---',
      '*Generated by ABTalks on ' + new Date().toISOString() + '*',
    ].join('\n');

    const encodedContent = Buffer.from(readmeContent).toString('base64');

    let sha = '';
    try {
      const existing = await axios.get(
        GITHUB_API_URL + '/repos/' + username + '/' + repoName + '/contents/README.md',
        { headers: { Authorization: 'Bearer ' + decrypt(userId) } }
      );
      sha = existing.data.sha;
    } catch {
      // File doesn't exist yet
    }

    const updateData: any = {
      message: 'Update README with latest progress',
      content: encodedContent,
    };
    if (sha) updateData.sha = sha;

    const updateResponse = await axios.put(
      GITHUB_API_URL + '/repos/' + username + '/' + repoName + '/contents/README.md',
      updateData,
      { headers: { Authorization: 'Bearer ' + decrypt(userId) } }
    );

    return {
      updated: true,
      timestamp: new Date().toISOString(),
      commitSha: updateResponse.data.commit.sha,
    };
  } catch (error: any) {
    throw new Error('README update failed: ' + error.message);
  }
};

export const getGitHubStatus = async (userId: string): Promise<GitHubConnection> => {
  if (GITHUB_CLIENT_ID === 'demo') {
    return {
      connected: true,
      repoUrl: 'https://github.com/demo-user/abtalks-' + userId.slice(-8),
      repoName: 'abtalks-' + userId.slice(-8),
      connectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  return {
    connected: false,
  };
};
