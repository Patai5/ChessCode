import React from "react";

export default function useWaitingDots(disable: boolean = false) {
    const [dotCount, setDotCount] = React.useState(0);

    React.useEffect(() => {
        if (disable) return;

        setDotCount(0);
        const interval = setInterval(() => {
            setDotCount((count) => (count + 1) % 4);
        }, 400);
        return () => clearInterval(interval);
    }, [disable]);

    return ".".repeat(dotCount);
}
