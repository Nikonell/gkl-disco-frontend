import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FoundTrack, SongRequestState } from "../SongRequest";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SongCard } from "../SongRequest";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SendRequestLayoutState {
    sayHello: boolean;
    helloFrom: string | null;
    helloTo: string | null;
    helloText: string | null;
}

const sendRequestHandler = async (selectedSong: FoundTrack | null, state: SendRequestLayoutState, set: Dispatch<SetStateAction<SongRequestState>>, navigate: NavigateFunction) => {
    const res = await fetch("/api/song_requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            yandex_id: selectedSong?.id,
            say_hello: state.sayHello,
            hello_from: state.helloFrom,
            hello_to: state.helloTo,
            hello_text: state.helloText,
        }),
    });
    if (!res.ok) return;
    const data = await res.json();
    console.log(data);
    set(p => ({...p, sentRequest: data}));
    navigate("/result");
}

export const SendRequestLayout = ({ selectedSong, set }: { selectedSong: FoundTrack | null, set: Dispatch<SetStateAction<SongRequestState>> }) => {
    const navigate = useNavigate();
    const [state, setState] = useState<SendRequestLayoutState>({
        sayHello: false,
        helloFrom: null,
        helloTo: null,
        helloText: null,
    });

    const switchHello = () => {
        if (!state.sayHello) setState(p => ({...p, sayHello: true}));
        else setState(p => ({...p, sayHello: false, helloFrom: null, helloTo: null, helloText: null}));
    }

    useEffect(() => {
        if (selectedSong === null) navigate("/");
    }, []);

    return <>
        <Card className="w-full lg:w-1/3 mx-4 my-2 h-fit max-h-[70vh]">
            <CardHeader>
                <CardTitle>Заказ музыки</CardTitle>
                <CardDescription>Укажите дополнительные данные</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pb-4">
                {selectedSong != null && <SongCard track={selectedSong as FoundTrack} selected={false} onClick={() => {}} />}
                <div className="flex flex-row gap-2 items-center">
                    <Switch id="say-hello" checked={state.sayHello} onClick={switchHello} />
                    <Label htmlFor="say-hello">Передать привет</Label>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hello-from">От кого</Label>
                    <Input type="text" id="hello-from" placeholder="От кого" disabled={!state.sayHello} 
                        value={state.helloFrom || ""} onChange={e => setState(p => ({...p, helloFrom: e.target.value}))}/>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hello-to">Кому</Label>
                    <Input type="text" id="hello-to" placeholder="Кому" disabled={!state.sayHello}
                        value={state.helloTo || ""} onChange={e => setState(p => ({...p, helloTo: e.target.value}))}/>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hello-text">Комментарий</Label>
                    <Input type="text" id="hello-text" placeholder="Комментарий" disabled={!state.sayHello} 
                        value={state.helloText || ""} onChange={e => setState(p => ({...p, helloText: e.target.value}))}/>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => sendRequestHandler(selectedSong, state, set, navigate)}>
                    Отправить
                    <SendHorizonal className="w-4 h-4 ml-2" />
                </Button>
            </CardFooter>
        </Card>
    </>
}