ALTER TYPE "role" ADD VALUE 'ADMIN';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'MEMBER';--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "role" SET DEFAULT 'MEMBER';--> statement-breakpoint
ALTER TABLE "workspaces" ADD COLUMN "invite_code" text;