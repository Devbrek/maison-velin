import type { ReactNode } from 'react';
import { changerConfiguration, useConfiguration } from './configuration';
import { resume, type OptionsOrage } from './orage';

interface GroupeProps<T extends { id: string; label: string }> {
  legende: string;
  nom: string;
  options: T[];
  valeur: string;
  onChange: (id: string) => void;
  pastille?: (option: T) => string;
}

/** Boutons radio à coins coupés (le clavier est géré par le navigateur : flèches) */
function Groupe<T extends { id: string; label: string }>({ legende, nom, options, valeur, onChange, pastille }: GroupeProps<T>) {
  return (
    <fieldset>
      <legend className="pb-3.5 text-xs font-semibold tracking-[0.28em] text-ink-2 uppercase">{legende}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.id}
            className={`cut flex min-h-11 cursor-pointer items-center gap-2.5 px-5 text-[13px] font-semibold tracking-[0.12em] transition-colors duration-400 has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent ${o.id === valeur ? 'bg-ink text-bg' : 'shadow-[inset_0_0_0_1px_rgb(242_242_240/0.3)] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]'}`}
          >
            <input type="radio" name={nom} value={o.id} checked={o.id === valeur} onChange={() => onChange(o.id)} className="sr-only" />
            {pastille && <span aria-hidden="true" className="size-3 border border-ink/40" style={{ background: pastille(o) }} />}
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

interface Props extends OptionsOrage {
  children?: ReactNode; // surtitre, nom, accroche (rendus par Astro)
}

/** Configurateur de l'Orage : boîtier + bracelet → récapitulatif */
export default function ConfigurateurOrage({ boitiers, bracelets, children }: Props) {
  const config = useConfiguration();

  return (
    <div className="flex flex-col gap-8 pt-4">
      {children}
      <Groupe
        legende="Boîtier"
        nom="orage-boitier"
        options={boitiers}
        valeur={config.boitier}
        onChange={(boitier) => changerConfiguration({ boitier })}
      />
      <Groupe
        legende="Bracelet"
        nom="orage-bracelet"
        options={bracelets}
        valeur={config.bracelet}
        onChange={(bracelet) => changerConfiguration({ bracelet })}
        pastille={(b) => b.teinte}
      />
      <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-y border-line py-5">
        <span className="text-xs font-semibold tracking-[0.24em] text-ink-2">VOTRE CONFIGURATION</span>
        <span aria-live="polite" className="text-sm font-medium tracking-[0.14em] uppercase">
          {resume({ boitiers, bracelets }, config)}
        </span>
      </div>
      <a href="#essai" className="bouton-aubrek cut self-start bg-accent px-8 text-on-accent">
        Réserver un essai
      </a>
    </div>
  );
}
