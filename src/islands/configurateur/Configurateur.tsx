import { useState, type CSSProperties, type ReactNode } from 'react';
import GroupeOptions from './GroupeOptions';
import { ApercuAubrek, ApercuCalade, ApercuSertelle } from './Apercus';
import { resumeReglage, variablesApercu } from './couleurs';
import type { Accent, Ambiance, PieceId, Police } from './types';

interface Props {
  pieceId: PieceId;
  accents: Accent[];
  polices: Police[];
  ambiances: Ambiance[];
  children?: ReactNode; // titre et texte d'intro, rendus par Astro
}

const APERCUS = { filigrane: ApercuSertelle, vecteur: ApercuAubrek, lavis: ApercuCalade };

/**
 * Configurateur d'une fiche pièce : accent, police de titre, ambiance.
 * L'aperçu se règle en direct en changeant des variables CSS sur son conteneur.
 */
export default function Configurateur({ pieceId, accents, polices, ambiances, children }: Props) {
  const [accentId, setAccentId] = useState(accents[0].id);
  const [policeId, setPoliceId] = useState(polices[0].id);
  const [ambianceId, setAmbianceId] = useState(ambiances[0].id);

  const accent = accents.find((a) => a.id === accentId) ?? accents[0];
  const police = polices.find((p) => p.id === policeId) ?? polices[0];
  const ambiance = ambiances.find((a) => a.id === ambianceId) ?? ambiances[0];
  const Apercu = APERCUS[pieceId];

  return (
    <div className="flex flex-wrap items-start gap-x-20 gap-y-16">
      <div className="flex max-w-[400px] min-w-0 flex-[1_1_280px] flex-col gap-12">
        {children}

        <GroupeOptions
          legende="Accent"
          nom={`${pieceId}-accent`}
          options={accents}
          valeur={accentId}
          onChange={setAccentId}
          rendu={(a) => (
            <>
              <span
                aria-hidden="true"
                className="size-4 rounded-full border border-ink/40"
                style={{ background: ambiance.sombre ? a.sombre : a.clair }}
              />
              <span>{a.label}</span>
            </>
          )}
        />

        <GroupeOptions
          legende="Police de titre"
          nom={`${pieceId}-police`}
          options={polices}
          valeur={policeId}
          onChange={setPoliceId}
          disposition="colonne"
          variante="cadre"
          rendu={(p) => (
            <span className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
              <span className="text-2xl tracking-normal whitespace-nowrap" style={{ fontFamily: `var(${p.police})` }}>
                {p.label}
              </span>
              <span className="text-xs tracking-[0.12em] text-ink-2 uppercase">{p.note}</span>
            </span>
          )}
        />

        <GroupeOptions
          legende="Ambiance"
          nom={`${pieceId}-ambiance`}
          options={ambiances}
          valeur={ambianceId}
          onChange={setAmbianceId}
          disposition="egale"
          rendu={(a) => <span>{a.label}</span>}
        />
      </div>

      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
        <p aria-live="polite" className="text-xs tracking-[0.22em] text-ink-2 uppercase">
          Aperçu : {resumeReglage(accent, police, ambiance)}
        </p>
        <div
          className="apercu border border-ink/16 bg-(--p-fond) text-(--p-encre)"
          style={variablesApercu(accent, police, ambiance) as CSSProperties}
        >
          <Apercu ambiances={ambiances} ambianceId={ambianceId} />
        </div>
      </div>
    </div>
  );
}
