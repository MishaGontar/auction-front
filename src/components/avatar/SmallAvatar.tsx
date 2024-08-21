import {getImagePath} from "../../utils/ImageUtils.ts";
import {Avatar} from "@nextui-org/react";

export interface IPath {
    path: string | null | undefined
}

export default function SmallAvatar({path}: IPath) {
    return (
        <Avatar src={getImagePath(path ?? "")}
                alt="avatar"
                className="mx-2 w-8 h-8"
        />
    )
}