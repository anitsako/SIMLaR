CREATE TABLE "archivos_contenidos" (
	"id" serial PRIMARY KEY NOT NULL,
	"archivo_id" uuid NOT NULL,
	"contenido" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "archivos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(500) NOT NULL,
	"tamaño" integer NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"usuario_creador_id" integer NOT NULL,
	"usuario_modificador_id" integer NOT NULL,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_modificacion" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "archivos_contenidos" ADD CONSTRAINT "archivos_contenidos_archivo_id_archivos_id_fk" FOREIGN KEY ("archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_usuario_modificador_id_usuarios_id_fk" FOREIGN KEY ("usuario_modificador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;