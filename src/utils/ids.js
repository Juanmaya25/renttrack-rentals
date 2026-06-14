export const nextId = arr => (arr.length ? Math.max(...arr.map(x => x.id)) : 0) + 1;
