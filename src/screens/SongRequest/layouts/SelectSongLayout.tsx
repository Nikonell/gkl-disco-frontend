import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronRight, SearchIcon } from "lucide-react"
import { SongRequestState } from "../SongRequest"
import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from "react"
import { useDebounceCallback } from "@/lib/utils"

interface FoundTrack {
    id: number;
    title: string;
    artist_names: string[];
    cover_url: string;
    explicit: boolean;
}

const searchTracks = async (text: string, set: Dispatch<SetStateAction<FoundTrack[]>>): Promise<void> => {
    if (text.length === 0) return;
    const res = await fetch(`/api/search_tracks?text=${encodeURIComponent(text)}`);
    if (!res.ok) return;
    const data = await res.json();
    set(data);
}

export const SelectSongLayout = ({ state, setState }: { state: SongRequestState, setState: Dispatch<SetStateAction<SongRequestState>> }) => {
    const [seacrhResults, setSeacrhResults] = useState<FoundTrack[]>([]);
    const searchTracksCallback = useDebounceCallback(searchTracks, 500);

    return <>
        <Card className="w-full lg:w-1/3 mx-4 my-2 h-fit max-h-[70vh]">
            <CardHeader>
                <CardTitle>Заказ музыки</CardTitle>
                <CardDescription>Выберите песню, которую хотите заказать</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="w-full relative">
                    <Input placeholder="Название песни"
                        onChange={e => searchTracksCallback(e.target.value.trim(), setSeacrhResults)} />
                    <SearchIcon className="text-neutral-400 absolute right-3 top-1/2 w-6 h-6 -translate-y-1/2" />
                </div>
                <div className="w-full flex flex-col gap-2 max-h-[calc(70vh-16rem)] overflow-y-auto">
                    {seacrhResults.map(track => <TrackCard 
                        key={track.id}
                        track={track}
                        selected={state.selectedSongId === +track.id}
                        onClick={() => setState(p => ({...p, selectedSongId: +track.id}))} />
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled={state.selectedSongId === null}>
                    Далее
                    <ChevronRight className="w-6 h-6 ml-1" />
                </Button>
            </CardFooter>
        </Card>
    </>
}

const TrackCard = ({ track, selected, onClick }: { track: FoundTrack, selected: boolean, onClick: MouseEventHandler }) => {
    return <Card className={`w-full cursor-pointer ${selected ? "border-neutral-700" : ""}`} onClick={onClick}>
        <CardContent className="p-2 xl:p-3 flex flex-row gap-2 items-center">
            <img src={"https://" + track.cover_url.replace("%%", "200x200")} alt="cover" className="w-1/4 aspect-square rounded-lg" />
            <div className="flex-1 flex flex-col gap-0">
                <span className="md:text-xl font-semibold">{track.title}</span>
                <span className="text-sm">{track.artist_names.join(", ")}</span>
            </div>
        </CardContent>
    </Card>
}