import { makeAutoObservable } from "mobx";

export class DrawerStore {
    rootStore;

    drawerOpen; // control drawer 

    constructor(rootstore) {
        this.rootStore = rootstore;
        this.drawerOpen = true;

        makeAutoObservable(this);
    }

    set DrawerOpen(status){
        this.drawerOpen = status;
    }

    Reset(){
        this.drawerOpen = true;
    }

}