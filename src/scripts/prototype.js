Object.defineProperty(Array.prototype, "max", {
    value: function (f) {
        return this.reduce((max, v) => { f(v) > max ? max = f(v) : max = max; return max;}, -Infinity);
    }
});

Object.defineProperty(Array.prototype, "groupBy", {
    value: function (k, f) {
        return this.reduce((g, v) => {g[k(v)] ? g[k(v)].push(f ? f(v) : v) : g[k(v)] = [f ? f(v) : v]; return g;}, {});
    }
});

Object.defineProperty(Array.prototype, "orderBy", {
    value: function (f) {
        return [...this].sort(function (a, b) {
            return (f(a) > f(b)) ? 1 : (f(a) < f(b)) ? -1 : 0;
        });
    }
});

Object.defineProperty(Array.prototype, "sum", {
    value: function (f) {
        return this.reduce((s, v) => s += f ? f(v) : v, 0);
    }
});