CREATE TABLE "aeropuertos" (
	"id" serial PRIMARY KEY NOT NULL,
	"geom" geometry(point) NOT NULL,
	"nombre" varchar(40) NOT NULL,
	"tipo" varchar(50) NOT NULL
);
