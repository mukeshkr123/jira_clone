DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"user_id" text,
	"workspace_id" text,
	"role" "role" DEFAULT 'member'
);
