/**
 * Lightweight text diffing utility for client-side resume comparison
 * No external dependencies - pure TypeScript
 */

export interface DiffSegment {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export interface DiffResult {
  segments: DiffSegment[];
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
}

/**
 * Simple word-based diff algorithm
 * Compares two texts and returns segments with their change types
 */
export function diffText(original: string, modified: string): DiffResult {
  const originalWords = original.split(/(\s+)/);
  const modifiedWords = modified.split(/(\s+)/);
  
  const segments: DiffSegment[] = [];
  let addedCount = 0;
  let removedCount = 0;
  let unchangedCount = 0;

  // Simple longest common subsequence approach
  const maxLength = Math.max(originalWords.length, modifiedWords.length);
  let origIndex = 0;
  let modIndex = 0;

  while (origIndex < originalWords.length || modIndex < modifiedWords.length) {
    if (origIndex >= originalWords.length) {
      // Only modified text remains
      segments.push({ type: 'added', text: modifiedWords[modIndex] });
      addedCount++;
      modIndex++;
    } else if (modIndex >= modifiedWords.length) {
      // Only original text remains
      segments.push({ type: 'removed', text: originalWords[origIndex] });
      removedCount++;
      origIndex++;
    } else if (originalWords[origIndex] === modifiedWords[modIndex]) {
      // Words match
      segments.push({ type: 'unchanged', text: originalWords[origIndex] });
      unchangedCount++;
      origIndex++;
      modIndex++;
    } else {
      // Words don't match - check if word appears later
      const nextMatchInOrig = modifiedWords.slice(modIndex + 1).indexOf(originalWords[origIndex]);
      const nextMatchInMod = originalWords.slice(origIndex + 1).indexOf(modifiedWords[modIndex]);

      if (nextMatchInOrig >= 0 && (nextMatchInMod < 0 || nextMatchInOrig < nextMatchInMod)) {
        // Modified word appears later in original - mark as added
        segments.push({ type: 'added', text: modifiedWords[modIndex] });
        addedCount++;
        modIndex++;
      } else if (nextMatchInMod >= 0) {
        // Original word appears later in modified - mark as removed
        segments.push({ type: 'removed', text: originalWords[origIndex] });
        removedCount++;
        origIndex++;
      } else {
        // No match found - mark both
        segments.push({ type: 'removed', text: originalWords[origIndex] });
        removedCount++;
        origIndex++;
        segments.push({ type: 'added', text: modifiedWords[modIndex] });
        addedCount++;
        modIndex++;
      }
    }
  }

  return {
    segments,
    addedCount,
    removedCount,
    unchangedCount,
  };
}

/**
 * Get word count statistics
 */
export function getWordCounts(text: string): { words: number; characters: number; lines: number } {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  return {
    words: words.length,
    characters: text.length,
    lines: text.split('\n').length,
  };
}

/**
 * Compare two texts and return statistics
 */
export function compareTexts(original: string, modified: string): {
  diff: DiffResult;
  originalStats: { words: number; characters: number; lines: number };
  modifiedStats: { words: number; characters: number; lines: number };
  changePercentage: number;
} {
  const diff = diffText(original, modified);
  const originalStats = getWordCounts(original);
  const modifiedStats = getWordCounts(modified);
  
  const totalChanges = diff.addedCount + diff.removedCount;
  const totalWords = originalStats.words + modifiedStats.words;
  const changePercentage = totalWords > 0 ? (totalChanges / totalWords) * 100 : 0;

  return {
    diff,
    originalStats,
    modifiedStats,
    changePercentage: Math.round(changePercentage * 10) / 10,
  };
}

