CREATE TABLE "rios" (
	"id" serial PRIMARY KEY NOT NULL,
	"geom" geometry(MultiLineString,4326) NOT NULL,
	"nombre" varchar(254) NOT NULL,
	"distancia" integer NOT NULL
);
