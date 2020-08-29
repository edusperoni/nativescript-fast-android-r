import { Observable, PropertyChangeData } from "tns-core-modules/data/observable";
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
    currentRFields = this.rFields[this.classSelectedIndex];
    constructor() {
        super();
        this.remapAndroidR();
        this.on("propertyChange", (v: PropertyChangeData) => {
            if(v.propertyName === "classSelectedIndex") {
                this.setCurrentRFields(v.value);
            }
        });
        this.set("classSelectedIndex", this.rClasses.indexOf("integer"));
    }

    onClassListPickerLoaded(evt) {
        // evt.object.on("selectedIndexChange", (v) => {
        //     this.setCurrentRFields(v.value);
        // });
    }

    setCurrentRFields(currentClass: number) {
        currentClass = currentClass < this.rFields.length ?currentClass : 0;
        this.set('fieldSelectedIndex', 0);
        this.set("currentRFields", this.rFields[currentClass]);
    }

    androidRload() {
        const startTime = time();
        this.set("androidRval", android.R[this.rClasses[this.classSelectedIndex]][this.rFields[this.classSelectedIndex][this.fieldSelectedIndex]]);
        this.set("androidRtimeToLoad", time() - startTime);
        console.log(java.lang.Class.forName("android.R").getClasses());
    }

    fastAndroidRload() {
        const startTime = time();
        this.set("fastAndroidRval", androidR[this.rClasses[this.classSelectedIndex]][this.rFields[this.classSelectedIndex][this.fieldSelectedIndex]]);
        this.set("fastAndroidRtimeToLoad", time() - startTime);
    }

    remapAndroidR() {
        const fields = [];
        const classes = Array.from(java.lang.Class.forName("android.R").getClasses()).map((v) => {
            fields.push(Array.from(java.lang.Class.forName(v.getName()).getFields()).map((v) => v.getName()));
            return v.getName().split("$")[1];
        });

        this.set("rClasses", classes);
        this.set("rFields", fields);
        this.setCurrentRFields(this.classSelectedIndex);
        
    }
}
