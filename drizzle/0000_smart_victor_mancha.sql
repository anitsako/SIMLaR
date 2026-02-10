CREATE TABLE "departamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(50) NOT NULL,
	"geom" geometry(MultiPolygon,4326) NOT NULL
);
