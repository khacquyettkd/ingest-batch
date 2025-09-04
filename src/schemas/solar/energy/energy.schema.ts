const { z } = require("zod");
import type { z as ZodNamespace } from "zod";

const EnergyColumns = z.object({
    'date': z.string(),
    'name': z.string(),
    'serial': z.string(),
    'energy': z.number()
});
type EnergyData = ZodNamespace.infer<typeof EnergyColumns>;
module.exports = { EnergyColumns }
export type { EnergyData }
