'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Pose from "@/components/pose/pose";
import Link from "next/link";
import Cookie from "js-cookie";
import api from "@/api";

const Profile = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const router = useRouter();

    const fetchPredictionHistory = async (page: number) => {
        try {
            const res = await api.get(`/api/result_prediction?page=${page}&count=4`);

            if (res.status === 200) {
                const data = await res.data;
                setHistory(data.result_predictions);
                setTotalPages(data.all_pages);
            } else {
                console.error('Ошибка загрузки истории');
            }
        } catch (error) {
            console.error('Ошибка при загрузке истории:', error);
        }
    };

    const renderPredictionHistory = () => {
        return history.map((prediction: any) => {
            let is_right_answer = "Не заполнено";

            if (prediction.is_right === true) {
                is_right_answer = "Да"
            } else if (prediction.is_right === false) {
                is_right_answer = "Нет"
            }

            return (
                <div key={prediction.id} className="bg-[#F9F9F9] p-4 mb-4 rounded-md shadow-md">
                    <div className="flex flex-row justify-between">
                        <div className="text-xl font-semibold text-[#9305F2]">Предсказание {prediction.id}</div>
                        <Link className="underline text-[#9305F2] text-sm cursor-pointer"
                              href={`/profile/result-prediction/${prediction.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                        >
                            Открыть полностью
                        </Link>
                    </div>
                    <p><strong>Дата:</strong> {new Date(prediction.created_at).toLocaleDateString()}</p>
                    <div className="mt-4 mb-4 w-2/3 m-auto">
                        <img
                            src={prediction.image}
                            alt={`Предсказание ${prediction.id}`}
                            className="w-full h-auto object-cover rounded-md"
                        />
                    </div>
                    <p className="text-center"><strong>Результат предсказания:</strong></p>
                    <div className="flex flex-row gap-3 flex-wrap mt-3 justify-center">
                        <Pose poseData={prediction.answer[0]} clickable={true}/>
                    </div>
                </div>
            );
        });
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchPredictionHistory(newPage);
    };

    useEffect(() => {
        fetchPredictionHistory(page);
    }, [page]);

    return (
        <>
            <div className="bg-gray-100">
                <div className="min-h-screen w-11/12 m-auto flex flex-row gap-5 p-4">
                    <div className="m-auto w-3/5 bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="m-auto text-2xl font-bold text-center text-black mb-4">История предсказаний</h1>

                        <div className="flex justify-between mb-6">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="px-4 py-2 bg-[#C763F2] text-white rounded-md hover:bg-[#9305F2] disabled:bg-gray-300"
                            >
                                Предыдущая страница
                            </button>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                className="px-4 py-2 bg-[#C763F2] text-white rounded-md hover:bg-[#9305F2] disabled:bg-gray-300"
                            >
                                Следующая страница
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {renderPredictionHistory()}
                        </div>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page <= 1}
                                className="px-4 py-2 bg-[#C763F2] text-white rounded-md hover:bg-[#9305F2] disabled:bg-gray-300"
                            >
                                Предыдущая страница
                            </button>
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page >= totalPages}
                                className="px-4 py-2 bg-[#C763F2] text-white rounded-md hover:bg-[#9305F2] disabled:bg-gray-300"
                            >
                                Следующая страница
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
