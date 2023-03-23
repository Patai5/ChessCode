import React from "react";

const useMousePosition = () => {
    const [position, setPosition] = React.useState({
        clientX: 0,
        clientY: 0,
    });

    const updatePosition = (event: MouseEvent) => {
        const { clientX, clientY } = event;

        setPosition({
            clientX,
            clientY,
        });
    };

    React.useEffect(() => {
        document.addEventListener("mousemove", updatePosition, false);
        document.addEventListener("mouseenter", updatePosition, false);

        return () => {
            document.removeEventListener("mousemove", updatePosition);
            document.removeEventListener("mouseenter", updatePosition);
        };
    }, []);

    return position;
};

export default useMousePosition;
