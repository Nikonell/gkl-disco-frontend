import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw } from "lucide-react"
import { FoundTrack, SongCard, SongRequestState } from "../SongRequest";
import { useNavigate } from "react-router";
import SuccessIcon from "@/assets/success-icon.svg?react";
import FailureIcon from "@/assets/failure-icon.svg?react";
import { Dispatch, SetStateAction } from "react";

export const ResultLayout = ({ state, set }: { state: SongRequestState, set: Dispatch<SetStateAction<SongRequestState>> }) => {
    const navigate = useNavigate();

    return <Card className="w-full lg:w-1/3 mx-4 my-2 h-fit max-h-[70vh]">
        <CardHeader>
            <CardTitle>Заказ музыки</CardTitle>
            <CardDescription>Заявка отправлена</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-4">
            {state.selectedSong != null && <SongCard track={state.selectedSong as FoundTrack} selected={false} onClick={() => { }} />}
            {state.sentRequest?.explicit_correct && state.sentRequest?.artist_correct ? <div className="w-full flex flex-col items-center gap-2">
                <SuccessIcon className="w-1/4 h-1/4 fill-lime-500" />
                <span className="w-full text-center font-medium text-lg">Модерация пройдена успешно</span>
            </div> : <div className="w-full flex flex-col items-center">
                <FailureIcon className="w-1/4 h-1/4 self-center fill-red-600" />
                <span className="w-full text-center font-medium text-lg mt-2">Модерация не пройдена</span>
                { !state.sentRequest?.artist_correct && <span className="w-full text-center text-sm">Исполнитель находится в списке запрещённых.</span> }
                { !state.sentRequest?.explicit_correct && <span className="w-full text-center text-sm">Текст песни содержит ненормативную лексику или матриалы провокационного/непристойного характера.</span> }
            </div>}
        </CardContent>
        <CardFooter>
            <Button className="w-full" onClick={() => {
                set(p => ({ ...p, selectedSong: null, sentRequest: null }));
                navigate("/");
            }}>
                Заказать ещё
                <RotateCcw className="w-4 h-4 ml-2" />
            </Button>
        </CardFooter>
    </Card>
}