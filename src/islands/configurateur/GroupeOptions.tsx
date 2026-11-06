import type { ReactNode } from 'react';

interface Option {
  id: string;
}

interface Props<T extends Option> {
  legende: string;
  nom: string; // attribut name commun aux boutons radio du groupe
  options: T[];
  valeur: string;
  onChange: (id: string) => void;
  rendu: (option: T) => ReactNode;
  disposition?: 'ligne' | 'colonne' | 'egale';
  variante?: 'plein' | 'cadre';
}

/**
 * Groupe de vrais boutons radio, stylés comme des boutons.
 * Le navigateur gère le clavier : Tab pour entrer dans le groupe, flèches pour choisir.
 */
export default function GroupeOptions<T extends Option>({
  legende,
  nom,
  options,
  valeur,
  onChange,
  rendu,
  disposition = 'ligne',
  variante = 'plein',
}: Props<T>) {
  const conteneur = {
    ligne: 'flex flex-wrap gap-3',
    colonne: 'flex flex-col gap-2',
    egale: 'grid grid-cols-2 gap-2',
  }[disposition];

  // « plein » : l'option choisie se remplit ; « cadre » : elle garde un fond discret et un cadre net
  const choisi = variante === 'plein' ? 'has-checked:bg-ink has-checked:text-bg' : 'has-checked:bg-ink/8';

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="surtitre pb-4">{legende}</legend>
      <div className={conteneur}>
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex min-h-11 cursor-pointer items-center gap-3 border border-ink/28 px-[18px] text-[13px] tracking-[0.12em] transition-colors duration-500 hover:border-ink has-checked:border-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent ${choisi} ${disposition === 'egale' ? 'justify-center' : ''}`}
          >
            <input
              type="radio"
              name={nom}
              value={option.id}
              checked={option.id === valeur}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            {rendu(option)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
