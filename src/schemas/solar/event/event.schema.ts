const { z } = require( "zod");
import type { z as ZodNamespace } from "zod";

const EventColumns = z.object({
    "time": z.string(),
    "name": z.string(),
    "status": z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
    "old_state": z.number(),
    "new_state": z.number(),
    "sub_state": z.number(),
    "is_old": z.union([z.literal(0), z.literal(1)]),
    "process": z.union([z.literal(0), z.literal(1), z.literal(2)]),
});
type EventData = ZodNamespace.infer<typeof EventColumns>;

module.exports = { EventColumns }
export type { EventData }