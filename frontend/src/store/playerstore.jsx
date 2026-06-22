import { create } from 'zustand'

const usePlayerStore = create((set, get) => ({
    track:{
        url:null,
        name:null,
        authors:null,
        cover:null
    },
    current:0,
    isPause:true,

    setTrack:(track) => set({track, isPause:false}),
    setCurrent:(current)=>set({current}),
    setIsPause:(isPause)=>set({isPause})
}))

export default usePlayerStore