import {Link} from "@nextui-org/react";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-blue-600">404</h1>
                <p className="text-2xl md:text-3xl font-medium mt-4">
                    Ой! Сторінку не знайдено.
                </p>
                <p className="mt-4 mb-8">
                    Вибачте, але сторінка, яку ви шукаєте, не існує.
                </p>
                <Link href="/"
                      className="px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100 hover:bg-blue-200 rounded">
                    Повернутися на головну
                </Link>
            </div>
        </div>
    );
}