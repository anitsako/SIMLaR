CREATE TABLE "servicios_contactos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(150) NOT NULL,
	"descripcion" text DEFAULT '' NOT NULL,
	"tramites" text DEFAULT '' NOT NULL,
	"direccion" varchar(250),
	"latitud" double precision,
	"longitud" double precision,
	"horario" varchar(150),
	"telefono" varchar(50),
	"whatsapp" varchar(50),
	"email" varchar(150),
	"sitio_web" varchar(300),
	"facebook" varchar(300),
	"instagram" varchar(300),
	"visible" boolean DEFAULT false NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"usuario_creador_id" integer,
	"usuario_modificador_id" integer,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_modificacion" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proyectos_mineros" ADD COLUMN "area_hectareas" numeric(14, 2);--> statement-breakpoint
ALTER TABLE "servicios_contactos" ADD CONSTRAINT "servicios_contactos_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicios_contactos" ADD CONSTRAINT "servicios_contactos_usuario_modificador_id_usuarios_id_fk" FOREIGN KEY ("usuario_modificador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;