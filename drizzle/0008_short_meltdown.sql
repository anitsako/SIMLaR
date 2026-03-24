CREATE TABLE "proyectos_mineros_etapas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"color" varchar(50) NOT NULL,
	"usuario_creador_id" integer NOT NULL,
	"usuario_modificador_id" integer NOT NULL,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_modificacion" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "proyectos_mineros_etapas_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
ALTER TABLE "proyectos_mineros_etapas" ADD CONSTRAINT "proyectos_mineros_etapas_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_etapas" ADD CONSTRAINT "proyectos_mineros_etapas_usuario_modificador_id_usuarios_id_fk" FOREIGN KEY ("usuario_modificador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;