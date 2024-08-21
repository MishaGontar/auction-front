import {Chip} from "@nextui-org/react";
import {ColorType} from "../../utils/CustomUtils.ts";

export default function CustomChip({color, text}: { color: ColorType, text?: string }) {
    return <Chip
        size="sm"
        variant="flat"
        color={color}
        className="hover:cursor-default"
    >
        {text}
    </Chip>

}