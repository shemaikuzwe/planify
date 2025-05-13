export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"|"FAILED"
export type Drawing={
    id:string|null,
    lastUpdated:Date,
    elements:any,
}
export type Actions={
    removeAll:()=>void,
    addElement:(element:string)=>void,
    updateElement:(element:any)=>void,
    removeElement:(element:string)=>void,
    updateLastUpdated:()=>void,
    addId:(id:string|null)=>void,
}

export type Store={
    drawing:Drawing,
}