import { useConfiguration } from './configuration';
import { choix, type OptionsOrage } from './orage';

/** Fiche technique par groupes : taille, poids et bracelet suivent la configuration */
export default function FicheTechnique(options: OptionsOrage) {
  const { boitier, bracelet } = choix(options, useConfiguration());
  const groupes = [
    { titre: 'Boîtier', lignes: [['Taille', boitier.label], ['Matière', 'Aluminium noir'], ['Poids', boitier.poids]] },
    { titre: 'Écran', lignes: [['Type', 'Toujours actif'], ['Verre', 'Saphir'], ['Luminosité', 'Adaptée à la lumière']] },
    { titre: 'Capteurs', lignes: [['Optiques', '4'], ['Position', 'GPS'], ['Étanchéité', '50 m']] },
    { titre: 'Bracelet', lignes: [['Modèle', bracelet.label], ['Fermoir', 'Ardillon acier'], ['Autonomie', '36 h']] },
  ];

  return (
    <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2">
      {groupes.map(({ titre, lignes }) => (
        <div key={titre}>
          <h3 className="mb-2 text-xs font-semibold tracking-[0.28em] text-ink-2 uppercase">{titre}</h3>
          <dl>
            {lignes.map(([cle, valeur]) => (
              <div key={cle} className="flex justify-between gap-6 border-t border-line py-3.5 text-[15px]">
                <dt className="font-light text-aubrek-doux">{cle}</dt>
                <dd className="text-right font-medium">{valeur}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
