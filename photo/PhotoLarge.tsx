'use client'

import { Photo, photoHasCameraData, photoHasExifData, titleForPhoto } from '.';
import SiteGrid from '@/components/SiteGrid';
import ImageLarge from '@/components/ImageLarge';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { pathForPhoto, pathForPhotoShare } from '@/site/paths';
import PhotoTags from '@/tag/PhotoTags';
import ShareButton from '@/components/ShareButton';
import PhotoCamera from '../camera/PhotoCamera';
import { cameraFromPhoto } from '@/camera';
import PhotoFilmSimulation from '@/simulation/PhotoFilmSimulation';
import VariationButton from '@/site/VariationButton';
import { useState } from 'react';

export default function PhotoLarge({
  photo,
  primaryTag,
  priority,
  prefetchShare,
  showCamera = false,
  showSimulation = true,
  shouldShareTag,
  shouldShareCamera,
  shouldShareSimulation,
  shouldScrollOnShare,
}: {
  photo: Photo
  primaryTag?: string
  priority?: boolean
  prefetchShare?: boolean
  showCamera?: boolean
  showSimulation?: boolean
  shouldShareTag?: boolean
  shouldShareCamera?: boolean
  shouldShareSimulation?: boolean
  shouldScrollOnShare?: boolean
}) {
  const tagsToShow = photo.tags.filter(t => t !== primaryTag);

  const cameraFromPhoto2 = (photo: Photo) => {
    const { model } = photo;
    const make = model
    if (!make || !model) return undefined;
    return { make, model };
  }
  // const camera = cameraFromPhoto(photo);
  const camera = cameraFromPhoto2(photo);

  const renderMiniGrid = (children: JSX.Element, rightPadding = true) =>
    <div className={cc(
      'flex gap-y-4',
      'flex-col sm:flex-row md:flex-col',
      '[&>*]:sm:flex-grow',
      rightPadding && 'pr-2',
    )}>
      {children}
    </div>;


  const [current, setCurrent] = useState(photo.url);
  console.log('current', current)
  console.log('photo', photo.id)
  return (
    <SiteGrid
      contentMain={
        <ImageLarge
          className="w-full"
          alt={titleForPhoto(photo)}
          href={pathForPhoto(photo, primaryTag)}
          src={current}
          //  src={photo.url}
          //  src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-9hbaYngm3SY5SlzLTVXVgvbr/user-qtoselhOJfy5xig60KYTQyAw/img-79E2aOra6m8emN9TpnFXNnFj.png?st=2024-01-23T21%3A01%3A30Z&se=2024-01-23T23%3A01%3A30Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-23T22%3A01%3A30Z&ske=2024-01-24T22%3A01%3A30Z&sks=b&skv=2021-08-06&sig=WcFTX16hdnFn4BpZv%2B2UNE0CbwokmBgnFph3Yfirw1E%3D"
          aspectRatio={photo.aspectRatio}
          blurData={photo.blurData}
          priority={priority}
        />}
      contentSide={
        <div className={cc(
          'sticky top-4 self-start',
          'grid grid-cols-2 md:grid-cols-1',
          'gap-x-0.5 sm:gap-x-1',
          'gap-y-4',
          '-translate-y-1',
          'mb-4',
        )}>
          {renderMiniGrid(<>
            <div>
              <Link
                href={pathForPhoto(photo)}
                className="font-bold uppercase"
              >
                {titleForPhoto(photo)}
              </Link>
              {tagsToShow.length > 0 &&
                <PhotoTags tags={tagsToShow} />}
            </div>
            {showCamera && camera && photoHasCameraData(photo) &&
              <div className="space-y-0.5">
                <PhotoCamera
                  camera={camera}
                  showIcon={false}
                  hideApple={false}
                />
                {/* {showSimulation && photo.filmSimulation &&
                  <div className="translate-x-[-0.3rem]">
                    <PhotoFilmSimulation
                      simulation={photo.filmSimulation}
                    />
                  </div>} */}
              </div>}
          </>)}


          {renderMiniGrid(<>
            {photoHasExifData(photo) &&
              <ul className="text-medium">
                <li>
                  {photo.focalLengthFormatted}
                  {photo.focalLengthIn35MmFormatFormatted &&
                    <>
                      {' '}
                      <span
                        title="35mm equivalent"
                        className="text-extra-dim"
                      >
                        {photo.focalLengthIn35MmFormatFormatted}
                      </span>
                    </>}
                </li>
                <li>{photo.fNumberFormatted}</li>
                <li>{photo.exposureTimeFormatted}</li>
                <li>{photo.isoFormatted}</li>
                <li>{photo.exposureCompensationFormatted ?? '—'}</li>
              </ul>}
            <div className={cc(
              'flex gap-y-4',
              'flex-col sm:flex-row md:flex-col',
            )}>
              <div className={cc(
                'grow uppercase',
                'text-medium',
              )}>
                {photo.takenAtNaiveFormatted}
              </div>

              <ShareButton
                path={pathForPhotoShare(
                  photo,
                  shouldShareTag ? primaryTag : undefined,
                  shouldShareCamera ? camera : undefined,
                  shouldShareSimulation ? photo.filmSimulation : undefined,
                )}
                prefetch={prefetchShare}
                shouldScroll={shouldScrollOnShare}
              />
              <VariationButton
                id={photo.id}
                url={photo.url}
                setCurrent={setCurrent}

              />


            </div>
          </>, false)}
        </div>}
    />
  );
};
