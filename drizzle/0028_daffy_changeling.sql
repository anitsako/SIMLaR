CREATE TABLE "proyectos_mineros_modelos_terreno" (
	"id" serial PRIMARY KEY NOT NULL,
	"proyecto_minero_id" integer NOT NULL,
	"nombre" varchar(200) NOT NULL,
	"descripcion" text,
	"fecha_levantamiento" date,
	"mdt_cog_archivo_id" uuid,
	"mdt_raw_archivo_id" uuid,
	"ortofoto_cog_archivo_id" uuid,
	"ortofoto_png_archivo_id" uuid,
	"mdt_coloreado_archivo_id" uuid,
	"thumbnail_archivo_id" uuid,
	"crs" varchar(50) DEFAULT 'EPSG:3857',
	"crs_original" varchar(50),
	"bounds_west" double precision,
	"bounds_south" double precision,
	"bounds_east" double precision,
	"bounds_north" double precision,
	"center_lat" double precision,
	"center_lon" double precision,
	"default_zoom" integer DEFAULT 15,
	"elevation_min" double precision,
	"elevation_max" double precision,
	"resolucion_metros" double precision,
	"ancho_px" integer,
	"alto_px" integer,
	"software_procesamiento" varchar(100),
	"version_software" varchar(50),
	"notas_procesamiento" text,
	"visible" boolean DEFAULT true,
	"es_principal" boolean DEFAULT false,
	"estado_procesamiento" varchar(50) DEFAULT 'pendiente',
	"usuario_creador_id" integer,
	"usuario_modificador_id" integer,
	"fecha_creacion" timestamp DEFAULT now(),
	"fecha_modificacion" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_proyecto_minero_id_proyectos_mineros_id_fk" FOREIGN KEY ("proyecto_minero_id") REFERENCES "public"."proyectos_mineros"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_mdt_cog_archivo_id_archivos_id_fk" FOREIGN KEY ("mdt_cog_archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_mdt_raw_archivo_id_archivos_id_fk" FOREIGN KEY ("mdt_raw_archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_ortofoto_cog_archivo_id_archivos_id_fk" FOREIGN KEY ("ortofoto_cog_archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_ortofoto_png_archivo_id_archivos_id_fk" FOREIGN KEY ("ortofoto_png_archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_mdt_coloreado_archivo_id_archivos_id_fk" FOREIGN KEY ("mdt_coloreado_archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_thumbnail_archivo_id_archivos_id_fk" FOREIGN KEY ("thumbnail_archivo_id") REFERENCES "public"."archivos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos_mineros_modelos_terreno" ADD CONSTRAINT "proyectos_mineros_modelos_terreno_usuario_modificador_id_usuarios_id_fk" FOREIGN KEY ("usuario_modificador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;