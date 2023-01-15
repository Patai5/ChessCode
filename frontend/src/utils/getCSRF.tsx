import axios from "axios";
import { getCookie } from "./utils";

export default function getCSRF() {
	return getCookie("csrftoken");
}
