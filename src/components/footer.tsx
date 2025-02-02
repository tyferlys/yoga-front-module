'use client';

const Footer = () => {
    return (
        <footer className="bg-[#9305F2] text-white py-6">
            <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-[#F2F2F2]">Контактная информация</h3>
                    <ul className="mt-2 space-y-2 text-sm text-[#F2F2F2]">
                        <li>Email: example@example.com</li>
                        <li>Телефон: +1 (800) 123-4567</li>
                        <li>Адрес: Улица Примерная, 123, Город, Страна</li>
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

                <div>
                    <h3 className="text-xl font-bold text-[#F2F2F2]">Подписка на новости</h3>
                    <form className="mt-2">
                        <input
                            type="email"
                            placeholder="Введите свой email"
                            className="p-2 w-full rounded-md border border-gray-300"
                        />
                        <button type="submit" className="mt-2 w-full py-2 bg-[#C763F2] text-white rounded-md hover:bg-[#D97904]">
                            Подписаться
                        </button>
                    </form>
                </div>
            </div>

            <div className="text-center mt-6 text-sm text-[#F2F2F2]">
                <p>© 2024 Ваш сайт. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;
