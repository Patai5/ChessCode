import { getBaseUri } from "./utils";

export function getWSUri() {
    return getBaseUri().replace("http", "ws");
}
