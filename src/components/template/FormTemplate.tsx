import {Button, Card, Link} from "@nextui-org/react";
import {FormEvent} from "react";
import SpinnerIcon from "../../icons/SpinnerIcon.tsx";
import {usePage} from "../page/PageContext.tsx";

interface IForm {
    title: string;
    onSubmit: () => void;
    link?: string;
    linkText?: string;
    children: any;
    submitBtnTxt: string;
}

export default function FormTemplate({
                                         title,
                                         onSubmit,
                                         link,
                                         linkText,
                                         submitBtnTxt,
                                         children
                                     }: IForm) {

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSubmit()
    }

    const {error, isLoading} = usePage();

    return (
        <form onSubmit={handleSubmit} className="flex justify-center items-center mt-10">
            <Card className="p-5 w-full mx-3 md:mx-10 lg:w-1/3 lg:m-0">
                <h1 className="text-3xl font-bold mb-5 ml-1 flex justify-center" data-test-id="form-title">
                    {title}
                </h1>
                {error &&
                    <p className="text-xl text-red-500 mb-5 ml-1" data-test-id="form-error">
                        {error}
                    </p>
                }
                {children}
                <Button
                    data-test-id="form-submit-btn"
                    spinner={<SpinnerIcon/>}
                    isLoading={isLoading}
                    type="submit"
                    onClick={onSubmit}
                    className="my-1.5"
                    color="success"
                >
                    {submitBtnTxt}
                </Button>
                {linkText &&
                    <Link size="sm" href={link} className="flex justify-center" data-test-id="form-link">
                        {linkText}
                    </Link>
                }
            </Card>
        </form>
    );
}