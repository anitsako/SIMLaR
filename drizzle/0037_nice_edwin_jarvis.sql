CREATE TABLE "catastro_historico" (
	"id" serial PRIMARY KEY NOT NULL,
	"anio" integer NOT NULL,
	"mes" integer NOT NULL,
	"archivo_id" uuid NOT NULL,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "catastro_historico_anio_mes_unique" UNIQUE("anio","mes")
);
--> statement-breakpoint
ALTER TABLE "catastro_historico" ADD CONSTRAINT "catastro_historico_archivo_id_archivos_id_fk" FOREIGN KEY ("archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;