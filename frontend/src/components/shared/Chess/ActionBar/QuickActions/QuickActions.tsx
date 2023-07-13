/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayActions, { PlayActionsType } from "./PlayActions/PlayActions";
import ReplayActions, { ReplayActionsType } from "./ReplayActions/ReplayActions";

const QuickActionsCss = css`
    display: flex;
    gap: 0.5em;
    height: 2.25em;
    margin: 0.25em 0;
`;

export type ActionsType = { playActions?: PlayActionsType; replayActions?: ReplayActionsType };

type Props = { actions: ActionsType; isReplay: boolean };
export default function QuickActions(props: Props) {
    return (
        <div css={QuickActionsCss}>
            {props.isReplay ? (
                <ReplayActions actions={props.actions.replayActions!} />
            ) : (
                <PlayActions actions={props.actions.playActions!} />
            )}
        </div>
    );
}
