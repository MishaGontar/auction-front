import {getImagePath} from "../../utils/ImageUtils.ts";
import {Avatar} from "@nextui-org/react";

export default function SmallAvatar({path}: { path: string | null | undefined }) {
    return (
        <Avatar src={getImagePath(path ?? "")}
                alt="avatar"
                className="mx-2 w-8 h-8"
        />
    )
}