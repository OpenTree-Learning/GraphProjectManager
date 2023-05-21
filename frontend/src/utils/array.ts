export function arr2obj(arr: any []): any [] {
    return arr.reduce(
        (acc, curr) => {
            let key = curr[0];
            let value = curr[1];

            acc[key] = value;

            return acc;
        },
        {}
    );
}
