'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Pose from "@/components/pose/pose";
import Link from "next/link";
import Cookie from "js-cookie";
import api from "@/api";
import ResetPasswordRequestModal from "@/components/modal-reset-password-request";

const Profile = () => {
    const [userData, setUserData] = useState<any>(null);
    const [page, setPage] = useState<number>(1);
    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    const [isStudyingAllowed, setIsStudyingAllowed] = useState<boolean>(false);
    const [isChanged, setIsChanged] = useState(false)

    const router = useRouter();

    const fetchUserData = async () => {
        try {
            const res = await api.get(`/api/users/me`);

            if (res.status === 200) {
                const data = res.data;
                setUserData(data);
                setIsStudyingAllowed(data.permission_study);
            } else {
                router.push('/auth/login');
            }
        } catch (error) {
            router.push('/auth/login');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [page]);


    const savePermissionChange = async () => {
        try {
            const res = await api.patch(`/api/users/me/permission_study?permission=${isStudyingAllowed}`);
            setIsChanged(false)
        } catch (error) {
            console.error('Ошибка при обновлении разрешения:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear()
        router.push('/auth/login'); // Перенаправляем на страницу логина
    };

    if (!userData) {
        return <div>Ошибка загрузки данных</div>;
    }

    return (
        <>
            <div className="bg-gray-100">
                <div className="min-h-screen w-11/12 m-auto flex flex-row gap-5 p-4">
                    <div className="m-auto w-full lg:w-3/5 bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex flex-row justify-end">
                            <div className="text-red-600 underline cursor-pointer" onClick={handleLogout}>
                                Выйти
                            </div>
                        </div>
                        <h1 className="m-auto text-2xl font-bold text-center text-black mb-4">Личный кабинет</h1>

                        <div className="mb-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col justify-center">
                                    <div className="text-2xl text-black text-center lg:text-left">Логин</div>
                                    <div className="text-xl underline text-center lg:text-left">{userData.login}</div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="text-2xl text-black text-center lg:text-left">Роль</div>
                                    <div
                                        className="text-xl underline text-center lg:text-left">{userData.is_admin ? 'Администратор' : 'Пользователь'}</div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="text-lg lg:text-2xl text-black">Разрешение на просмотр статистики</div>

                                    <div className="w-full lg:w-1/6">
                                        <select
                                            className="w-full outline-0  p-2 border-black border-2"
                                            defaultValue={isStudyingAllowed ? "1" : "0"}
                                            onChange={(event) => {setIsStudyingAllowed(event.target.value === "1"); setIsChanged(true)}}
                                        >
                                            <option value="1">Разрешено</option>
                                            <option value="0">Запрещено</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row lg:flex-col gap-2">
                            <div className="flex flex-row gap-2">
                                <button
                                    className={`mt-2 w-full lg:w-1/4 p-1 bg-primary text-white rounded-md ${!isChanged ? 'opacity-50' : ''}`}
                                    disabled={!isChanged}
                                    onClick={savePermissionChange}
                                >
                                    Сохранить
                                </button>
                            </div>

                            <Link
                                className={`block text-center mt-2 w-full lg:w-1/4 p-1 bg-black text-white rounded-md`}
                                onClick={savePermissionChange}
                                href="/profile/history-prediction"
                            >
                                История предсказаний
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
