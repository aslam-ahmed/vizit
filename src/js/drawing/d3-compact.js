import { select, selectAll, selection } from "d3-selection";
import { transition } from "d3-transition";
import * as ease from "d3-ease";

export const d3 = { select, selectAll, selection, transition, ...ease };
