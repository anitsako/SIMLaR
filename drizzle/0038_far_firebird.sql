CREATE TABLE "indicadores_sociales" (
	"id" serial PRIMARY KEY NOT NULL,
	"departamento_id" integer NOT NULL,
	"poblacion_2010" integer,
	"poblacion_2022" integer,
	"mujeres_2022" integer,
	"varones_2022" integer,
	"edad_mediana_total" double precision,
	"edad_mediana_mujeres" double precision,
	"edad_mediana_varones" double precision,
	"poblacion_por_edad_sexo" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ocupacion_por_categoria" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ocupacion_por_edad_sexo" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"fuente" text DEFAULT 'INDEC - Censo Nacional de Población, Hogares y Viviendas 2022' NOT NULL,
	"observaciones" text,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_modificacion" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "indicadores_sociales_departamento_id_unique" UNIQUE("departamento_id")
);
--> statement-breakpoint
ALTER TABLE "indicadores_sociales" ADD CONSTRAINT "indicadores_sociales_departamento_id_departamentos_id_fk" FOREIGN KEY ("departamento_id") REFERENCES "public"."departamentos"("id") ON DELETE cascade ON UPDATE no action;