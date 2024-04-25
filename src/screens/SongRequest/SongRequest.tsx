import { Route, Routes } from "react-router";
import { SelectSongLayout } from "./layouts/SelectSongLayout";
import { useState } from "react";

export interface SongRequestState {
    selectedSongId: number | null;
}

export const SongRequestScreen = () => {
    const [state, setState] = useState<SongRequestState>({
        selectedSongId: null,
    });

    return <>
        <div className="w-full h-screen max-w-screen flex justify-center items-center">
            <Routes>
                <Route path="/" element={<SelectSongLayout selectedSongId={state.selectedSongId} set={setState} />} />
            </Routes>
        </div>
    </>
}