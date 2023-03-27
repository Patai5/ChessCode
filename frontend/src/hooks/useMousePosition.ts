import React from "react";

const useMousePosition = (disable: boolean = false) => {
    const [position, setPosition] = React.useState({
        clientX: 0,
        clientY: 0,
    });

    const updatePosition = (event: MouseEvent | React.MouseEvent) => {
        const { clientX, clientY } = event;

        setPosition({
            clientX,
            clientY,
        });
    };

    React.useEffect(() => {
        if (disable) return;

        document.addEventListener("mousemove", updatePosition, false);
        document.addEventListener("mouseenter", updatePosition, false);

        return () => {
            document.removeEventListener("mousemove", updatePosition);
            document.removeEventListener("mouseenter", updatePosition);
        };
    }, [disable]);

    return { ...position, updatePosition };
};

export default useMousePosition;
