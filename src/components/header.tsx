import Link from "next/link";
import React from "react";

const Header: React.FC = () => {
    return (
        <header className="bg-primary py-4">
            <nav className="container mx-auto flex justify-end items-center">
                <Link href="/" className="text-light text-lg font-bold hover:underline mx-4">
                    Главная
                </Link>
                <Link
                    href="/detect-pose"
                    className="text-light text-lg font-bold hover:underline mx-4"
                >
                    Определить асану
                </Link>
                <Link
                    href="/profile"
                    className="text-light text-lg font-bold hover:underline"
                >
                    Личный кабинет
                </Link>
            </nav>
        </header>
    );
};

export default Header;
