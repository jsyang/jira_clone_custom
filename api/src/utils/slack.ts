/* eslint-disable @typescript-eslint/camelcase */
import { WebClient } from '@slack/web-api';

const web = new WebClient(process.env.SLACK_WEB_API_TOKEN);
const channel = process.env.SLACK_CHANNEL || 'jira';

export const CLIENT_URL = process.env.CLIENT_URL || '';

export const sendMessage = (_text: string | Array<any>, iconEmoji = ':speech_balloon:'): void => {
  const text = _text instanceof Array ? _text.join('') : _text;

  web.chat.postMessage({
    icon_emoji: iconEmoji,
    text,
    channel,
  });
};

// https://api.slack.com/reference/surfaces/formatting#escaping
export const escapeText = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
