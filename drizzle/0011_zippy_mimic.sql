ALTER TABLE "carrousel_imagenes" ADD COLUMN "position_y" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "carrousel_imagenes" ADD COLUMN "usuario_creador_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "carrousel_imagenes" ADD COLUMN "usuario_modificador_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "carrousel_imagenes" ADD CONSTRAINT "carrousel_imagenes_usuario_creador_id_usuarios_id_fk" FOREIGN KEY ("usuario_creador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carrousel_imagenes" ADD CONSTRAINT "carrousel_imagenes_usuario_modificador_id_usuarios_id_fk" FOREIGN KEY ("usuario_modificador_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;