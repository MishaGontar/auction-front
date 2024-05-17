import {Button, Card, Link} from "@nextui-org/react";
import {FormEvent, ReactNode} from "react";

interface IForm {
    title: string;
    error?: string;
    onSubmit: () => void;
    isLoading: boolean;
    link?: string;
    linkText?: string;
    cardClass?: string;
    children: ReactNode;
    submitBtnTxt: string;
}

export default function FormTemplate({
                                         title,
                                         error,
                                         onSubmit,
                                         isLoading,
                                         link,
                                         linkText,
                                         cardClass,
                                         submitBtnTxt,
                                         children
                                     }: IForm) {

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit} className="flex justify-center items-center mt-10">
            <Card className={cardClass ?? "p-5 w-full mx-3 md:mx-10 lg:w-1/3 lg:m-0"}>
                <h1 className="text-3xl font-bold mb-5 ml-1 flex justify-center">{title}</h1>
                {error && <p className="text-xl text-red-500 mb-5 ml-1 ">{error}</p>}
                {children}
                <Button
                    spinner={<svg
                        className="animate-spin h-5 w-5 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                        />
                    </svg>}
                    isLoading={isLoading}
                    type="submit"
                    onClick={onSubmit}
                    className="my-1.5"
                    color="success"
                >
                    {submitBtnTxt}
                </Button>
                {linkText && <Link size="sm" href={link} className="flex justify-center">{linkText}</Link>}
            </Card>
        </form>
    );
}