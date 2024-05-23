import {getImagePath, IImage} from "../../utils/ImageUtils.ts";
// @ts-ignore
import Slider from "react-slick";

const slider_settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
};

export default function ImagesSlider({images}: { images: IImage[] }) {
    return (<div className="pb-5 pt-2 px-4 flex justify-center flex-col">
            {images && images.length > 0 && (
                <div className="max-w-xs mx-auto">
                    {images.length === 1 && (
                        <img src={getImagePath(images[0].image_url)} alt={`слайд-${0}`}
                             className="w-[300px] h-auto"/>
                    )}
                    {images.length > 1 &&
                        <Slider {...slider_settings}>
                            {images.map((image, index) => (
                                <div key={index}>
                                    <img src={getImagePath(image.image_url)} alt={`слайд-${index}`}
                                         className="w-[300px] h-auto"/>
                                </div>
                            ))}
                        </Slider>
                    }
                </div>
            )}
        </div>

    )
}