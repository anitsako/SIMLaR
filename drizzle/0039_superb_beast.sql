CREATE TABLE "cerros" (
	"id" serial PRIMARY KEY NOT NULL,
	"geom" geometry(point) NOT NULL,
	"nombre" varchar(254) NOT NULL,
	"tipo" varchar(254) NOT NULL
);
