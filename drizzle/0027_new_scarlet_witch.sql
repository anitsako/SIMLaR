CREATE TABLE "analytics_sesiones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_id" varchar(255) NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"user_agent" varchar(1024),
	"browser" varchar(255),
	"os" varchar(255),
	"device" varchar(50),
	"language" varchar(35),
	"screen_resolution" varchar(20),
	"country" varchar(2),
	"region" varchar(255),
	"referrer" varchar(1024),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"utm_term" varchar(255),
	"utm_content" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "analytics_visitas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"pathname" varchar(1024) NOT NULL,
	"title" varchar(1024),
	"duration_ms" integer,
	"scroll_depth_pct" smallint,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_visitas" ADD CONSTRAINT "analytics_visitas_session_id_analytics_sesiones_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."analytics_sesiones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_sesiones_visitor" ON "analytics_sesiones" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "idx_sesiones_started" ON "analytics_sesiones" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "idx_sesiones_visitor_started" ON "analytics_sesiones" USING btree ("visitor_id","started_at");--> statement-breakpoint
CREATE INDEX "idx_visitas_session" ON "analytics_visitas" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_visitas_pathname" ON "analytics_visitas" USING btree ("pathname");--> statement-breakpoint
CREATE INDEX "idx_visitas_viewed" ON "analytics_visitas" USING btree ("viewed_at");--> statement-breakpoint
CREATE INDEX "idx_visitas_session_viewed" ON "analytics_visitas" USING btree ("session_id","viewed_at");