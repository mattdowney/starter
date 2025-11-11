CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"source" varchar(100),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
