import {getImagePath, IImage} from "../../utils/ImageUtils.ts";
// @ts-ignore
import Slider from "react-slick";
import ImageModal from "../template/ImageModal.tsx";
import "./../../../style/slick.css";
import {useMemo} from "react";

const styleImg = "w-[300px] h-auto cursor-pointer rounded";

export default function ImagesSlider({images}: { images: IImage[] }) {
    const sliderSettings = useMemo(() => ({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        customPaging: function (i: number) {
            return (
                <a>
                    <img src={getImagePath(images[i].image_url)} alt={`thumbnail-${i}`} className="thumbnail my-1.5"/>
                </a>
            );
        },
        dotsClass: "slick-dots slick-thumb"
    }), [images]);

    return (
        <div className="pb-5 pt-2 flex justify-center flex-col">
            {images && images.length > 0 && (
                <div className="max-w-xs mx-auto">
                    {images.length === 1 && (
                        <ImageModal img_path={getImagePath(images[0].image_url)}>
                            <img src={getImagePath(images[0].image_url)} alt={`слайд-${0}`} className={styleImg}/>
                        </ImageModal>
                    )}
                    {images.length > 1 && (
                        <Slider {...sliderSettings}>
                            {images.map((image, index) => (
                                <div key={index}>
                                    <ImageModal img_path={getImagePath(image.image_url)}>
                                        <img src={getImagePath(image.image_url)} alt={`слайд-${index}`}
                                             className={styleImg}/>
                                    </ImageModal>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            )}
        </div>
    );
}
