CREATE TABLE "diques" (
	"id" serial PRIMARY KEY NOT NULL,
	"geom" geometry(MultiPolygon,4326) NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"superficie" integer NOT NULL
);
