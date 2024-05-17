import {sendInfoNotify} from "../../utils/NotifyUtils.ts";
import {ILotPageResponse} from "./LotInterfaces.ts";


export default function Congratulation({lot}: { lot: ILotPageResponse }) {

    function handleCardCopy() {
        navigator.clipboard.writeText(lot.lot_bank_card_number)
            .then(() => sendInfoNotify("Copied card number"))
    }

    return (
        <div className="flex  flex-col justify-center items-center border-1 p-3 rounded-3xl">
            Congratulation! You win the lot 🥳, send money to
            <div className="flex flex-col items-center">
                {lot.lot_bank_card_number &&
                    <div onClick={handleCardCopy}>
                        <strong>Card number:</strong> {lot.lot_bank_card_number}
                    </div>
                }
                {lot.lot_monobank_link &&
                    <div className="flex flex-row mt-3.5">
                        <a href={lot.lot_monobank_link}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="font-bold bg-black text-white p-1.5 rounded"
                        >
                            Monobank
                        </a>
                    </div>}
            </div>
        </div>
    )
}