import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
import { Application } from "@nativescript/core";
import { time } from "tns-core-modules/profiling";
import { androidR } from "nativescript-fast-android-r";

export class HomeViewModel extends Observable {

    androidRval?: number;
    androidRtimeToLoad?: number;
    fastAndroidRval?: number;
    fastAndroidRtimeToLoad?: number;
    classSelectedIndex = 0;
    fieldSelectedIndex = 0;
    rClasses = ["config_longAnimTime", "config_shortAnimTime"];
    rFields = [["a"], ["b"]];
    get currentClassName() {
        if (this.classSelectedIndex > this.rClasses.length) {
            return "";
        }
        return this.rClasses[this.classSelectedIndex];
    }
    get currentFieldName() {
        if(this.classSelectedIndex > this.rFields.length || this.fieldSelectedIndex > this.rFields[this.classSelectedIndex].length) {
            return "";
        }
        return this.rFields[this.classSelectedIndex][this.fieldSelectedIndex];
    }
    currentRFields = this.rFields[this.classSelectedIndex];
    classname = "android.R.";
    constructor() {
        super();
        this.remapAndroidR();
        this.on("propertyChange", (v: PropertyChangeData) => {
            if(v.propertyName === "classSelectedIndex") {
                this.setCurrentRFields(v.value);
            }
            if (v.propertyName === "classSelectedIndex" || v.propertyName === "fieldSelectedIndex") {
                this.updatePropertyName();
            }
        });
        this.set("classSelectedIndex", this.rClasses.indexOf("integer"));
    }

    updatePropertyName() {
        this.set("classname", `android.R.${this.currentClassName}.${this.currentFieldName}`);
    }

    onClassListPickerLoaded(evt) {
        // evt.object.on("selectedIndexChange", (v) => {
        //     this.setCurrentRFields(v.value);
        // });
    }

    setCurrentRFields(currentClass: number) {
        currentClass = currentClass < this.rFields.length ? currentClass : 0;
        this.set('fieldSelectedIndex', 0);
        this.set("currentRFields", this.rFields[currentClass]);
    }

    androidRload() {
        const startTime = time();
        const p = eval(Application.android && Application.android.packageName || "android");
        this.set("androidRval", p.R[this.rClasses[this.classSelectedIndex]][this.rFields[this.classSelectedIndex][this.fieldSelectedIndex]]);
        this.set("androidRtimeToLoad", time() - startTime);
    }

    fastAndroidRload() {
        const startTime = time();
        this.set("fastAndroidRval", androidR[this.rClasses[this.classSelectedIndex]][this.rFields[this.classSelectedIndex][this.fieldSelectedIndex]]);
        this.set("fastAndroidRtimeToLoad", time() - startTime);
    }

    remapAndroidR() {
        const packageName = Application.android && Application.android.packageName || "android";
        const fields = [];
        const classes = Array.from(java.lang.Class.forName( packageName + ".R").getClasses()).map((v) => {
            fields.push(Array.from(java.lang.Class.forName(v.getName()).getFields()).map((v) => v.getName()));
            return v.getName().split("$")[1];
        });

        this.set("rClasses", classes);
        this.set("rFields", fields);
        this.setCurrentRFields(this.classSelectedIndex);
        
    }
}
