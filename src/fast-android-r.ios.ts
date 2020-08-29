
const classHandler = {
    get: function (object: { [className: string]: { [property: string]: number } }, property: string) {
        throw new Error("android.R isn't present on iOS");
    }
};

export const androidR = new Proxy<{ [className: string]: { [field: string]: number } }>({}, classHandler);
