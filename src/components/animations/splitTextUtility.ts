/**
 * A lightweight utility to split text into lines for GSAP animations.
 * Because standard GSAP SplitText is a premium plugin, we implement a custom DOM splitter here.
 */

export function splitTextIntoLines(element: HTMLElement): HTMLElement[] {
  // Save original text
  const originalText = element.innerText;

  // Clear the element
  element.innerHTML = "";
  element.style.opacity = "1"; // Ensure visible for calculations

  // Split by words
  const words = originalText.split(" ");
  const wordSpans: HTMLSpanElement[] = [];

  // Wrap each word in a span and append
  words.forEach((word) => {
    const span = document.createElement("span");
    span.innerText = word + " ";
    span.style.display = "inline-block";
    element.appendChild(span);
    wordSpans.push(span);
  });

  // Group words into lines by their offsetTop
  let currentLine: HTMLSpanElement[] = [];
  let currentTop = -1;
  const lines: HTMLSpanElement[][] = [];

  wordSpans.forEach((span) => {
    const top = span.offsetTop;
    if (currentTop === -1 || currentTop === top) {
      currentLine.push(span);
      currentTop = top;
    } else {
      lines.push(currentLine);
      currentLine = [span];
      currentTop = top;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Clear again and rebuild with line wrappers
  element.innerHTML = "";
  const lineWrappers: HTMLElement[] = [];

  lines.forEach((lineWords) => {
    // The outer wrapper clips the inner content
    const lineWrapper = document.createElement("span");
    lineWrapper.style.display = "block";
    lineWrapper.style.overflow = "hidden";

    // The inner content actually moves
    const innerWrapper = document.createElement("span");
    innerWrapper.style.display = "block";
    // Add a class so GSAP can target the inner wrapper easily
    innerWrapper.classList.add("text-line-inner");

    lineWords.forEach((wordSpan) => {
      innerWrapper.appendChild(wordSpan);
    });

    lineWrapper.appendChild(innerWrapper);
    element.appendChild(lineWrapper);

    lineWrappers.push(innerWrapper); // Return inner wrappers for animation
  });

  return lineWrappers;
}
