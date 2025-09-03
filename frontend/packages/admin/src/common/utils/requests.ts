export async function request<R = unknown>(url: string, options?: RequestInit) {
    const result = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    return await result.json() as R;
}

export async function GET<R = unknown>(url: string, options?: RequestInit) {
    return request<R>(url, {
        ...options,
        method: 'GET',
    });
}

export async function POST<R = unknown, D = unknown>(url: string, data: D, options?: RequestInit) {
    return request<R>(url, {
        ...options,
        method: 'POST',
        body: typeof data === 'string' ? data : JSON.stringify(data),
    });
}

export async function PUT<R = unknown, D = unknown>(url: string, data: D, options?: RequestInit) {
    return request<R>(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function DELETE<R = unknown>(url: string, options?: RequestInit) {
    return request<R>(url, {
        ...options,
        method: 'DELETE',
    });
}