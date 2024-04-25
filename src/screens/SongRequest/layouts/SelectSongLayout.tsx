import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronRight, LoaderCircle, SearchIcon } from "lucide-react"
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

interface SelectSongLayoutState {
    searchResults: FoundTrack[] | null;
    loaded: boolean;
}

const searchTracks = async (text: string, set: Dispatch<SetStateAction<SelectSongLayoutState>>): Promise<void> => {
    if (text.length === 0) return;
    set(p => ({...p, loaded: false}));
    const res = await fetch(`/api/search_tracks?text=${encodeURIComponent(text)}`);
    if (!res.ok) return;
    const data = await res.json();
    set(p => ({...p, searchResults: data, loaded: true}));
}

export const SelectSongLayout = ({ selectedSongId, set }: { selectedSongId: number | null, set: Dispatch<SetStateAction<SongRequestState>> }) => {
    const [state, setState] = useState<SelectSongLayoutState>({
        searchResults: null,
        loaded: true,
    });
    const searchTracksCallback = useDebounceCallback(searchTracks, 500);

    useEffect(() => set(p => ({...p, selectedSongId: null})), [state]);

    return <>
        <Card className="w-full lg:w-1/3 mx-4 my-2 h-fit max-h-[70vh]">
            <CardHeader>
                <CardTitle>Заказ музыки</CardTitle>
                <CardDescription>Выберите песню, которую хотите заказать</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pb-2">
                <div className="w-full relative">
                    <Input placeholder="Название песни"
                        onChange={e => searchTracksCallback(e.target.value.trim(), setState)} />
                    <SearchIcon className="text-neutral-400 absolute right-3 top-1/2 w-6 h-6 -translate-y-1/2" />
                </div>
                <div className="w-full flex flex-col gap-2 min-h-10 max-h-[calc(70vh-16rem)] overflow-y-auto">
                    {!state.loaded ? <LoaderCircle className="w-8 h-8 self-center animate-spin" /> : <>
                        {state.searchResults === null && <span className="w-full text-center text-neutral-500">Начните пичать запрос</span> }
                        {state.searchResults !== null && <>
                            {state.searchResults.map(track => <TrackCard
                                key={track.id}
                                track={track}
                                selected={selectedSongId === +track.id}
                                onClick={() => set(p => ({ ...p, selectedSongId: +track.id }))} />
                            )}
                            {state.searchResults.length === 0 && <span className="w-full text-center text-neutral-500">Ничего не найдено</span>}
                        </>}
                    </>}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" disabled={selectedSongId === null}>
                    Далее
                    <ChevronRight className="w-6 h-6 ml-1" />
                </Button>
            </CardFooter>
        </Card>
    </>
}

const TrackCard = ({ track, selected, onClick }: { track: FoundTrack, selected: boolean, onClick: MouseEventHandler }) => {
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