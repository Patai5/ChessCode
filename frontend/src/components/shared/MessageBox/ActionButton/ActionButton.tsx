/** @jsxImportSource @emotion/react */
import Button from "components/shared/Button";

export type ButtonProps = { label: string; onClick?: () => void; closeWindow?: boolean };
interface Props extends ButtonProps {
    onClose: () => {};
}
export default function ActionButton(props: Props) {
    const handleOnClick = () => {
        if (props.closeWindow) props.onClose();
        if (props.onClick) props.onClick();
    };

    return <Button label={props.label} fontSize="1.6em" onClick={handleOnClick} />;
}
