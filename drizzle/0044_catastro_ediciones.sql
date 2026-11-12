CREATE TABLE "catastro_ediciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(120) NOT NULL,
	"fecha_corte" date NOT NULL,
	"observaciones" text DEFAULT '' NOT NULL,
	"geojson_id" uuid NOT NULL,
	"pdf_id" uuid,
	"dwg_id" uuid,
	"firma" varchar(64) NOT NULL,
	"elementos" integer NOT NULL,
	"usuario_id" integer NOT NULL,
	"publicada_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "catastro_ediciones_firma_unique" UNIQUE("firma")
);
--> statement-breakpoint
ALTER TABLE "catastro_ediciones" ADD CONSTRAINT "catastro_ediciones_geojson_id_archivos_id_fk" FOREIGN KEY ("geojson_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catastro_ediciones" ADD CONSTRAINT "catastro_ediciones_pdf_id_archivos_id_fk" FOREIGN KEY ("pdf_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catastro_ediciones" ADD CONSTRAINT "catastro_ediciones_dwg_id_archivos_id_fk" FOREIGN KEY ("dwg_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catastro_ediciones" ADD CONSTRAINT "catastro_ediciones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;