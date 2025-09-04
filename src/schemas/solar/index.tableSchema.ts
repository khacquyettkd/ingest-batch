const { BillingMeterColumns } = require( "./billingMeter/billingMeter.schema");
const { EnergyColumns } = require( "./energy/energy.schema");
const { EventColumns } = require( "./event/event.schema");
const { InverterKacoColumns } = require( "./inverter/inveter.kaco.schema");
const { InverterSungrowColumns } = require( "./inverter/inveter.sungrow.schema");
const { MeterColumns } = require( "./meter/meter.schema");
const { OverallColumns } = require( "./overall/overall.schema");
import type { z as ZodNamespace } from "zod";

const TableInsertSchemas: Record<string, any> = {
  billing_meter: BillingMeterColumns.strict(),
  energy: EnergyColumns.strict(),
  inverter: {
    sungrow: InverterSungrowColumns.strict(),
    others : InverterKacoColumns.strict()
  },
  event: EventColumns.strict(),
  meter: MeterColumns.strict(),
  overall: OverallColumns.strict()
};
const TableUpdateSchemas: Record<string, any> = {
  billing_meter: BillingMeterColumns.partial().strict(),
  energy: EnergyColumns.partial().strict()
};

function extractColumns(schema: ZodNamespace.ZodObject<any>) {
  return Object.keys(schema.shape);
}
const TableInsertColumns: Record<string, any> = {
  billing_meter: extractColumns(BillingMeterColumns),
  energy: extractColumns(EnergyColumns),
  inverter: {
    sungrow : extractColumns(InverterSungrowColumns),
    others : extractColumns(InverterKacoColumns)
  },
  event: extractColumns(EventColumns),
  meter: extractColumns(MeterColumns),
  overall: extractColumns(OverallColumns)
};

const TableUpdateColumns: Record<string, string[]> = {
  billing_meter: extractColumns(BillingMeterColumns),
  energy: extractColumns(EnergyColumns)
};

module.exports = {
  TableInsertSchemas,
  TableUpdateSchemas,
  TableInsertColumns,
  TableUpdateColumns
}