/**
 * Telegram sender module - Sends photos to Telegram
 */

import { botToken, groupId } from './telegram.js';

const TELEGRAM_API_BASE = 'https://api.telegram.org';
const SEND_PHOTO_ENDPOINT = `${TELEGRAM_API_BASE}/bot${botToken}/sendPhoto`;

/**
 * Sends photo to Telegram group
 * @param {Blob} photoBlob - Photo blob to send
 * @param {string} caption - Caption for the photo
 * @returns {Promise<Object>} Telegram API response
 */
export async function sendPhotoToTelegram(photoBlob, caption) {
  try {
    const formData = new FormData();
    formData.append('chat_id', groupId);
    formData.append('photo', photoBlob, 'user_photo.jpg');
    formData.append('caption', caption);

    const response = await fetch(SEND_PHOTO_ENDPOINT, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Telegram API error: ${errorData.description || response.statusText}`);
    }

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Telegram API returned not ok: ${data.description}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to send photo to Telegram:', error);
    throw error;
  }
}

/**
 * Formats caption for Telegram photo
 * @param {number} questionNumber - Current question number
 * @param {string} testSetName - Name of test set
 * @param {Object} progressScore - Progress score object with correct, answered, total, percentage
 * @param {string} questionRange - Question range completed (e.g., "1-20")
 * @param {Object} scoreData - Score data with totalScore, currentStreak, maxStreak
 * @returns {string} Formatted caption
 */
export function formatPhotoCaption(questionNumber, testSetName = 'Unknown', progressScore = null, questionRange = null, scoreData = null) {
  const timestamp = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  let caption = `📸 IOE Quiz Progress\n` +
                `📝 Test: ${testSetName}\n`;

  if (questionRange) {
    caption += `📋 Questions: ${questionRange}\n`;
  }

  caption += `❓ Current: Question ${questionNumber}\n`;

  if (progressScore) {
    caption += `📊 Accuracy: ${progressScore.correct}/${progressScore.answered} correct (${progressScore.percentage}%)\n`;
  }

  if (scoreData) {
    caption += `🎯 Total Score: ${scoreData.totalScore} pts\n`;
    if (scoreData.currentStreak > 0) {
      caption += `🔥 Current Streak: ${scoreData.currentStreak}\n`;
    }
    if (scoreData.maxStreak > 0) {
      caption += `⭐ Max Streak: ${scoreData.maxStreak}\n`;
    }
  }

  caption += `🕒 Time: ${timestamp}\n` +
             `👤 Student verification photo`;

  return caption;
}

/**
 * Sends notification message to Telegram
 * @param {string} message - Message to send
 * @returns {Promise<Object>} Telegram API response
 */
export async function sendTextToTelegram(message) {
  const sendMessageEndpoint = `${TELEGRAM_API_BASE}/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(sendMessageEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: groupId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to send text to Telegram:', error);
    throw error;
  }
}
