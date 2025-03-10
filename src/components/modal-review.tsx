import {createPortal} from "react-dom";
import React, {useEffect, useState} from "react";
import Pose, { PoseType } from "@/components/pose/pose";
import api from "@/api";

type PropsType = {
    isModalOpen: Boolean
    result_prediction_id: Number | null
    onCloseReviewModal: () => void
    poses: any
}

const QuestionOne = (props: any) => {
    const {setFalse, setNull, setTrue} = props

    return (
        <div className="flex flex-col gap-4">
            <div className="text-black underline text-xl">Правильно ли нейронная сеть распознала асану?</div>
            <div className="flex flex-row gap-2 w-1/2">
                <button
                    className="text-center bg-primary text-white font-bold w-2/5 rounded-xl p-2"
                    onClick={setTrue}
                >
                    Да
                </button>
                <button
                    className="text-center bg-red-600 text-white font-bold w-2/5 rounded-xl p-2"
                    onClick={setFalse}
                >
                    Нет
                </button>
                <button
                    className="text-center bg-secondary text-white font-bold w-2/5 rounded-xl p-2"
                    onClick={setNull}
                >
                    Не знаю
                </button>
            </div>
        </div>
    )
}

const QuestionTwo = (props: any) => {
    const {setIdPose, poses} = props

    return (
        <div className="flex flex-col gap-4">
            <div className="text-blacktext-xl">Выберите в следующем списке асан верную, если ее нет, можете пропустить</div>
            <div className="grid grid-cols-5 gap-4 items-stretch">
                {
                    poses.map((item: PoseType, i: any) => {
                        return (
                            <div key={i} onClick={() => {setIdPose(item.id)}}><Pose clickable={false} poseData={item}/></div>
                        )
                    })
                }
            </div>
            <button
                className="m-auto mt-4 text-center bg-red-600 text-white font-bold w-2/5 rounded-xl p-2"
                onClick={() => {setIdPose(null)}}
            >
                Верного ответа нет
            </button>
        </div>
    )
}

const QuestionThree = (props: any) => {
    const {setIdPose} = props
    const [poses, setPoses] = useState([])
    const [page, setPage] = useState(0)
    const [maxPage, setMaxPage] = useState(0)
    const [text, setText] = useState("")

    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    async function fetchData(page_index: number){
        console.log(text)
        const response = await api.get(`/api/yoga_poses?page=${page_index}&count=4${text != "" ? `&text=${text}` : ""}`)

        let result = response.data

        setPage(page_index)
        setPoses(result.yoga_poses)
        setMaxPage(result.all_pages)
    }
    // todo массив зависимостей
    useEffect(() => {
        if (page == 0){
            fetchData(1)
        }
    });

    const changePage = (page_index: number)  => {
        if (page_index <= 1) {
            fetchData(1)
        }
        else if (page_index >= maxPage){
            fetchData(maxPage)
        }
        else{
            fetchData(page_index)
        }
    }

    const changeTextFind = (text_find: string) => {
        setText(text_find)
        fetchData(1)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="text-black text-xl">Выберите в следующем списке асан верную, если ее нет, можете пропустить</div>
            <input value={text} onChange={(event) => {changeTextFind(event.target.value)}} type="text" className="bg-light border-b-2 border-black p-2 outline-0" placeholder="Введите название асаны"/>
            <div className="grid grid-cols-4 gap-4 items-stretch">
                {
                    poses.map((item: PoseType, i: any) => {
                        return (
                            <div key={i} onClick={() => {setIdPose(item.id)}}><Pose clickable={false} poseData={item}/></div>
                        )
                    })
                }
            </div>
            <div className="flex flex-row gap-2 justify-center">
                <button
                    className="m-auto mt-4 text-center bg-secondary text-white font-bold w-2/5 rounded-xl p-2"
                    onClick={() => {changePage(page - 1)}}
                >
                    Предыдущая страница
                </button>
                <button
                    className="m-auto mt-4 text-center bg-secondary text-white font-bold w-2/5 rounded-xl p-2"
                    onClick={() => {changePage(page + 1)}}
                >
                    Следующая страница
                </button>
            </div>
            <button
                className="m-auto mt-4 text-center bg-red-600 text-white font-bold w-2/5 rounded-xl p-2"
                onClick={() => {setIdPose(null)}}
            >
                Верного ответа нет
            </button>
        </div>
    )
}

const QuestionFour = (props: any) => {
    const {setRightAnswerSanskrit, setRightTransliteration, setRightAnswerRussian, saveAnswer} = props

    return (
        <div className="flex flex-col gap-4">
            <div className="text-black text-xl">Вы можете написать верный ответ, если не знаете оставьте поля пустыми</div>
            <div className="flex flex-col justify-center gap-4">
                <div className="flex flex-col gap-2 justify-center">
                    <div className="text-black font-bold text-xl text-center">Название на Санскрите</div>
                    <input type="text" className="w-1/2 m-auto border-b-2 border-black bg-light outline-0 text-center p-2"
                           onChange={(event) => {setRightAnswerSanskrit(event.target.value)}}/>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <div className="text-black font-bold text-xl text-center">Название на транслитерации</div>
                    <input type="text" className="w-1/2 m-auto border-b-2 border-black bg-light outline-0 text-center p-2"
                           onChange={(event) => {setRightTransliteration(event.target.value)}}/>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <div className="text-black font-bold text-xl text-center">Название на Русском</div>
                    <input type="text" className="w-1/2 m-auto border-b-2 border-black bg-light outline-0 text-center p-2"
                           onChange={(event) => {setRightAnswerRussian(event.target.value)}}/>
                </div>
            </div>
            <button
                className="m-auto mt-4 text-center bg-primary text-white font-bold w-2/5 rounded-xl p-2"
                onClick={saveAnswer}
            >
                Сохранить
            </button>
        </div>
    )
}

const ReviewModal = (props: PropsType) => {
    const {isModalOpen, result_prediction_id, onCloseReviewModal, poses} = props
    if (!isModalOpen) return null

    const [numberQuestion, setNumberQuestion] = useState(0)
    const [isRightTop1, setIsRightTop1] = useState<number | null>(null)
    const [isRightTop5, setIsRightTop5] = useState<number | null>(null)
    const [rightAnswerSystem, setRightAnswerSystem] = useState<number | null>(null)
    const [rightAnswerSanskrit, setRightAnswerSanskrit] = useState<string | null>(null)
    const [rightTransliteration, setRightTransliteration] = useState<string | null>(null)
    const [rightAnswerRussian, setRightAnswerRussian] = useState<string | null>(null)

    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    useEffect(() => {
        async function fetchData(){
            if (numberQuestion == -1) {
                const response = await api.put(`/api/result_prediction/${result_prediction_id}`, {
                    is_right_top1: isRightTop1,
                    is_right_top5: isRightTop5,
                    right_answer_system: rightAnswerSystem,
                    right_answer_sanskrit: rightAnswerSanskrit,
                    right_transliteration: rightTransliteration,
                    right_answer_russian: rightAnswerRussian
                });
                let result = await response.data
                console.log(result)
            }

        }
        fetchData()
    }, [isRightTop1, isRightTop5, rightAnswerSystem, rightAnswerSanskrit, rightTransliteration, rightAnswerRussian, numberQuestion])

    const handlerSetIsRightTop1 = (is_right: any) => {
        if (is_right == null){
            setIsRightTop1(null)
            setNumberQuestion(-1)
        }
        else if (is_right == true){
            setIsRightTop1(poses[0].id)
            setNumberQuestion(-1)
        }
        else if (is_right == false){
            setIsRightTop1(null)
            setNumberQuestion(numberQuestion + 1)
        }

    }

    const handlerSetIsRightTop5 = (id_pose: any) => {
        if (id_pose == null){
            setIsRightTop5(null)
            setNumberQuestion(numberQuestion + 1)
        }
        else{
            setIsRightTop5(id_pose)
            setNumberQuestion(-1)
        }
    }

    const handlerRightAnswerSystem = (id_pose: any) => {
        if (id_pose == null){
            setRightAnswerSystem(null)
            setNumberQuestion(numberQuestion + 1)
        }
        else{
            setRightAnswerSystem(id_pose)
            setNumberQuestion(-1)
        }
    }

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white px-5 pb-10 pt-5 rounded-lg shadow-lg relative w-2/3">
                <div className="flex flex-col justify-center">
                    <button onClick={onCloseReviewModal}
                            className="text-center bg-red-600 text-white font-bold m-auto rounded-xl py-2 px-4 mr-2 mb-2">
                        ✕
                    </button>

                    <div className="text-3xl text-center text-black font-bold mb-4">
                        Оцените результат тестирования
                    </div>

                    <div className="p-2">
                        <p>
                            Данный опрос требуется, чтобы улучить качество работы нейронной сети по распознаванию асан.
                        </p>
                    </div>

                    <div className="p-2">
                        {
                            numberQuestion == 0 && <QuestionOne
                                setFalse={() => {handlerSetIsRightTop1(false)}}
                                setNull={() => {handlerSetIsRightTop1(null)}}
                                setTrue={() => {handlerSetIsRightTop1(true)}}
                            />
                        }
                        {
                            numberQuestion == 1 && <QuestionTwo
                                setIdPose={handlerSetIsRightTop5} poses={poses}
                            />
                        }
                        {
                            numberQuestion == 2 && <QuestionThree
                                setIdPose={handlerRightAnswerSystem}
                            />
                        }
                        {
                            numberQuestion == 3 && <QuestionFour
                                setRightAnswerSanskrit={(text: string) => {setRightAnswerSanskrit(text)}}
                                setRightTransliteration={(text: string) => {setRightTransliteration(text)}}
                                setRightAnswerRussian={(text: string) => {setRightAnswerRussian(text)}}
                                saveAnswer={() => {setNumberQuestion(-1)}}
                            />
                        }
                        {
                            numberQuestion == -1 && (
                                <div className="text-center font-bold text-black text-xl">Спасибо, что прошли опрос</div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
        , document.body);
};

export default ReviewModal;