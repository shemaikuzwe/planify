import { create } from "zustand";
import { Actions, Store } from "../types";
import { persist } from "zustand/middleware"

export const useStore = create(persist<Store & Actions>(
    (set) => ({
        drawing: {
            id: localStorage.getItem('excalidraw_id') || null,
            lastUpdated: new Date(localStorage.getItem('excalidraw_lastUpdated') || ''),
            elements: localStorage.getItem('excalidraw_elements') || "",
        },
        removeAll: () => set({ drawing: { id: "", lastUpdated: new Date(), elements: "" } }),
        addElement: (element: string) => set((state) => ({ drawing: { ...state.drawing, elements: state.drawing.elements + element } })),
        updateElement: (element: any) => set((state) => ({ drawing: { ...state.drawing, elements: element } })),
        removeElement: (element: string) => set((state) => ({ drawing: { ...state.drawing, elements: state.drawing.elements.replace(element, "") } })),
        updateLastUpdated: () => set((state) => ({ drawing: { ...state.drawing, lastUpdated: new Date() } })),
        addId: (id: string|null) => set((state) => ({ drawing: { ...state.drawing, id } }))

    }), {
    name: "drawing"
}))