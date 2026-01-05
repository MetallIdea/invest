plink -ssh root@194.87.46.227 -P 8988 -batch "rm -f -r /www/wwwroot/alcoinvest.ru/packages/server/.next/server /www/wwwroot/alcoinvest.ru/packages/server/.next/static /www/wwwroot/alcoinvest.ru/packages/server/package.json"
pscp -r ./packages/server/.next/server root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/server/.next/
pscp -r ./packages/server/.next/static root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/server/.next/
pscp -r ./packages/server/.next/*.json root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/server/.next/
pscp -r ./packages/server/.next/BUILD_ID root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/server/.next/
pscp -r ./packages/server/package.json root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/server/
plink -ssh root@194.87.46.227 -P 8988 -batch "cd /www/wwwroot/alcoinvest.ru; npm i"