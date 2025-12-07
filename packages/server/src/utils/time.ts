export function dateFormat(date: Date) {
    return new Intl.DateTimeFormat('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date)
}