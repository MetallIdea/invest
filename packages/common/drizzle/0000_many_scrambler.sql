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
CREATE TABLE "invest_candles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"share_id" uuid NOT NULL,
	"interval" varchar,
	"time" timestamp NOT NULL,
	"open" numeric NOT NULL,
	"close" numeric NOT NULL,
	"low" numeric NOT NULL,
	"high" numeric NOT NULL,
	"diff" numeric NOT NULL,
	"diff_low" numeric NOT NULL,
	"diff_high" numeric NOT NULL,
	"volume" numeric,
	"is_complete" boolean,
	"sma27" numeric,
	"sma50" numeric,
	"sma200" numeric,
	"macd" numeric,
	"signal" numeric,
	"signal_value" numeric,
	"ema9" numeric,
	"ema12" numeric,
	"ema26" numeric,
	"ema50" numeric,
	"tr" numeric,
	"atr14" numeric
);
--> statement-breakpoint
CREATE TABLE "invest_candles_params" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar,
	"description" varchar,
	"order" numeric,
	"calculate" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invest_candles_params_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"candle_id" uuid NOT NULL,
	"param_id" uuid NOT NULL,
	"value" numeric
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
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"name" varchar NOT NULL,
	"schedule" varchar NOT NULL,
	"method" varchar NOT NULL,
	"last_run" timestamp,
	"next_run" timestamp,
	"is_enabled" boolean,
	"is_running" boolean
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
	"ticker" varchar,
	"lot" numeric
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
	"instrument_id" uuid NOT NULL,
	"time" timestamp,
	"buy" numeric,
	"sell" numeric,
	"buy_time" timestamp,
	"sell_time" timestamp,
	"max" numeric,
	"false_positive" boolean DEFAULT false,
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
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_candles" ADD CONSTRAINT "invest_candles_share_id_invest_shares_id_fk" FOREIGN KEY ("share_id") REFERENCES "public"."invest_shares"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_candles_params_values" ADD CONSTRAINT "invest_candles_params_values_candle_id_invest_candles_id_fk" FOREIGN KEY ("candle_id") REFERENCES "public"."invest_candles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_candles_params_values" ADD CONSTRAINT "invest_candles_params_values_param_id_invest_candles_params_id_fk" FOREIGN KEY ("param_id") REFERENCES "public"."invest_candles_params"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_deals" ADD CONSTRAINT "invest_deals_share_id_invest_shares_id_fk" FOREIGN KEY ("share_id") REFERENCES "public"."invest_shares"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_portfolio" ADD CONSTRAINT "invest_portfolio_share_id_invest_shares_id_fk" FOREIGN KEY ("share_id") REFERENCES "public"."invest_shares"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_suggestions" ADD CONSTRAINT "invest_suggestions_instrument_id_invest_shares_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."invest_shares"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invest_suggestions" ADD CONSTRAINT "invest_suggestions_strategy_id_invest_strategies_id_fk" FOREIGN KEY ("strategy_id") REFERENCES "public"."invest_strategies"("id") ON DELETE cascade ON UPDATE no action;