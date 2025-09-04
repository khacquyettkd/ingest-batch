const { z } = require( "zod");
import type { z as ZodNamespace } from "zod";

const SolarInsertSchema = z.object({
    "deviceId": z.number(),
    "apiKey": z.string(),
    "table": z.string(),
    "brand": z.string(),
    "data": z.unknown(),
}).strict();

const ConditionSchema = z.object({
    field: z.string(),
    operator: z.enum(["=", ">", "<", ">=", "<=", "!="]),
    value: z.union([z.string(), z.number(), z.boolean()]),
});
const ValueSchema = z.object({
    field: z.string(),
    value: z.union([z.string(), z.number(), z.boolean()]),
});
const SolarUpdateSchema = z.object({
    "deviceId": z.number(),
    "apiKey": z.string(),
    "table": z.string(),
    "brand": z.string(),
    "condition": z.array(ConditionSchema).min(1),  //[{ "field": "name","operator":"=", "value:"a"}, {"field":"age","operator":">": "value":18}]
    "update": z.array(ValueSchema).min(1),      //[{"field":"school", "value:"A", "field":"grade","value": 12}]
}).strict();

type Condition = ZodNamespace.infer<typeof ConditionSchema>;
type Value = ZodNamespace.infer<typeof ValueSchema>;

type SolarInsertData = ZodNamespace.infer<typeof SolarInsertSchema>;
type SolarUpdateData = ZodNamespace.infer<typeof SolarUpdateSchema>;

module.exports = {
    SolarInsertSchema,
    SolarUpdateSchema
}
export type { Condition, Value, SolarInsertData, SolarUpdateData };