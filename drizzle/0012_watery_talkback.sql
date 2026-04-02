CREATE TABLE "rutas_nacionales" (
	"id" serial PRIMARY KEY NOT NULL,
	"geom" geometry(MultiLineString,4326) NOT NULL,
	"nombre" varchar(30) NOT NULL,
	"jurisdiccion" varchar(25) NOT NULL,
	"clase" varchar(22) NOT NULL
);
