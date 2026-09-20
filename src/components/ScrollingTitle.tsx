'use client';

import { useEffect } from 'react';

export default function ScrollingTitle() {
    useEffect(() => {
        // The base text with a few trailing spaces for a clean scrolling loop
        let titleText = "WildRoute Adventures | Premium Outdoor Gear & Adventure Store    ";

        const intervalId = setInterval(() => {
            // Move the first character to the end
            titleText = titleText.substring(1) + titleText.substring(0, 1);
            document.title = titleText;
        }, 2000); // Adjust speed here (lower = faster)

        return () => clearInterval(intervalId);
    }, []);

    return null; // This components doesn't need to render any HTML
}
