import { useRef, useState, type KeyboardEvent } from 'react';

interface Modele {
  id: string;
  nom: string;
  accroche: string;
  image: { src: string; position: string; alt: string };
  caracteristiques: { cle: string; valeur: string }[];
  ficheTechnique?: string; // seule Orage a une fiche modèle
}

interface Props {
  modeles: Modele[];
}

/**
 * La gamme Aubrek : de vrais onglets ARIA (Orage / Aurore / Monolithe).
 * Flèches gauche / droite, Début / Fin pour changer d'onglet ; image et texte passent en fondu.
 */
export default function Gamme({ modeles }: Props) {
  const [actif, setActif] = useState(0);
  const onglets = useRef<(HTMLButtonElement | null)[]>([]);
  const modele = modeles[actif];

  const choisir = (i: number) => {
    setActif(i);
    onglets.current[i]?.focus();
  };

  const clavier = (e: KeyboardEvent) => {
    const dernier = modeles.length - 1;
    const cible = {
      ArrowRight: actif === dernier ? 0 : actif + 1,
      ArrowLeft: actif === 0 ? dernier : actif - 1,
      Home: 0,
      End: dernier,
    }[e.key];
    if (cible === undefined) return;
    e.preventDefault();
    choisir(cible);
  };

  return (
    <>
      <div className="mb-14 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <h2 id="gamme-titre" className="text-[clamp(30px,3vw,44px)] leading-[1.1] font-semibold uppercase">
          La <span className="font-light italic">gamme</span>
        </h2>
        <div role="tablist" aria-labelledby="gamme-titre" className="flex flex-wrap gap-x-8 gap-y-2" onKeyDown={clavier}>
          {modeles.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => {
                onglets.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`onglet-${m.id}`}
              aria-selected={i === actif}
              aria-controls="panneau-gamme"
              tabIndex={i === actif ? 0 : -1}
              onClick={() => setActif(i)}
              className={`min-h-11 border-b text-sm font-semibold tracking-[0.22em] uppercase transition-colors duration-500 hover:text-ink ${i === actif ? 'border-accent text-ink' : 'border-transparent text-ink-2'}`}
            >
              {m.nom}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id="panneau-gamme"
        aria-labelledby={`onglet-${modele.id}`}
        tabIndex={0}
        className="grid items-center gap-x-24 gap-y-14 md:grid-cols-2"
      >
        {/* Les trois photos empilées : seule celle du modèle choisi est visible */}
        <div className="cut-lg relative aspect-4/5 overflow-hidden bg-[#141416]">
          {modeles.map((m, i) => (
            <img
              key={m.id}
              src={m.image.src}
              alt={i === actif ? m.image.alt : ''}
              aria-hidden={i !== actif}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-velin ${i === actif ? 'opacity-100' : 'opacity-0'}`}
              style={{ objectPosition: m.image.position }}
            />
          ))}
        </div>

        {/* La clé force un nouveau rendu : le texte rejoue son fondu à chaque modèle */}
        <div key={modele.id} className="gamme-fondu flex flex-col gap-7">
          <p className="text-xs font-semibold tracking-[0.28em] text-ink-2">
            MODÈLE {String(actif + 1).padStart(2, '0')} / {modeles.length}
          </p>
          <h3 className="text-[clamp(40px,4.2vw,64px)] leading-none font-semibold uppercase">{modele.nom}</h3>
          <p className="max-w-[420px] text-lg leading-[1.7] font-light text-aubrek-doux">{modele.accroche}</p>
          <dl className="flex flex-col">
            {modele.caracteristiques.map(({ cle, valeur }) => (
              <div key={cle} className="flex justify-between gap-6 border-t border-line py-4 text-[15px]">
                <dt className="tracking-[0.16em] text-ink-2 uppercase">{cle}</dt>
                <dd className="text-right font-semibold">{valeur}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
            <a href="/demos/aubrek/orage#configurer" className="bouton-aubrek cut bg-accent text-on-accent">
              Configurer
            </a>
            {modele.ficheTechnique && (
              <a href={modele.ficheTechnique} className="lien-trace text-xs font-semibold tracking-[0.22em] uppercase">
                Fiche technique
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
