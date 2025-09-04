const { z } = require("zod");
import type { z as ZodNamespace } from "zod";

const MeterColumns = z.object({
    "time": z.string(),
    "name": z.string(),
    "ip": z.string(),
    "status": z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
    "serial": z.string(),
    "phase_voltage_an": z.number(),
    "phase_voltage_bn": z.number(),
    "phase_voltage_cn": z.number(),
    "phase_voltage_ab": z.number(),
    "phase_voltage_bc": z.number(),
    "phase_voltage_ca": z.number(),
    "phase_a_current": z.number(),
    "phase_b_current": z.number(),
    "phase_c_current": z.number(),
    "phase_a_power_factor": z.number(),
    "phase_b_power_factor": z.number(),
    "phase_c_power_factor": z.number(),
    "phase_a_active_power": z.number(),
    "phase_b_active_power": z.number(),
    "phase_c_active_power": z.number(),
    "phase_a_reactive_power": z.number(),
    "phase_b_reactive_power": z.number(),
    "phase_c_reactive_power": z.number(),
    "phase_a_apparent_power": z.number(),
    "phase_b_apparent_power": z.number(),
    "phase_c_apparent_power": z.number(),
    "power_factor": z.number(),
    "grid_frequency": z.number(),
    "active_power": z.number(),
    "reactive_power": z.number(),
    "apparent_power": z.number(),
    "forward_active_energy": z.number(),
    "reverse_active_energy": z.number(),
    "is_stored": z.union([z.literal(0), z.literal(1)])
});
type MeterData = ZodNamespace.infer<typeof MeterColumns>;

module.exports = { MeterColumns }
export type { MeterData }