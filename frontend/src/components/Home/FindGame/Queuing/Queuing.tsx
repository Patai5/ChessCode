/** @jsxImportSource @emotion/react */
import { css, jsx } from "@emotion/react";
import React from "react";
import TransparentPopup, { PopupContent, CancelHandlers } from "components/shared/TransparentPopup/TransparentPopup";
import { FaSearch } from "react-icons/fa";
import useWaitingDots from "hooks/useWaitingDots";
import useTimeElapsed from "hooks/useTimeElapsed";
import { secToTime } from "utils/utils";

export interface QueueState {
    gameMode: string;
    timeControl: number;
}

type Props = { queue?: QueueState; show: boolean; cancelHandlers: CancelHandlers };
export default function Queuing(props: Props) {
    const waitingDots = useWaitingDots(!props.show);
    const timeElapsed = useTimeElapsed(!props.show);
    const { queue = { gameMode: "", timeControl: 0 } } = props;

    const popupContent: PopupContent = {
        icon: FaSearch,
        iconText: `Searching${waitingDots}`,
        title: `${queue.gameMode} - ${secToTime(queue.timeControl)}`,
        description: `Time elapsed: ${timeElapsed}`,
        closeButtonText: "Cancel",
    };

    return <TransparentPopup content={popupContent} show={props.show} cancelHandlers={props.cancelHandlers} />;
}
