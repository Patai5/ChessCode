/** @jsxImportSource @emotion/react */
import TransparentPopup, { PopupContent } from "components/shared/TransparentPopup/TransparentPopup";
import { FaTrophy } from "react-icons/fa";

export const GameWinner = {
    white: "White has Won!",
    black: "Black has Won!",
    draw: "It's a Draw!",
};
export const GameTermination = {
    checkmate: "by checkmate",
    stalemate: "by stalemate",
    insufficient_material: "by insufficient material",
    fifty_moves: "by fifty moves rule",
    threefold_repetition: "by threefold repetition",
    timeout: "on time",
    resignation: "by resignation",
    agreement: "by mutual agreement",
    aborted: "Game aborted",
};
export type GameResult = {
    winner: keyof typeof GameWinner;
    termination: keyof typeof GameTermination;
};

type Props = { result?: GameResult; show: boolean };
export default function ResultsDisplay(props: Props) {
    const popupContent: PopupContent = {
        icon: FaTrophy,
        title: props.result ? GameWinner[props.result.winner] : "",
        description: props.result ? GameTermination[props.result.termination] : "",
        buttons: [{ label: "GG!", closeWindow: true }],
    };

    return <TransparentPopup content={popupContent} show={props.show} />;
}
