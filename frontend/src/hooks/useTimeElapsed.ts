import React from "react";
import { secToTime } from "utils/utils";

export default function useElapsedTime(disable: boolean = false) {
    const [elapsedTime, setElapsedTime] = React.useState(0);

    React.useEffect(() => {
        if (disable) return;

        setElapsedTime(0);
        const interval = setInterval(() => setElapsedTime((time) => time + 1), 1000);
        return () => clearInterval(interval);
    }, [disable]);

    return secToTime(elapsedTime);
}
