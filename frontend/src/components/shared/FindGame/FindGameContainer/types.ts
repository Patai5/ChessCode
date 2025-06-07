import { GradientButtonPickerMethods } from "components/shared/GradientButtonPicker";
import { HandleStartQueueingType } from "../FindGame";
import { Username } from "../FriendPicker/FriendPicker";
import { playAgainstType } from "../PlayAgainstPicker/PlayAgainstPicker";
import { QueueState } from "../Queuing/Queuing";
import { TimeControlPickerMethods } from "../TimeControlPicker/TimeControlPicker";

export type CloseFindGamePopupProps = {
    /**
     * Immediately closes the find game popup along with all of it's logic.
     */
    closeFindGamePopup: () => void;
};

export type SharedFindGameProps = {
    /**
     * If set, the user will be queued against this player.
     * - Otherwise the play against will be displayed and selectable by the user.
     */
    playAgainstPlayer?: Username;
};

export type FindGameContainerProps = SharedFindGameProps & {
    queuing: QueueState | null;
    playAgainst: playAgainstType;
    selectedFriend: Username | null;
    playAgainstPickerRef: React.MutableRefObject<GradientButtonPickerMethods | null>;
    timeControlPickerRef: React.MutableRefObject<TimeControlPickerMethods | null>;

    handleStartQueueing: HandleStartQueueingType;
    handleSetPlayAgainst: (playAgainst: playAgainstType) => void;

    /**
     * Whether the window is a popup or not. Will add the close button if true.
     */
    findGamePopupControls?: CloseFindGamePopupProps & {
        isFindGamePopupOpen: boolean;
        setIsFindGamePopupOpen: (isOpen: boolean) => void;
    };
};
