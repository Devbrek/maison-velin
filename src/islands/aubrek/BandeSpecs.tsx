import { useConfiguration } from './configuration';
import { choix, type OptionsOrage } from './orage';

/** Bande de caractéristiques : boîtier et poids suivent la configuration */
export default function BandeSpecs(options: OptionsOrage) {
  const { boitier } = choix(options, useConfiguration());
  const specs = [
    ['Boîtier', boitier.label],
    ['Poids', boitier.poids],
    ['Étanchéité', '50 m'],
    ['Verre', 'Saphir'],
    ['Autonomie', '36 h'],
  ];

  return (
    <dl className="conteneur grid grid-cols-2 gap-8 py-10 sm:grid-cols-3 lg:grid-cols-5">
      {specs.map(([cle, valeur]) => (
        <div key={cle}>
          <dt className="text-[11px] font-semibold tracking-[0.24em] text-ink-2 uppercase">{cle}</dt>
          <dd className="mt-2 text-[22px] font-medium">{valeur}</dd>
        </div>
      ))}
    </dl>
  );
}
