/** @jsxImportSource @emotion/react */
import { GAME_TERMINATION_EXPLANATION, GAME_WINNER_TITLE } from "components/constants";
import MessageBox, { PopupContent } from "components/shared/MessageBox/MessageBox";
import { FaTrophy } from "react-icons/fa";
import { GameResultApiResponse } from "types/api/gameResult";

type Props = { result?: GameResultApiResponse; show: boolean };
export default function ResultsDisplay(props: Props) {
    const popupContent: PopupContent = {
        icon: FaTrophy,
        title: props.result ? GAME_WINNER_TITLE[props.result.winner] : "",
        description: props.result ? GAME_TERMINATION_EXPLANATION[props.result.termination] : "",
        buttons: [{ label: "GG!", closeWindow: true }],
    };

    return <MessageBox content={popupContent} show={props.show} />;
}
