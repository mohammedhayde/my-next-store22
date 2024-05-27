import { useState } from 'react';
import {
  SfScrollable,
  SfButton,
  SfIconChevronLeft,
  SfIconChevronRight,
  type SfScrollableOnDragEndData,
} from '@storefront-ui/react';
import classNames from 'classnames';

const withBase = (filepath: string) => `https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/gallery/${filepath}`;

export default function GalleryHorizontal({ imagePaths }: { imagePaths: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onDragged = (event: SfScrollableOnDragEndData) => {
    if (event.swipeRight && activeIndex > 0) {
      setActiveIndex((currentActiveIndex) => currentActiveIndex - 1);
    } else if (event.swipeLeft && activeIndex < imagePaths.length - 1) {
      setActiveIndex((currentActiveIndex) => currentActiveIndex + 1);
    }
  };

  return (
    <div className="relative flex flex-col w-full max-h-[600px] aspect-[4/3]">
      <SfScrollable
        className="w-full h-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        activeIndex={activeIndex}
        wrapperClassName="h-full min-h-0"
        buttonsPlacement="none"
        isActiveIndexCentered
        drag={{ containerWidth: true }}
        onDragEnd={onDragged}
      >
        {imagePaths.map((imageSrc, index) => (
          <div key={`${imageSrc}-${index}`} className="flex justify-center h-full basis-full shrink-0 grow snap-center">
            <img
              aria-hidden={activeIndex !== index}
              className="w-auto h-full"
              alt={`Image ${index}`}
              src={imageSrc}
            />
          </div>
        ))}
      </SfScrollable>
      <SfScrollable
        className="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        activeIndex={activeIndex}
        buttonsPlacement="floating"
        slotPreviousButton={
          <SfButton
            className="absolute disabled:hidden !rounded-full z-10 left-4 bg-white"
            variant="secondary"
            size="sm"
            square
            slotPrefix={<SfIconChevronLeft size="sm" />}
          />
        }
        slotNextButton={
          <SfButton
            className="absolute disabled:hidden !rounded-full z-10 right-4 bg-white"
            variant="secondary"
            size="sm"
            square
            slotPrefix={<SfIconChevronRight size="sm" />}
          />
        }
      >
        {imagePaths.map((imageSrc, index) => (
          <button
            type="button"
            aria-current={activeIndex === index}
            key={`${imageSrc}-${index}-thumbnail`}
            className={classNames(
              'md:w-14 md:h-auto relative shrink-0 pb-1 my-2 -mr-2 border-b-4 snap-start cursor-pointer focus-visible:outline focus-visible:outline-offset transition-colors flex-grow md:flex-grow-0',
              activeIndex === index ? 'border-primary-700' : 'border-transparent',
            )}
            onClick={() => setActiveIndex(index)}
          >
            <img
              className="object-contain border border-neutral-200"
              width="78"
              height="78"
              src={imageSrc}
              alt={`Thumbnail ${index}`}
            />
          </button>
        ))}
      </SfScrollable>
    </div>
  );
}
