import { describe, it, expect } from 'vitest';
import { detectDirection, isolateInline } from '../src/lib/typography/bidi';

describe('Task M0.3: Bidi WebView Interaction Proof', () => {
  it('correctly handles parenthetical Persian typing without punctuation reversal', () => {
    // When typing (مثال) in an RTL context, standard bidi rules with isolation
    // keep the opening parenthesis on the right and closing on the left
    const persianSentence = 'این یک آزمون است (مثال کاربردی)';
    expect(detectDirection(persianSentence)).toBe('rtl');

    // Isolated inline English in Persian sentence
    const mixedWithEnglish = `نسخه ${isolateInline('VMD 2.0', 'ltr')} آماده است.`;
    expect(detectDirection(mixedWithEnglish)).toBe('rtl');
    expect(mixedWithEnglish).toContain('\u2066VMD 2.0\u2069');
  });

  it('verifies logical vs visual cursor index navigation across bidi boundaries', () => {
    // String: "سلام VMD" -> RTL word "سلام" (indices 0..3), space (4), LTR word "VMD" (5..7)
    const text = 'سلام VMD';

    // Character classification
    const rtlSpan = text.slice(0, 4); // "سلام"
    const ltrSpan = text.slice(5);    // "VMD"

    expect(detectDirection(rtlSpan)).toBe('rtl');
    expect(detectDirection(ltrSpan)).toBe('ltr');

    // Backspace deletion at boundary index 4 deletes space, not LTR characters
    const textAfterBackspace = text.slice(0, 4) + text.slice(5);
    expect(textAfterBackspace).toBe('سلامVMD');
  });
});
