import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LARGEUR_RENDU, ajusterApercu, type Ajustement } from './ajustement';

// Téléphone (< 768 px) avec assez de hauteur : au zoom 400 % (écran très bas), l'aperçu reste dans le flux
const REQUETE_COLLE = '(max-width: 47.99rem) and (min-height: 30rem)';
const PART_ECRAN = 0.4; // l'aperçu (libellé compris) occupe au plus 40 % de la hauteur de l'écran

interface Props {
  libelle: ReactNode; // « Aperçu : … », annoncé aux lecteurs d'écran
  children: ReactNode; // l'aperçu lui-même
}

/**
 * Sur téléphone, l'aperçu reste collé en haut de l'écran pendant que les réglages défilent dessous :
 * on voit l'effet de chaque réglage. Il est dessiné à 640 px puis réduit pour tenir dans ~40 % de l'écran.
 * En grand écran, rien ne change (aperçu à côté des réglages, taille réelle).
 */
export default function ApercuColle({ libelle, children }: Props) {
  const cadre = useRef<HTMLDivElement>(null);
  const contenu = useRef<HTMLDivElement>(null);
  const titre = useRef<HTMLParagraphElement>(null);
  const [ajustement, setAjustement] = useState<Ajustement | null>(null);

  useEffect(() => {
    const requete = window.matchMedia(REQUETE_COLLE);
    const mesurer = () => {
      if (!requete.matches || !cadre.current || !contenu.current) return setAjustement(null);
      const hauteurMax = window.innerHeight * PART_ECRAN - (titre.current?.offsetHeight ?? 0) - 24;
      // offsetHeight ignore la réduction (transform) : c'est la hauteur réelle du dessin à 640 px
      setAjustement(ajusterApercu(cadre.current.clientWidth, contenu.current.offsetHeight, hauteurMax));
    };
    const observateur = new ResizeObserver(mesurer);
    if (cadre.current) observateur.observe(cadre.current);
    if (contenu.current) observateur.observe(contenu.current);
    requete.addEventListener('change', mesurer);
    window.addEventListener('resize', mesurer);
    mesurer();
    return () => {
      observateur.disconnect();
      requete.removeEventListener('change', mesurer);
      window.removeEventListener('resize', mesurer);
    };
  }, []);

  return (
    <div className="apercu-colle flex [grid-area:apercu] min-w-0 flex-col gap-3 md:gap-4" data-colle={ajustement ? '' : undefined}>
      <p ref={titre} aria-live="polite" className="text-xs tracking-[0.22em] text-ink-2 uppercase">
        {libelle}
      </p>
      <div ref={cadre} className="relative" style={ajustement ? { height: ajustement.hauteur, overflow: 'hidden' } : undefined}>
        <div
          ref={contenu}
          style={
            ajustement
              ? {
                  position: 'absolute',
                  top: 0,
                  left: ajustement.decalage,
                  width: LARGEUR_RENDU,
                  transform: `scale(${ajustement.echelle})`,
                  transformOrigin: 'top left',
                }
              : undefined
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
