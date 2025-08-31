/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import { ANIMATION_STATE } from "components/constants";
import { useAnimatedPopupCss } from "hooks/useAnimatedPopup";
import React, { ReactElement } from "react";
import { POPUP_ANIMATION_TIME_MS } from "../TransparentPopup/TransparentPopup";
import Item, { Props as DropdownItem } from "./Item/Item";
import Main, { Props as MainItem } from "./Main/Main";
export { Props as DropdownItem } from "./Item/Item";
export { Props as MainItem } from "./Main/Main";

const DropdownContainerCss = css`
    position: relative;
    transition: max-height ${POPUP_ANIMATION_TIME_MS}ms ease-in-out;
    border-radius: 1em;
    color: white;
    background-color: #232323;
    box-shadow: 0 0 0.5em #000000ab;
`;
const DropdownCss = css`
    background-color: #2c2c2c;
    border-bottom-left-radius: 1em;
    opacity: 1;
    overflow: hidden;
    transition: ${POPUP_ANIMATION_TIME_MS}ms ease-in-out;
    transition-property: max-height, opacity;
    position: absolute;
    top: calc(100% + 0.2em);
    border-radius: 1em;
    box-shadow: 0 0 0.5em #000000ab;
`;
const InactiveCss = css`
    max-height: 0 !important;
    opacity: 0;
`;
const UpwardsCss = css`
    top: unset;
    bottom: calc(100% + 0.2em);
`;

export type DropdownItems = { main: MainItem; items: DropdownItem[]; dropdownCss?: SerializedStyles };

type Props = { dropdownItems: DropdownItems; upwards?: boolean; customCss?: SerializedStyles };
export default function Dropdown(props: Props) {
    const { upwards = false, dropdownItems } = props;

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const dropdownMaxHeightCss = css`
        max-height: ${dropdownItems.items.length * 2.75}em;
    `;
    const dropdownCss = [DropdownCss, dropdownMaxHeightCss];
    if (dropdownItems.dropdownCss) dropdownCss.push(dropdownItems.dropdownCss);
    if (upwards) dropdownCss.push(UpwardsCss);

    const useAnimatedPopupOptions = {
        animationDurationMs: POPUP_ANIMATION_TIME_MS,
        isOpen: isDropdownOpen,
        cssOptions: { opened: dropdownCss, closed: [...dropdownCss, InactiveCss] },
    };
    const { state, cssState: dropdownStateCss } = useAnimatedPopupCss(useAnimatedPopupOptions);

    const isMainActive = dropdownItems.items.length > 0;
    return (
        <div
            css={[DropdownContainerCss, props.customCss]}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
        >
            <Main {...props.dropdownItems.main} isActive={isMainActive} />
            {getDropdown({ state, dropdownItems: dropdownItems.items, dropdownStateCss })}
        </div>
    );
}

const getDropdown = (options: {
    state: keyof typeof ANIMATION_STATE;
    dropdownItems: DropdownItem[];
    dropdownStateCss: SerializedStyles | SerializedStyles[];
}): ReactElement | null => {
    const { state, dropdownItems, dropdownStateCss } = options;

    const isDropdownClosed = state === ANIMATION_STATE.CLOSED;
    if (isDropdownClosed) return null;

    return (
        <div css={dropdownStateCss} data-testid="dropdown-popup">
            {getDropdownItems(dropdownItems)}
        </div>
    );
};

const getDropdownItems = (dropdownItems: DropdownItem[]): ReactElement[] => {
    return dropdownItems.map((item, index) => <Item key={index} {...item} />);
};
