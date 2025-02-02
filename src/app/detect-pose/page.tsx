'use client';

import React, { useState } from "react";

const DetectPose: React.FC = () => {
    const [image, setImage] = useState<any | null>(null);
    const [result, setResult] = useState<any | null>(null);
    const hostServer = process.env.NEXT_PUBLIC_HOST_SERVER;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            setResult(null);
        }
    };

    const handleDetectPose = async () => {
        console.log(image)

        const response = await fetch(`http://${hostServer}/api/network/prediction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image }),
            credentials: 'include',
        });
        let result = await response.json()
        console.log(result)
        if (image) {
            setResult(result.yoga_poses);
        } else {
            alert("Пожалуйста, загрузите изображение.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl w-full flex">
                {/* Левая часть с загрузкой изображения */}
                <div className="w-1/2 pr-6">
                    <h1 className="text-2xl font-bold text-center text-[#9305F2] mb-4">
                        Определить асану
                    </h1>
                    <p className="text-center text-lg text-[#333] mb-6">
                        Загрузите изображение с асаной, чтобы мы могли помочь вам с её определением.
                    </p>

                    {image && (
                        <div className="flex justify-center mb-6">
                            <img
                                src={image}
                                alt="Предварительный просмотр"
                                className="max-w-full max-h-64 rounded-lg shadow-md"
                            />
                        </div>
                    )}

                    <div className="flex justify-center mb-6">
                        <input
                            type="file"
                            accept="image/*"
                            className="p-2 bg-[#9305F2] text-white rounded-md"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            className="px-4 py-2 bg-[#C763F2] text-white rounded-md hover:bg-[#D97904]"
                            onClick={handleDetectPose}
                        >
                            Начать определение
                        </button>
                    </div>
                </div>

                {/* Правая часть с результатом */}
                <div className="w-1/2 pl-6 border-l-2 border-[#ddd] flex flex-col justify-center">
                    {result ? (
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-[#9305F2] mb-4">Результат</h2>
                            {result.map((item: any, i: any) => {
                                return (
                                    <div key={i}>
                                        Поза - {item.title_russian}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg text-[#333]">Здесь будет отображен результат после обработки изображения.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetectPose;
