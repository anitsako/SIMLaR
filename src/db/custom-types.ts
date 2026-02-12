import { customType } from 'drizzle-orm/pg-core';

export const multipolygon = customType<{
  data: string;
  config: { srid?: number };
  driverData: string;
}>({
  dataType(config) {
    return config?.srid ? `geometry(MultiPolygon,${config.srid})` : 'geometry(MultiPolygon)';
  },
  toDriver(value: string): string {
    return value;
  },
});

// bytea recien estará disponible en drizzle-orm version 1
export const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea';
  },
});
