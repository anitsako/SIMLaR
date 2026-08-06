CREATE TABLE "galeria_fotos" (
	"id" serial PRIMARY KEY NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"descripcion" varchar(500) NOT NULL,
	"archivo_imagen_id" uuid NOT NULL,
	"archivo_imagen_miniatura_id" uuid NOT NULL,
	"usuario_creador_id" integer NOT NULL,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "galeria_fotos" ADD CONSTRAINT "galeria_fotos_archivo_imagen_id_archivos_id_fk" FOREIGN KEY ("archivo_imagen_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "galeria_fotos" ADD CONSTRAINT "galeria_fotos_archivo_imagen_miniatura_id_archivos_id_fk" FOREIGN KEY ("archivo_imagen_miniatura_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "galeria_fotos" ADD CONSTRAINT "galeria_fotos_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;