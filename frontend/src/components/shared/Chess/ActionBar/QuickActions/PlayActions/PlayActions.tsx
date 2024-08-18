/** @jsxImportSource @emotion/react */
import { IconButton } from "components/shared/IconButton/IconButton";
import { FaRegFlag } from "react-icons/fa";

export type PlayActionsType = { highlightDraw: boolean; resign: () => void; offerDraw: () => void };

type Props = { actions: PlayActionsType };
export default function PlayActions(props: Props) {
    return (
        <>
            <IconButton
                Icon={"½"}
                fontSize={1.5}
                tooltip={props.actions.highlightDraw ? "Accept draw" : "Propose a draw"}
                onClick={props.actions.offerDraw}
                highlighted={props.actions.highlightDraw}
            />
            <IconButton Icon={FaRegFlag} tooltip="Resign" onClick={props.actions.resign} />
        </>
    );
}
