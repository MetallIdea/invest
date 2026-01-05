CREATE TABLE "invest_candles_params" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"candle_id" uuid NOT NULL,
	"sma200" numeric,
	"ema50" numeric,
	"tr" numeric,
	"atr14" numeric
);
--> statement-breakpoint
ALTER TABLE "invest_candles_params" ADD CONSTRAINT "invest_candles_params_candle_id_invest_candles_id_fk" FOREIGN KEY ("candle_id") REFERENCES "public"."invest_candles"("id") ON DELETE cascade ON UPDATE no action;