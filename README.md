# invest


## Пример маппинга директории public

```nginx
# Optional: Serve built static files directly and add long-term caching
location /public {
    alias /www/wwwroot/alcoinvest.ru/packages/server/public;
    expires 5d; # Can cache for a long time due to hashed filenames
}
```