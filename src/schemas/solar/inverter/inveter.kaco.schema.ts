const { z } = require( "zod");
import type { z as ZodNamespace } from "zod";

const InverterKacoColumns = z.object({
    "time": z.string(),
    "name": z.string(),
    "ip": z.string(),
    "status": z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
    "serial": z.string(),
    "ac_current": z.number(),
    "phase_a_current": z.number(),
    "phase_b_current": z.number(),
    "phase_c_current": z.number(),
    "phase_voltage_ab": z.number(),
    "phase_voltage_bc": z.number(),
    "phase_voltage_ca": z.number(),
    "phase_voltage_an": z.number(),
    "phase_voltage_bn": z.number(),
    "phase_voltage_cn": z.number(),
    "ac_power": z.number(),
    "line_frequency": z.number(),
    "ac_energy": z.number(),
    "dc_current": z.number(),
    "dc_voltage": z.number(),
    "dc_power": z.number(),
    "cabinet_temperature": z.number(),
    "operating_state": z.number(),
    "vendor_operating_state": z.number(),
    "is_stored": z.union([z.literal(0), z.literal(1)]),
    "power_limit_external": z.number(),
    "power_limit_enable": z.union([z.literal(0), z.literal(1)]),
    "grid_connection": z.number()
});
type InverterKacoData = ZodNamespace.infer<typeof InverterKacoColumns>;

module.exports = { InverterKacoColumns }
export type { InverterKacoData }
