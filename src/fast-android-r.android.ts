import { Application } from "@nativescript/core";
const classHandler = {
    get: function (object: { [className: string]: { [property: string]: number } }, property: string) {
        const className = (Application.android.packageName || "android") + ".R$" + property;
        if (!object.hasOwnProperty(property)) {
            try {
                object[property] = new Proxy({ __parentClass: java.lang.Class.forName(className) }, methodHandler);
            } catch (e) {
                object[property] = undefined;
            }
        }
        return object[property];
    }
};

const methodHandler = {
    get: function (object: { [property: string]: any; __parentClass: any }, property: string) {
        if (!object.hasOwnProperty(property)) {
            try {
                object[property] = +object.__parentClass.getField(property).get(null);
            } catch (e) {
                object[property] = undefined;
            }
        }
        return object[property];
    }
};


export const androidR = new Proxy<{ [className: string]: { [field: string]: number } }>({}, classHandler);
