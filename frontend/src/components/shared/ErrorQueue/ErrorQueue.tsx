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

    /**
     * Gets the error message from an axios error and returns it
     */
    static getAxiosErrorMessage = (error: AxiosError) => {
        const { response } = error;

        if (!response) return `${error.name}: ${error.message}`;

        const customErrorMessage = this.maybeGetCustomErrorResponse(response.data);
        const errorMessage = customErrorMessage || "unknown error";

        return `${response.statusText}: ${errorMessage}`;
    };

    /**
     * Gets the custom error response message from the response data
     * @returns null if no custom error response message is found
     */
    static maybeGetCustomErrorResponse = (responseData: unknown): string | null => {
        const isObject = responseData instanceof Object;
        if (!isObject) return null;

        const detail = "detail" in responseData && typeof responseData["detail"] === "string" && responseData["detail"];
        const hasError = "error" in responseData && typeof responseData["error"] === "string" && responseData["error"];

        return detail || hasError || null;
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

export default function ErrorQueue() {
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
