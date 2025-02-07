import { Route, Routes } from "react-router";
import { SelectSongLayout } from "./layouts/SelectSongLayout";
import { MouseEventHandler, useState } from "react";
import { SendRequestLayout } from "./layouts/SendRequestLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultLayout } from "./layouts/ResultLayout";

export interface FoundTrack {
    id: number;
    title: string;
    artist_names: string[];
    cover_url: string;
    explicit: boolean;
}

export interface SentRequest {
    id: number;
    created_at: string;
    yandex_id: number;
    song_name: string;
    artist_names: string;
    say_hello: boolean;
    hello_from: string | null;
    hello_to: string | null;
    hello_text: string | null;
    explicit_correct: boolean;
    artist_correct: boolean;
    expert_mark: boolean | null;
}

export interface SongRequestState {
    selectedSong: FoundTrack | null;
    sentRequest: SentRequest | null;
}

export const SongRequestScreen = () => {
    const [state, setState] = useState<SongRequestState>({
        selectedSong: null,
        sentRequest: null,
    });

    return <>
        <div className="w-full h-screen max-w-screen flex justify-center items-center">
            <Routes>
                <Route path="/" element={<SelectSongLayout selectedSong={state.selectedSong} set={setState} />} />
                <Route path="send" element={<SendRequestLayout selectedSong={state.selectedSong} set={setState} />} />
                <Route path="result" element={<ResultLayout state={state} set={setState} />} />
            </Routes>
        </div>
    </>
}

export const SongCard = ({ track, selected, onClick }: { track: FoundTrack, selected: boolean, onClick: MouseEventHandler }) => {
    return <Card className={`w-full cursor-pointer ${selected ? "border-neutral-700" : ""}`} onClick={onClick}>
        <CardContent className="p-2 xl:p-3 flex flex-row gap-4">
            <img src={"https://" + track.cover_url.replace("%%", "200x200")} alt="cover" className="w-1/4 aspect-square rounded-lg" />
            <div className="flex-1 flex flex-col gap-0 py-0">
                <span className="md:text-xl font-semibold">{track.title}</span>
                <span className="text-sm">{track.artist_names.join(", ")}</span>
            </div>
        </CardContent>
    </Card>
}

export const SongCardSkeleton = () => {
    return <Card className="w-full">
        <CardContent className="p-2 xl:p-3 flex flex-row gap-4">
            <Skeleton className="w-1/4 aspect-square rounded-lg" />
            <div className="flex-1 flex flex-col gap-2 py-1">
                <Skeleton className="w-2/3 h-4" />
                <Skeleton className="w-1/2 h-3" />
            </div>
        </CardContent>
    </Card>
}