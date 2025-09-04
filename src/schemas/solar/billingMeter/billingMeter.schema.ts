const { z } = require( "zod");
import type { z as ZodNamespace } from "zod";

const BillingMeterColumns = z.object({
    "date": z.string(),
    "name": z.string(),
    "energy_1_8_0": z.number(),
    "energy_1_8_1": z.number(),
    "energy_1_8_2": z.number(),
    "energy_1_8_3": z.number(),
    "energy_2_8_0": z.number(),
    "energy_2_8_1": z.number(),
    "energy_2_8_2": z.number(),
    "energy_2_8_3": z.number()
});
type BillingMeterData = ZodNamespace.infer<typeof BillingMeterColumns>;
module.exports = {
    BillingMeterColumns
}
export type {BillingMeterData}