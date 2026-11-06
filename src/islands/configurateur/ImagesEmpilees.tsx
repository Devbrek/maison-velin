import type { ApercuProps } from './types';

interface Props extends ApercuProps {
  flou?: boolean; // passage du flou au net (Lavis)
}

/**
 * Une photo par ambiance, empilées : seule celle de l'ambiance choisie est visible.
 * Le changement se fait en fondu (et en flou → net pour Lavis).
 */
export default function ImagesEmpilees({ ambiances, ambianceId, flou = false }: Props) {
  // Pas de doublon si deux ambiances partagent la même photo
  const images = ambiances.filter((a, i) => ambiances.findIndex((b) => b.image.src === a.image.src) === i);
  const active = ambiances.find((a) => a.id === ambianceId)?.image.src;

  return (
    <>
      {images.map(({ id, image }) => {
        const visible = image.src === active;
        return (
          <img
            key={id}
            src={image.src}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-[1400ms] ease-velin ${visible ? 'opacity-100 blur-0' : `opacity-0 ${flou ? 'blur-[10px]' : ''}`}`}
            style={{ objectPosition: image.position }}
          />
        );
      })}
    </>
  );
}
