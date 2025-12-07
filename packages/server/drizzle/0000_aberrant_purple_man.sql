CREATE TABLE "invest_candles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"instrument_id" varchar NOT NULL,
	"interval" varchar,
	"time" timestamp,
	"open" numeric,
	"close" numeric,
	"low" numeric,
	"high" numeric,
	"diff" numeric NOT NULL,
	"diff_day" numeric,
	"diff_low" numeric,
	"diff_high" numeric,
	"volume" numeric,
	"is_complete" boolean
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
	"strategy_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invest_suggestions" ADD CONSTRAINT "invest_suggestions_strategy_id_invest_strategies_id_fk" FOREIGN KEY ("strategy_id") REFERENCES "public"."invest_strategies"("id") ON DELETE cascade ON UPDATE no action;

INSERT INTO invest_strategies ("description") VALUES ("Берем когда растет, продаем когда падает")