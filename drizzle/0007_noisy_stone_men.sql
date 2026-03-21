CREATE TABLE "carrousel_imagenes" (
	"id" serial PRIMARY KEY NOT NULL,
	"archivo_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proyectos_mineros_tipos" ADD COLUMN "forma" varchar(50);--> statement-breakpoint
ALTER TABLE "carrousel_imagenes" ADD CONSTRAINT "carrousel_imagenes_archivo_id_archivos_id_fk" FOREIGN KEY ("archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;