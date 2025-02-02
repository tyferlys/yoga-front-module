'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Profile = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);
    const [isStudyingAllowed, setIsStudyingAllowed] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;
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
                router.push('/login');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchPredictionHistory = async (page: number) => {
        try {
            const res = await fetch(`http://${hostServer}/api/result_prediction?page=${page}&count=3`, {
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
        router.push('/login'); // Перенаправляем на страницу логина
    };

    const renderPredictionHistory = () => {
        return history.map((prediction: any) => {
            let is_right_answer = "Не заполнено";

            if (prediction.is_right === true){
                is_right_answer = "Да"
            }
            else if (prediction.is_right === false){
                is_right_answer = "Нет"
            }
            console.log(prediction.image.replace("minio", hostServer))
            return (
                <div key={prediction.id} className="bg-[#F9F9F9] p-4 mb-4 rounded-md shadow-md">
                    <div className="flex flex-row justify-between">
                        <div className="text-xl font-semibold text-[#9305F2]">Предсказание {prediction.id}</div>
                        <div className="text-[#9305F2] text-sm">Открыть полностью</div>
                    </div>
                    <p><strong>Дата:</strong> {new Date(prediction.created_at).toLocaleDateString()}</p>
                    <div className="mt-4 mb-4 w-2/3 m-auto">
                        <img
                            src={prediction.image.replace("minio", hostServer)}
                            alt={`Предсказание ${prediction.id}`}
                            className="w-full h-auto object-cover rounded-md"
                        />
                    </div>
                    <p><strong>Результат предсказания:</strong></p>
                    <div className="flex flex-row gap-3 flex-wrap mt-3">
                        {prediction.answer.map((item: any, index: number) => {
                            return (
                                <div key={index}>
                                    <div
                                        className="text-sm bg-[#C763F2] text-white p-2 rounded-xl">{item.title_russian}</div>
                                </div>
                            );
                        })}
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
        <div className="min-h-screen flex items-start justify-center bg-gray-100 p-4">
            <div className="w-full max-w-7xl flex gap-8">
                {/* Личный кабинет */}
                <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center text-[#9305F2] mb-4">Личный кабинет</h1>

                    <div className="mb-4">
                        <p><strong>Логин:</strong> {userData.login}</p>
                        <p><strong>Роль:</strong> {userData.is_admin ? 'Администратор' : 'Пользователь'}</p>
                        <p className="flex items-center">
                            <strong>Разрешение на изучение:</strong>
                            <span className="ml-2">{isStudyingAllowed ? 'Есть' : 'Нет'}</span>
                            <button
                                className="ml-4 px-2 py-1 bg-[#C763F2] text-white rounded-md hover:bg-[#9305F2]"
                                onClick={handlePermissionChange}
                            >
                                Изменить
                            </button>
                        </p>
                    </div>

                    <button
                        className="mr-2 px-4 py-2 bg-[#C763F2] text-white rounded-md hover:bg-red-700"
                    >
                        Страница с предсказаниями
                    </button>

                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                        onClick={handleLogout}
                    >
                        Выйти
                    </button>
                </div>

                {/* История предсказаний */}
                <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-[#9305F2] mb-4">История предсказаний</h2>
                    {renderPredictionHistory()}
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
    );
};

export default Profile;
