ALTER TABLE "usuarios" ADD COLUMN "es_admin" boolean DEFAULT false NOT NULL;

UPDATE "usuarios" SET "es_admin" = true WHERE "id" = 1;
