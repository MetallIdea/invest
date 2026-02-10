plink -ssh root@194.87.46.227 -P 8988 -batch "rm -f -r /www/wwwroot/alcoinvest.ru/packages/scheduler/.next/server /www/wwwroot/alcoinvest.ru/packages/scheduler/.next/static /www/wwwroot/alcoinvest.ru/packages/scheduler/package.json"
pscp -r ./packages/scheduler/.next/server root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/scheduler/.next/
pscp -r ./packages/scheduler/.next/static root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/scheduler/.next/
pscp -r ./packages/scheduler/.next/node_modules root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/scheduler/.next/
pscp -r ./packages/scheduler/.next/*.json root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/scheduler/.next/
pscp -r ./packages/scheduler/.next/BUILD_ID root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/scheduler/.next/
pscp -r ./packages/scheduler/package.json root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/scheduler/
plink -ssh root@194.87.46.227 -P 8988 -batch "cd /www/wwwroot/alcoinvest.ru; npm i --omit=dev"