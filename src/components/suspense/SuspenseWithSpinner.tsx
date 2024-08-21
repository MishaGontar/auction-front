import {Suspense} from "react";
import SpinnerView from "../spinner/Spinner.tsx";

export default function SuspenseWithSpinner({children}: { children: any }) {
    return (
        <Suspense fallback={<SpinnerView/>}>
            {children}
        </Suspense>
    )
}