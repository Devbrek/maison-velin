/*
 * Les trois aperçus : une page d'accueil de la marque démo en miniature.
 * Ils ne lisent que les variables --p-* posées par le configurateur.
 */
import ImagesEmpilees from './ImagesEmpilees';
import type { ApercuProps } from './types';

/** Filigrane → Sertelle */
export function ApercuSertelle(props: ApercuProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-(--p-ligne) px-8 py-5">
        <span className="font-(family-name:--p-police) text-xl tracking-[0.4em]">SERTELLE</span>
        <span className="hidden text-[11px] tracking-[0.24em] text-(--p-secondaire) sm:inline">
          COLLECTION · À LA LOUPE · RENDEZ-VOUS
        </span>
      </div>
      <div className="grid items-center gap-8 px-8 py-14 sm:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="text-[11px] tracking-[0.3em] text-(--p-secondaire)">COLLECTION RIVIÈRE</p>
          <p className="font-(family-name:--p-police) text-[clamp(36px,3.6vw,52px)] leading-none">
            L'éclat, <em className="text-(--p-accent)">de près.</em>
          </p>
          <p className="text-[15px] leading-[1.7] font-light text-(--p-secondaire)">
            Vingt-quatre pierres taillées à la main, serties une à une sur un anneau d'or.
          </p>
          <span className="inline-flex min-h-11 items-center self-start bg-(--p-accent) px-6 text-[11px] tracking-[0.22em] text-(--p-sur-accent)">
            EXPLORER À LA LOUPE
          </span>
        </div>
        <div className="relative aspect-4/5 overflow-hidden border border-(--p-ligne) bg-(--p-surface)">
          <ImagesEmpilees {...props} />
        </div>
      </div>
    </>
  );
}

/** Vecteur → Aubrek : toute la miniature suit la police choisie */
export function ApercuAubrek(props: ApercuProps) {
  const specs = [
    ['ÉTANCHÉITÉ', '50 m'],
    ['VERRE', 'Saphir'],
    ['AUTONOMIE', '36 h'],
  ];
  return (
    <div className="font-(family-name:--p-police)">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-(--p-ligne) px-7 py-5">
        <span className="text-base font-semibold tracking-[0.5em]">AUBREK</span>
        <span className="text-[11px] font-semibold tracking-[0.2em] text-(--p-secondaire)">
          MODÈLES · INGÉNIERIE · COLORIS
        </span>
      </div>
      {/* Texte et photo côte à côte : le texte ne passe jamais sur l'image */}
      <div className="grid items-center gap-x-8 gap-y-6 px-7 py-10 sm:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="text-[11px] font-semibold tracking-[0.3em] text-(--p-accent)">HORLOGERIE CONNECTÉE</p>
          <p className="text-[clamp(28px,2.6vw,38px)] leading-[1.05] font-semibold uppercase">
            Taillée pour <span className="font-light text-(--p-accent) italic">l'orage.</span>
          </p>
          <p className="text-sm leading-[1.7] font-light text-(--p-secondaire)">
            Un boîtier d'acier brossé, un verre saphir et une étanchéité à cinquante mètres.
          </p>
          <span className="cut inline-flex min-h-11 items-center self-start bg-(--p-accent) px-[22px] text-[11px] font-semibold tracking-[0.22em] text-(--p-sur-accent)">
            CONFIGURER
          </span>
        </div>
        <div className="cut-lg relative aspect-square overflow-hidden bg-(--p-surface)">
          <ImagesEmpilees {...props} />
        </div>
      </div>
      <div className="mx-7 mb-7 grid grid-cols-3 gap-4 border-t border-(--p-ligne) pt-4">
        {specs.map(([cle, valeur]) => (
          <span key={cle} className="flex flex-col gap-1">
            <span className="text-[10px] tracking-[0.22em] text-(--p-secondaire)">{cle}</span>
            <span className="text-base font-semibold">{valeur}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Lavis → Calade : le fil horaire en miniature, l'arche qui passe du flou au net */
export function ApercuCalade(props: ApercuProps) {
  return (
    <div className="font-(family-name:--font-manrope)">
      <div className="flex justify-center border-b border-(--p-ligne) px-7 py-[22px]">
        <span className="pl-[0.42em] font-(family-name:--p-police) text-xl tracking-[0.42em]">CALADE</span>
      </div>
      <div className="grid grid-cols-[40px_1fr] items-center gap-x-8 gap-y-6 px-7 py-11 sm:grid-cols-[40px_1fr_1fr]">
        <div aria-hidden="true" className="relative min-h-[220px] self-stretch">
          <span className="absolute inset-y-0 left-1.5 w-px bg-(--p-ligne)" />
          <span className="absolute top-0 left-1.5 h-1/2 w-px bg-(--p-accent)" />
          <span className="absolute top-0 left-0 size-[13px] rounded-full bg-(--p-encre)" />
          <span className="absolute top-1/2 left-0 -mt-1.5 size-[13px] rounded-full bg-(--p-accent)" />
          <span className="absolute bottom-0 left-0 size-[13px] rounded-full border border-(--p-encre)" />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-(--p-accent)">II · 13:00 · MIDI</p>
          <p className="font-(family-name:--p-police) text-[clamp(30px,2.8vw,40px)] leading-[1.1]">
            Pierre <em className="text-(--p-accent)">d'Été</em>
          </p>
          <p className="text-sm leading-[1.7] font-light text-(--p-secondaire)">
            La pierre brûle. L'air sent la résine et le fruit mûr.
          </p>
          <span className="inline-flex min-h-10 items-center self-start rounded-full bg-(--p-accent) px-5 text-[11px] font-semibold tracking-[0.2em] text-(--p-sur-accent)">
            DÉCOUVRIR · 145 €
          </span>
        </div>
        <div className="arche relative col-span-2 aspect-4/5 overflow-hidden bg-[#2A1A0E] sm:col-span-1">
          <ImagesEmpilees {...props} flou />
        </div>
      </div>
    </div>
  );
}
