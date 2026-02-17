-- Custom SQL migration file, put your code below! --
-- Change password in PROD AND REMOVE SELECT --
SELECT
INSERT INTO "users" (
	"login",
	"password"
) VALUES ('super-admin', 'd7b27f2e6e22a6424ec0e51bad079708')