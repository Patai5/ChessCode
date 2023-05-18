/** @jsxImportSource @emotion/react */
import { AxiosError } from "axios";
import React from "react";
import ErrorPopup, { ErrorType } from "./ErrorPopup/ErrorPopup";

export class ErrorQueueClass {
    private static ErrorQueue: ErrorType[] = [];
    public static setErrorFnCallback: (error: ErrorType) => void = () => {};
    public static addError(error: ErrorType) {
        ErrorQueueClass.ErrorQueue.push(error);

        if (ErrorQueueClass.ErrorQueue.length > 1) return;
        ErrorQueueClass.setErrorFnCallback(ErrorQueueClass.getError());
    }
    public static getError() {
        return ErrorQueueClass.ErrorQueue[0];
    }
    public static removeError() {
        ErrorQueueClass.ErrorQueue.shift();
    }

    /** Gets the error message from an axios error and returns it */
    static getAxiosErrorMessage = (error: AxiosError) => {
        if (error.response) {
            const data = error.response.data as any;
            const errorMessage = data["detail"] || data["error"];

            return `${error.response.statusText}: ${errorMessage}`;
        } else {
            return `${error.name}: ${error.message}`;
        }
    };

    /** Gets the error message from an error and returns it */
    static getErrorMessage = (error: string | Error) => {
        if (error instanceof Error) {
            if (error instanceof AxiosError) {
                return this.getAxiosErrorMessage(error);
            } else {
                return `${error.name}: ${error.message}`;
            }
        } else {
            return error;
        }
    };

    /** Handles the axios error and adds it to the error queue */
    static handleError = (error: string | Error) => {
        ErrorQueueClass.addError({ errorMessage: this.getErrorMessage(error) });
    };
}

type Props = {};
export default function ErrorQueue(props: Props) {
    const [error, setError] = React.useState<false | ErrorType>(false);

    React.useEffect(() => {
        ErrorQueueClass.setErrorFnCallback = setError;
    }, []);

    const handleErrorClosed = () => {
        ErrorQueueClass.removeError();
        const nextError = ErrorQueueClass.getError();
        if (nextError) setError(nextError);
    };

    return error ? <ErrorPopup error={error} closedCallback={handleErrorClosed} /> : null;
}
