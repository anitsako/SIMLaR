CREATE TABLE "proyectos_mineros_archivos" (
	"proyecto_minero_id" integer NOT NULL,
	"archivo_id" uuid NOT NULL,
	"usuario_creador_id" integer NOT NULL,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "proyectos_mineros_archivos_proyecto_minero_id_archivo_id_pk" PRIMARY KEY("proyecto_minero_id","archivo_id")
);
--> statement-breakpoint
ALTER TABLE "proyectos_mineros_archivos" ADD CONSTRAINT "proyectos_mineros_archivos_proyecto_minero_id_proyectos_mineros_id_fk" FOREIGN KEY ("proyecto_minero_id") REFERENCES "public"."proyectos_mineros"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_archivos" ADD CONSTRAINT "proyectos_mineros_archivos_archivo_id_archivos_id_fk" FOREIGN KEY ("archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_archivos" ADD CONSTRAINT "proyectos_mineros_archivos_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;