'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Registration = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            const response = await fetch(`http://${hostServer}/api/auth/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ login, password }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push('/login');
            } else {
                setError(data.message || 'Ошибка регистрации');
            }
        } catch (error) {
            setError('Что-то пошло не так');
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-[#9305F2] mb-4">Регистрация</h1>
                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label htmlFor="login" className="block text-sm font-medium text-[#333]">Логин</label>
                        <input
                            type="text"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-[#333]">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#333]">Подтвердите пароль</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#9305F2] text-white rounded-md hover:bg-[#C763F2]"
                        >
                            Зарегистрироваться
                        </button>
                    </div>
                </form>
                <p className="text-center mt-4">
                    Уже есть аккаунт?{' '}
                    <a href="/login" className="text-[#9305F2]">Войти</a>
                </p>
            </div>
        </div>
    );
};

export default Registration;
