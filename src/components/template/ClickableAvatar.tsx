import {IPath} from "./SmallAvatar.tsx";
import ImageModal from "./ImageModal.tsx";
import {getImagePath} from "../../utils/ImageUtils.ts";
import {Avatar} from "@nextui-org/react";

export default function ClickableAvatar({path}: IPath){
    return (
        <ImageModal img_path={getImagePath(path ?? "")}>
            <Avatar src={getImagePath(path ?? "")}
                    alt="avatar"
                    className="mx-2 w-8 h-8"
            />
        </ImageModal>
    )
}