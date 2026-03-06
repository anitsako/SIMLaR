CREATE TABLE "proyectos_mineros_tipos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"color" varchar(50) NOT NULL,
	"usuario_creador_id" integer NOT NULL,
	"usuario_modificador_id" integer NOT NULL,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_modificacion" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "proyectos_mineros_tipos_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "proyectos_mineros" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"tipo_id" integer NOT NULL,
	"ubicacion" varchar(100) NOT NULL,
	"provincia_geologica" varchar(100) NOT NULL,
	"area" varchar(10) NOT NULL,
	"litologia" text NOT NULL,
	"mineralizacion" text NOT NULL,
	"mineral_interes" varchar(100) NOT NULL,
	"modelo_genetico" text NOT NULL,
	"accesos" text NOT NULL,
	"etapa" varchar(100) NOT NULL,
	"propietario" varchar(100) NOT NULL,
	"localidades_cercanas" varchar(100) NOT NULL,
	"coordenadas_geograficas" geometry(point) NOT NULL,
	"msnm" integer NOT NULL,
	"convenio_emse" boolean NOT NULL,
	"archivo_mapa_id" uuid,
	"visible" boolean DEFAULT true NOT NULL,
	"usuario_creador_id" integer NOT NULL,
	"usuario_modificador_id" integer NOT NULL,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_modificacion" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "proyectos_mineros_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
ALTER TABLE "proyectos_mineros_tipos" ADD CONSTRAINT "proyectos_mineros_tipos_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_tipos" ADD CONSTRAINT "proyectos_mineros_tipos_usuario_modificador_id_usuarios_id_fk" FOREIGN KEY ("usuario_modificador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros" ADD CONSTRAINT "proyectos_mineros_tipo_id_proyectos_mineros_tipos_id_fk" FOREIGN KEY ("tipo_id") REFERENCES "public"."proyectos_mineros_tipos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros" ADD CONSTRAINT "proyectos_mineros_archivo_mapa_id_archivos_id_fk" FOREIGN KEY ("archivo_mapa_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros" ADD CONSTRAINT "proyectos_mineros_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros" ADD CONSTRAINT "proyectos_mineros_usuario_modificador_id_usuarios_id_fk" FOREIGN KEY ("usuario_modificador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;