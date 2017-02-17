import {isatty} from "tty";

export const prettyPrint: boolean = isatty(1) && isatty(2);
export const inputAvailable: boolean = isatty(0);
