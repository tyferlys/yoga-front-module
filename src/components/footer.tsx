'use client';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-6">
            <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-[#F2F2F2]">Контактная информация</h3>
                    <ul className="mt-2 space-y-2 text-sm text-[#F2F2F2]">
                        <li>Email: tyferly2003@gmail.com</li>
                        <li>Телефон: +7 987 357 2114</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-[#F2F2F2]">Полезные ссылки</h3>
                    <ul className="mt-2 space-y-2 text-sm text-[#F2F2F2]">
                        <li>
                            <a href="/about" className="hover:text-[#C763F2]">О нас</a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:text-[#C763F2]">Контакты</a>
                        </li>
                        <li>
                            <a href="/privacy-policy" className="hover:text-[#C763F2]">Политика конфиденциальности</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center mt-6 text-sm text-[#F2F2F2]">
                <p>© 2025. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;
