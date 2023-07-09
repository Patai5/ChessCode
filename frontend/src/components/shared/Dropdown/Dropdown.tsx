/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import React from "react";
import Item, { Props as DropdownItem, TransitionDuration } from "./Item/Item";
import Main, { Props as MainItem } from "./Main/Main";
export { Props as DropdownItem, TransitionDuration } from "./Item/Item";
export { Props as MainItem } from "./Main/Main";

const DropdownContainerCss = css`
    position: relative;
    transition: max-height ${TransitionDuration}s ease-in-out;
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
    transition: ${TransitionDuration}s ease-in-out;
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

type Props = { dropdownItems: DropdownItems; upwards?: boolean; isActive?: boolean, customCss?: SerializedStyles };
export default function Dropdown(props: Props) {
    const [openDropdown, setOpenDropdown] = React.useState(false);
    const { upwards = false } = props;

    const maxHeightCss = {
        maxHeight: `${props.dropdownItems.items.length * 2.75}em`,
    };

    const isMainActive = props.dropdownItems.items.length > 0 || props.isActive;

    return (
        <div
            css={[DropdownContainerCss, props.customCss]}
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => setOpenDropdown(false)}
        >
            <Main {...props.dropdownItems.main} isActive={isMainActive} />
            <div
                css={[
                    DropdownCss,
                    props.dropdownItems.dropdownCss,
                    upwards && UpwardsCss,
                    !openDropdown && InactiveCss,
                ]}
                style={maxHeightCss}
            >
                {props.dropdownItems.items.map((item, index) => (
                    <Item key={index} {...item} />
                ))}
            </div>
        </div>
    );
}
