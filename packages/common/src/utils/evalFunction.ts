export function evalFunction(code: string, ctx:  any) {
    let func = new Function('ctx', code);
    
    return func(ctx);
}