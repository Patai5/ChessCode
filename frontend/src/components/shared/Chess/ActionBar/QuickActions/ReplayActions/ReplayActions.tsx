/** @jsxImportSource @emotion/react */
import IconButton from "components/shared/IconButton";
import { FaRegFlag } from "react-icons/fa";

export type ReplayActionsType = {
    goBack: () => void;
    goForward: () => void;
    goToEnd: () => void;
    goToStart: () => void;
};

type Props = { actions: ReplayActionsType };
export default function ReplayActions(props: Props) {
    return (
        <>
            <IconButton icon={FaRegFlag} tooltip="Go back" onClick={props.actions.goBack} />
            <IconButton icon={FaRegFlag} tooltip="Go forward" onClick={props.actions.goForward} />
            <IconButton icon={FaRegFlag} tooltip="Go to end" onClick={props.actions.goToEnd} />
            <IconButton icon={FaRegFlag} tooltip="Go to start" onClick={props.actions.goToStart} />
        </>
    );
}
