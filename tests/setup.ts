function makeMockVector(x = 0, y = 0) {
    const v: any = { x, y };
    v.set = (nx: number, ny: number) => {
        v.x = nx;
        v.y = ny;
        return v;
    };
    v.add = (nx: number, ny: number) => {
        v.x += nx;
        v.y += ny;
        return v;
    };
    v.copy = () => makeMockVector(v.x, v.y);
    return v;
}

(globalThis as any).createVector = (x = 0, y = 0) => makeMockVector(x, y);
(globalThis as any).deltaTime = 16;
