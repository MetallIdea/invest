CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar NOT NULL,
	"account_id" varchar NOT NULL,
	"money" numeric NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invest_candles" ALTER COLUMN "time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invest_candles" ALTER COLUMN "low" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invest_candles" ALTER COLUMN "high" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;