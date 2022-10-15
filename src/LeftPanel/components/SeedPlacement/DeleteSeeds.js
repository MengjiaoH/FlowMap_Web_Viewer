function DeleteSeeds(store){
    const selected_pipeline = store.pipeline_selected;
    
    store.renderStore.DeleteSeeds(selected_pipeline);
}

export default DeleteSeeds;