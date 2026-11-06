import { useState, type CSSProperties } from 'react';

interface Ecran {
  id: string;
  label: string;
  teinte: string; // pastille du bouton
  image: { src: string; position: string; alt: string };
  // Ambiance de toute la section quand cet écran est choisi
  scene: { nom: string; fond: string; encre: string; secondaire: string; ligne: string };
}

interface Props {
  ecrans: Ecran[];
}

/**
 * Scène Coloris : tout le fond de la section suit l'écran choisi (Nuit par défaut, puis Aurore).
 * Texte et photo côte à côte : le texte ne passe jamais sur la photo.
 */
export default function Coloris({ ecrans }: Props) {
  const [choisi, setChoisi] = useState(ecrans[0].id);
  const ecran = ecrans.find((e) => e.id === choisi) ?? ecrans[0];
  const { scene } = ecran;

  const variables = {
    '--s-fond': scene.fond,
    '--s-encre': scene.encre,
    '--s-secondaire': scene.secondaire,
    '--s-ligne': scene.ligne,
  } as CSSProperties;

  return (
    <section
      id="coloris"
      aria-labelledby="coloris-titre"
      className="bg-(--s-fond) text-(--s-encre) transition-colors duration-[900ms] ease-velin"
      style={variables}
    >
      <div className="conteneur grid items-center gap-x-24 gap-y-14 py-24 md:grid-cols-2 md:py-[140px]">
        <div className="flex max-w-[460px] flex-col gap-7">
          <p className="text-xs font-semibold tracking-[0.32em] text-(--s-secondaire) transition-colors duration-[900ms]">
            COLORIS · <span aria-live="polite">{scene.nom}</span>
          </p>
          <h2 id="coloris-titre" className="text-[clamp(30px,3vw,44px)] leading-[1.1] font-semibold uppercase">
            Votre Aubrek, <span className="font-light italic">à votre lumière.</span>
          </h2>
          <p className="text-[17px] leading-[1.7] font-light text-(--s-secondaire) transition-colors duration-[900ms]">
            Aluminium clair et bracelet rose poudré. Choisissez l'écran au repos, puis composez le reste dans le
            configurateur.
          </p>
          <fieldset>
            <legend className="pb-4 text-xs font-semibold tracking-[0.28em]">ÉCRAN AU REPOS</legend>
            <div className="flex gap-2">
              {ecrans.map((e) => (
                <label
                  key={e.id}
                  className={`cut flex min-h-11 cursor-pointer items-center gap-2.5 border px-5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-[900ms] has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-(--s-encre) ${e.id === choisi ? 'border-(--s-encre) bg-(--s-encre) text-(--s-fond)' : 'border-(--s-ligne)'}`}
                >
                  <input
                    type="radio"
                    name="aubrek-ecran"
                    value={e.id}
                    checked={e.id === choisi}
                    onChange={() => setChoisi(e.id)}
                    className="sr-only"
                  />
                  <span aria-hidden="true" className="size-3.5 border border-(--s-ligne)" style={{ background: e.teinte }} />
                  {e.label}
                </label>
              ))}
            </div>
          </fieldset>
          <a
            href="/demos/aubrek/orage#configurer"
            className="bouton-aubrek cut self-start bg-(--s-encre) text-(--s-fond) transition-colors duration-[900ms]"
          >
            Ouvrir le configurateur
          </a>
        </div>

        <div className="cut-lg relative aspect-4/5 overflow-hidden bg-[#E2DADD]">
          {ecrans.map((e) => (
            <img
              key={e.id}
              src={e.image.src}
              alt={e.id === choisi ? e.image.alt : ''}
              aria-hidden={e.id !== choisi}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-velin ${e.id === choisi ? 'opacity-100' : 'opacity-0'}`}
              style={{ objectPosition: e.image.position }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
