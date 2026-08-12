// ============================================
// RPG Trivia Quest — Leaderboard (Supabase)
// ============================================

import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
// These values come from environment variables set in .env
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let supabase = null;

function getSupabase() {
  if (!supabase && supabaseUrl && supabaseAnonKey &&
      supabaseUrl !== 'https://tu-proyecto.supabase.co') {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

/**
 * Save a winning player's score to the leaderboard
 * @param {Object} scoreData
 * @param {string} scoreData.playerName - Player display name
 * @param {number} scoreData.score - Total score
 * @param {string} scoreData.difficulty - 'easy', 'normal', 'hard'
 * @param {number} scoreData.hpRemaining - HP left at the end
 * @param {number} scoreData.comboMax - Highest combo streak achieved
 * @returns {Object} { success: boolean, data?: any, error?: string }
 */
export async function saveScore({ playerName, score, difficulty, hpRemaining, comboMax }) {
  const client = getSupabase();

  if (!client) {
    console.warn('Supabase not configured. Score saved locally only.');
    saveScoreLocal({ playerName, score, difficulty, hpRemaining, comboMax });
    return { success: true, local: true };
  }

  try {
    const { data, error } = await client
      .from('leaderboard')
      .insert([{
        player_name: playerName,
        score: score,
        difficulty: difficulty,
        hp_remaining: hpRemaining,
        combo_max: comboMax
      }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      // Fallback to localStorage
      saveScoreLocal({ playerName, score, difficulty, hpRemaining, comboMax });
      return { success: true, local: true, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    saveScoreLocal({ playerName, score, difficulty, hpRemaining, comboMax });
    return { success: true, local: true, error: err.message };
  }
}

/**
 * Get the top scores from the leaderboard
 * @param {number} limit - Number of top scores to fetch (default: 10)
 * @returns {Object} { success: boolean, data?: Array, error?: string }
 */
export async function getTopScores(limit = 10) {
  const client = getSupabase();

  if (!client) {
    console.warn('Supabase not configured. Loading local scores.');
    return { success: true, data: getLocalScores(limit), local: true };
  }

  try {
    const { data, error } = await client
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase select error:', error);
      return { success: true, data: getLocalScores(limit), local: true };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection error:', err);
    return { success: true, data: getLocalScores(limit), local: true };
  }
}

// ============================================
// Local Storage Fallback
// ============================================

const LOCAL_KEY = 'rpg_trivia_leaderboard';

function saveScoreLocal({ playerName, score, difficulty, hpRemaining, comboMax }) {
  try {
    const scores = getLocalScores(100);
    scores.push({
      player_name: playerName,
      score,
      difficulty,
      hp_remaining: hpRemaining,
      combo_max: comboMax,
      created_at: new Date().toISOString()
    });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(scores.slice(0, 100)));
  } catch (e) {
    console.error('localStorage error:', e);
  }
}

function getLocalScores(limit = 10) {
  try {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (!stored) return [];
    const scores = JSON.parse(stored);
    return scores.slice(0, limit);
  } catch (e) {
    return [];
  }
}
