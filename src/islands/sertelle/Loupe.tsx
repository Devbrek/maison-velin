import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { calculerLentille, pointeurEnPourcent } from '../../lib/sertelle';

interface Point {
  id: string;
  numero: string;
  x: number;
  y: number;
  titre: string;
  texte: string;
}

interface Props {
  grande: string; // URL de la photo en haute définition (fond de la lentille)
  points: Point[];
  children: ReactNode; // la photo (<Picture> rendue par Astro)
}

/**
 * Loupe du joaillier sur la Bague Lagon.
 * Souris, stylet ou doigt : la lentille suit le pointeur. Au clavier : les trois points
 * d'intérêt sont des boutons, et la lentille s'y pose en douceur.
 */
export default function Loupe({ grande, points, children }: Props) {
  const cadre = useRef<HTMLDivElement>(null);
  const [taille, setTaille] = useState({ largeur: 760, hauteur: 511 });
  const [pointId, setPointId] = useState(points[0].id);
  const [libre, setLibre] = useState<{ x: number; y: number } | null>(null);

  // Taille réelle de la photo à l'écran : indispensable pour le grossissement en px
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const observer = new ResizeObserver(([entree]) => {
      const { width, height } = entree.contentRect;
      setTaille({ largeur: width, hauteur: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const point = points.find((p) => p.id === pointId) ?? points[0];
  const { x, y } = libre ?? point;
  const lentille = calculerLentille(x, y, taille.largeur, taille.hauteur);

  const suivre = (e: PointerEvent<HTMLDivElement>) => {
    setLibre(pointeurEnPourcent(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect()));
  };
  const choisir = (id: string) => {
    setLibre(null);
    setPointId(id);
  };

  return (
    <div className="grid items-center gap-x-14 gap-y-10 lg:grid-cols-[2fr_1fr]">
      <div
        ref={cadre}
        className="relative aspect-[2576/1732] cursor-zoom-in touch-none overflow-hidden bg-[#BFE0F2]"
        onPointerMove={suivre}
        onPointerDown={suivre}
        onPointerLeave={() => setLibre(null)}
        onPointerCancel={() => setLibre(null)}
      >
        {children}

        {/* La lentille : la même photo, agrandie 2,6 fois, en fond */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ecrin-texte bg-no-repeat bg-origin-border shadow-[0_0_0_1px_rgb(127_94_28/0.6)] ${libre ? '' : 'transition-[left,top,background-position] duration-700 ease-velin'}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: lentille.diametre,
            height: lentille.diametre,
            backgroundImage: `url(${grande})`,
            backgroundSize: `${lentille.fondLargeur}px ${lentille.fondHauteur}px`,
            backgroundPosition: `${lentille.fondX}px ${lentille.fondY}px`,
          }}
        />

        {points.map((p) => {
          const choisi = !libre && p.id === pointId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => choisir(p.id)}
              aria-pressed={p.id === pointId}
              aria-label={`Voir le détail ${p.numero} : ${p.titre}`}
              className={`absolute z-10 size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border font-(family-name:--font-cormorant) text-base italic transition-[background-color,color,opacity] duration-500 ${libre ? 'opacity-0' : 'opacity-100'} ${choisi ? 'border-ink bg-ink text-bg' : 'border-ink/30 bg-bg/90 text-ink'}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.numero}
            </button>
          );
        })}
      </div>

      <div className="flex max-w-[360px] flex-col gap-5">
        <div aria-live="polite" className="flex flex-col gap-5">
          <p className="font-(family-name:--font-cormorant) text-[22px] text-accent italic">{point.numero}</p>
          <h3 className="font-display text-[clamp(28px,2.6vw,38px)] leading-[1.15]">{point.titre}</h3>
          <p className="leading-[1.8] font-light text-ink-2">{point.texte}</p>
        </div>
        <div role="group" aria-label="Choisir un détail" className="flex flex-col border-t border-ink/12">
          {points.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => choisir(p.id)}
              aria-pressed={p.id === pointId}
              className={`flex min-h-13 items-center gap-4 border-b border-ink/12 py-3 text-left text-[15px] ${p.id === pointId ? 'font-semibold' : 'font-light'}`}
            >
              <span className="font-(family-name:--font-cormorant) text-[17px] font-normal text-accent italic">{p.numero}</span>
              <span>{p.titre}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
