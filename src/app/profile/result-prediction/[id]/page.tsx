'use client';

import React, {Suspense, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

import Pose, {ImagePoseType} from "@/components/pose/pose";
import {GetServerSideProps} from "next";
import { use } from "react";
import ReviewModal from "@/components/modal-review";
import api from "@/api";

export interface ResultPredictionType {
    id: number
    id_user: number
    image: string
    answer: Answer[]
    created_at: string
    is_right_top1: any
    is_right_top5: any
    right_answer_system: number
    right_answer_sanskrit: any
    right_transliteration: any
    right_answer_russian: any
}

export interface Answer {
    id: number
    title_sanskrit: string
    title_transliteration: string
    title_russian: string
    images: [ImagePoseType]
}

const ResultPrediction = ({ params }: { params: { id: string } }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [resultPrediction, setResultPrediction] = useState<null | ResultPredictionType>(null)
    const [loading, setLoading] = useState(true);

    // @ts-ignore
    const { id } = use(params);
    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER!;

    const fetchData = async (id: number) => {
        try {
            const res = await api.get(`/api/result_prediction/${id}`);

            if (res.status == 200) {
                const data = await res.data;
                setResultPrediction(data)
            }
        } catch (error) {
            console.error('Ошибка при обновлении разрешения:', error);
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData(id);
    }, []);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    const Review = () => {
        if (resultPrediction?.is_right_top1){
            return (
                <div className="text-xl">
                    Нейронная сеть ответила правильно
                </div>
            )
        }
        else if (resultPrediction?.is_right_top5){
            return (
                <div className="text-xl">
                    Нейронная сеть ответила неправильно, но среди перечня пяти наиболее вероятных ответов, есть верный
                </div>
            )
        }
        else if (resultPrediction?.right_answer_system){
            return (
                <div className="text-xl">
                    Нейронная сеть ответила неправильно, но верный ответ есть в системе
                </div>
            )
        }
        else{
            return (
                <div className="text-xl">
                    Нейронная сеть ответила неправильно и верного ответа нет в системе, введенные вами данные асаны:
                    <div className="mt-4">
                        <div>Название на Санскрите - <span className="text-secondary">{resultPrediction?.right_answer_sanskrit ? resultPrediction?.right_answer_sanskrit: "Не введено"}</span></div>
                        <div>Название на транслитерации - <span className="text-secondary">{resultPrediction?.right_transliteration ? resultPrediction?.right_transliteration: "Не введено"}</span></div>
                        <div>Название на Русском - <span className="text-secondary">{resultPrediction?.right_answer_russian ? resultPrediction?.right_answer_russian: "Не введено"}</span></div>
                    </div>
                </div>
            )
        }
    }

    const reviewEnd = () => {
        setIsModalOpen(false)
        fetchData(id);
    }

    return (
        <>
            <ReviewModal isModalOpen={isModalOpen} result_prediction_id={resultPrediction?.id ? resultPrediction?.id : null} onCloseReviewModal={reviewEnd} poses={resultPrediction?.answer}/>
            <div className="bg-gray-100">
                <div className="min-h-screen w-7/12 m-auto gap-5 p-4 flex flex-col justify-center">
                    <div className="mt-5 bg-white w-full rounded-md py-5 px-10">
                        <div className="flex flex-col gap-10">
                            <div className="text-center text-3xl text-primary font-bold underline">Предсказание {resultPrediction?.id}</div>
                            <img
                                src={resultPrediction?.image.replace("minio", hostServer)}
                                alt={`Предсказание ${resultPrediction?.id}`}
                                className="m-auto w-1/2 object-cover rounded-md"
                            />
                            <div className="text-left text-3xl text-primary">Результат:</div>
                            <div className="flex flex-col gap-10 w-2/3 m-auto">
                                <div className="w-1/2 m-auto">
                                    {resultPrediction?.answer[0] && <Pose poseData={resultPrediction?.answer[0]} clickable={true}/>}
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    {
                                        resultPrediction?.answer.slice(1,).map((item: any, index: number) => {
                                            return <Pose key={index} poseData={item} clickable={true}/>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="text-left text-3xl text-primary">Отзыв на результат предсказания:</div>
                                <div className="flex flex-col gap-3">
                                    <Review/>
                                    <button
                                        className="w-1/6 ml-0 text-white bg-primary p-2 rounded-md font-bold"
                                        onClick={() => {setIsModalOpen(true)}}
                                    >
                                        Изменить отзыв
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const ResultPredictionWithSuspense = (props: any) => {return <Suspense fallback={""}><ResultPrediction {...props}/></Suspense>}
export default ResultPredictionWithSuspense;
