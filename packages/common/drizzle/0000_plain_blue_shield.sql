CREATE TABLE "invest_candles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"instrument_id" varchar NOT NULL,
	"interval" varchar,
	"time" timestamp,
	"open" numeric NOT NULL,
	"close" numeric NOT NULL,
	"low" numeric,
	"high" numeric,
	"diff" numeric NOT NULL,
	"diff_low" numeric NOT NULL,
	"diff_high" numeric NOT NULL,
	"volume" numeric,
	"is_complete" boolean
);
--> statement-breakpoint
CREATE TABLE "invest_deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"share_id" uuid NOT NULL,
	"price" numeric NOT NULL,
	"count" integer NOT NULL,
	"is_buy" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invest_portfolio" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"share_id" uuid NOT NULL,
	"count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invest_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar,
	"figi" varchar NOT NULL,
	"country_of_risk" varchar,
	"sector" varchar,
	"ticker" varchar
);
--> statement-breakpoint
CREATE TABLE "invest_strategies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar NOT NULL,
	"description" varchar
);
--> statement-breakpoint
CREATE TABLE "invest_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"instrument_id" varchar NOT NULL,
	"time" timestamp,
	"buy" numeric,
	"sell" numeric,
	"buy_time" timestamp,
	"sell_time" timestamp,
	"strategy_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"login" varchar NOT NULL,
	"password" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invest_deals" ADD CONSTRAINT "invest_deals_share_id_invest_shares_id_fk" FOREIGN KEY ("share_id") REFERENCES "public"."invest_shares"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_portfolio" ADD CONSTRAINT "invest_portfolio_share_id_invest_shares_id_fk" FOREIGN KEY ("share_id") REFERENCES "public"."invest_shares"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_suggestions" ADD CONSTRAINT "invest_suggestions_strategy_id_invest_strategies_id_fk" FOREIGN KEY ("strategy_id") REFERENCES "public"."invest_strategies"("id") ON DELETE cascade ON UPDATE no action;