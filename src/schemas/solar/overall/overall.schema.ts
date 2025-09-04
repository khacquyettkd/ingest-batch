const { z } = require("zod");
import type { z as ZodNamespace } from "zod";

const OverallColumns = z.object({
    "time": z.string(),
    "ac_power": z.number(),
    "dc_power": z.number(),
    "online": z.number(),
    "warning": z.number(),
    "offline": z.number(),
    "error": z.number(),
    "is_stored": z.union([z.literal(0), z.literal(1)]),
});
type OverallData = ZodNamespace.infer<typeof OverallColumns>;

module.exports = { OverallColumns }
export type { OverallData }