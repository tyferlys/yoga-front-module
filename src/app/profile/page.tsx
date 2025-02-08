'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import OptionsModal from "@/components/modal-options";
import Pose from "@/components/pose/pose";
import Link from "next/link";

const Profile = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);
    const [isStudyingAllowed, setIsStudyingAllowed] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    const [isModalOpen, setIsModalOpen] = useState(false)

    const router = useRouter();

    const fetchUserData = async () => {
        try {
            const res = await fetch(`http://${hostServer}/api/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (res.status === 200) {
                const data = await res.json();
                setUserData(data);
                setIsStudyingAllowed(data.permission_study);
            } else {
                router.push('/auth/login');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            router.push('/auth/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchPredictionHistory = async (page: number) => {
        try {
            const res = await fetch(`http://${hostServer}/api/result_prediction?page=${page}&count=4`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (res.status === 200) {
                const data = await res.json();
                setHistory(data.result_predictions);
                setTotalPages(data.all_pages);
            } else {
                console.error('Ошибка загрузки истории');
            }
        } catch (error) {
            console.error('Ошибка при загрузке истории:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchPredictionHistory(page);
    }, [page]);

    const handlePermissionChange = async () => {
        let new_permission = !isStudyingAllowed;
        try {
            const res = await fetch(`http://${hostServer}/api/users/me/permission_study?permission=${new_permission}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (res.ok) {
                const updatedData = await res.json();
                setIsStudyingAllowed(updatedData.permission_study);
            }
        } catch (error) {
            console.error('Ошибка при обновлении разрешения:', error);
        }
    };

    const handleLogout = () => {
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'; // Очищаем токен
        router.push('/auth/login'); // Перенаправляем на страницу логина
    };

    const renderPredictionHistory = () => {
        return history.map((prediction: any) => {
            let is_right_answer = "Не заполнено";

            if (prediction.is_right === true) {
                is_right_answer = "Да"
            } else if (prediction.is_right === false) {
                is_right_answer = "Нет"
            }
            console.log(prediction.image.replace("minio", hostServer))
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
                            src={prediction.image.replace("minio", hostServer)}
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
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchPredictionHistory(newPage);
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!userData) {
        return <div>Ошибка загрузки данных</div>;
    }

    return (
        <>
            {isModalOpen && <OptionsModal isModalOpen={isModalOpen} changePermission={handlePermissionChange} isStudyingAllowed={isStudyingAllowed} onClose={() => {setIsModalOpen(false)}}/>}
            <div className="bg-gray-100">
                <div className="min-h-screen w-11/12 m-auto flex flex-row gap-5 p-4">
                    <div className="w-2/5 bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-2xl font-bold text-center text-[#9305F2] mb-4">Личный кабинет</h1>

                        <div className="mb-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col justify-center">
                                    <div className="text-2xl text-primary">Логин</div>
                                    <div className="text-xl underline">{userData.login}</div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="text-2xl text-primary">Роль</div>
                                    <div
                                        className="text-xl underline">{userData.is_admin ? 'Администратор' : 'Пользователь'}</div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="text-2xl text-primary">Разрешение на просмотр статистики</div>
                                    <div
                                        className="text-xl underline">{isStudyingAllowed ? 'Разрешено' : 'Не разрешено'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2">
                            <button
                                className="mt-2 w-1/4 p-1 bg-primary text-white rounded-md"
                                onClick={() => {setIsModalOpen(true)}}
                            >
                                Настройки
                            </button>
                            <button
                                className="mt-2 w-1/4 p-1 bg-red-600 text-white rounded-md"
                                onClick={handleLogout}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>

                    <div className="w-3/5 bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-[#9305F2] mb-4">История предсказаний</h2>
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
