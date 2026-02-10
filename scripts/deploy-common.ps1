pscp -r ./packages/common/drizzle root@194.87.46.227:/www/wwwroot/alcoinvest.ru/packages/common/
plink -ssh root@194.87.46.227 -P 8988 -batch "cd /www/wwwroot/alcoinvest.ru/packages/common; npm run migrate"
plink -ssh root@194.87.46.227 -P 8988 -batch "rm -f -r /www/wwwroot/alcoinvest.ru/packages/common/drizzle"