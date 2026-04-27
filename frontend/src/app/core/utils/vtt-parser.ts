export interface StorySentence {
  text: string;
  startTime: number;
  endTime: number;
}

export function parseVtt(vttText: string): StorySentence[] {
  const lines = vttText.split(/\r?\n/);
  const sentences: StorySentence[] = [];
  let currentSentence: Partial<StorySentence> = {};

  const timeRegex = /(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (timeRegex.test(line)) {
      const matches = line.match(timeRegex);
      if (matches) {
        currentSentence.startTime = timeToSeconds(matches[1]);
        currentSentence.endTime = timeToSeconds(matches[2]);
      }
    } else if (line && currentSentence.startTime !== undefined) {
      // It's the text content
      currentSentence.text = line;
      sentences.push(currentSentence as StorySentence);
      currentSentence = {};
    }
  }

  return sentences;
}

function timeToSeconds(timeStr: string): number {
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const sParts = parts[2].split('.');
  const s = parseInt(sParts[0], 10);
  const ms = parseInt(sParts[1], 10);

  return h * 3600 + m * 60 + s + ms / 1000;
}
