import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronRight, LoaderCircle, SearchIcon } from "lucide-react"
import { FoundTrack, SongCard, SongCardSkeleton, SongRequestState } from "../SongRequest"
import { Dispatch, MouseEventHandler, SetStateAction, useEffect, useState } from "react"
import { useDebounceCallback } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

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

export const SelectSongLayout = ({ selectedSong, set }: { selectedSong: FoundTrack | null, set: Dispatch<SetStateAction<SongRequestState>> }) => {
    const [state, setState] = useState<SelectSongLayoutState>({
        searchResults: null,
        loaded: true,
    });
    const navigate = useNavigate();
    const searchTracksCallback = useDebounceCallback(searchTracks, 500);

    useEffect(() => set(p => ({...p, selectedSong: null})), [state]);

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
                    {!state.loaded ? <SongCardSkeleton /> : <>
                        {state.searchResults === null && <span className="w-full text-center text-neutral-500">Начните вводить запрос</span> }
                        {state.searchResults !== null && <>
                            {state.searchResults.map(track => <SongCard
                                key={track.id}
                                track={track}
                                selected={selectedSong === track}
                                onClick={() => set(p => ({ ...p, selectedSong: track }))} />
                            )}
                            {state.searchResults.length === 0 && <span className="w-full text-center text-neutral-500">Ничего не найдено</span>}
                        </>}
                    </>}
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => navigate("/send")} disabled={selectedSong === null}>
                    Далее
                    <ChevronRight className="w-6 h-6 ml-1" />
                </Button>
            </CardFooter>
        </Card>
    </>
}