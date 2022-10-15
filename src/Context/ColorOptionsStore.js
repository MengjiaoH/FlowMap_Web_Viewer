import { makeAutoObservable } from "mobx";

export class ColorOptionsStore {
    rootStore;

    constant_color;
    attribute_data;
    data_range;
    attribute_dims;

    constructor(rootstore) {
        this.rootStore = rootstore;
        this.constant_color = '#277BC0';
        this.attribute_data = [];
        this.data_range = [];
        this.attribute_dims = [128, 128, 128];

    

        makeAutoObservable(this);
    }

    set ConstantColor(color){
        this.constant_color = color;
    }

    set setAttributeData(data){
        this.attribute_data = data;
    }

    set setAttributeRange(range){
        this.data_range = range;
    }


    Reset(){
        this.constant_color = '#277BC0';
    }

}