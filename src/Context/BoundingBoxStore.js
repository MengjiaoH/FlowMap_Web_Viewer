import { makeAutoObservable } from "mobx";

export class BoundingBoxStore {
    rootStore;
    color;
    is_visible; 

    constructor(rootstore) {
        this.rootStore = rootstore;
        this.is_visible = true;
        this.color = 'black';

        makeAutoObservable(this);
    }

    set BoundingBoxVisibility(status){
        this.is_visible = status;
    }

    UpdateColor(color){
       this.color = color;
    }

    Reset(){
        this.is_visible = true;
        this.color = 'black';
    }

}