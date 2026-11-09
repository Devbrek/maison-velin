/*
 * Contact Maison Vélin : une seule adresse pour tout le site.
 * L'adresse complète n'est jamais écrite dans le HTML (robots collecteurs d'e-mails) :
 * la page affiche « contact [at] devbrek.fr » et le script la reconstitue à l'envoi.
 */
export const CONTACT = { utilisateur: 'contact', domaine: 'devbrek.fr' };

export const emailAffiche = `${CONTACT.utilisateur} [at] ${CONTACT.domaine}`;

export function emailComplet(utilisateur: string, domaine: string): string {
  return `${utilisateur}@${domaine}`;
}

export interface DemandeSurMesure {
  nom: string;
  maison: string;
  email: string;
  piece: string;
  message: string;
}

/*
 * Mode d'envoi du formulaire « Sur mesure ».
 * - 'mailto' : la messagerie du visiteur s'ouvre avec la demande rédigée (aujourd'hui).
 * - 'api' : la demande est envoyée à une fonction serveur (Vercel, phase 9) ; seul ce réglage changera.
 */
export const MODE_ENVOI: 'mailto' | 'api' = 'mailto';
export const ADRESSE_API = '/api/demande';

/** Lien mailto: prérempli à partir du formulaire */
export function lienDemande(destinataire: string, d: DemandeSurMesure): string {
  const sujet = `Demande sur mesure — ${d.maison || d.nom}`;
  const corps = [
    `Nom : ${d.nom}`,
    `Maison / marque : ${d.maison}`,
    `E-mail : ${d.email}`,
    `Pièce : ${d.piece}`,
    '',
    d.message,
  ].join('\n');
  return `mailto:${destinataire}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
}

/** Résultat d'un envoi, pour le message affiché sous le formulaire */
export type ResultatEnvoi = { mode: 'mailto' } | { mode: 'api'; ok: boolean };

/** Envoie la demande selon MODE_ENVOI. Le formulaire et son script n'ont pas à changer en phase 9. */
export async function envoyerDemande(destinataire: string, d: DemandeSurMesure): Promise<ResultatEnvoi> {
  if (MODE_ENVOI === 'api') {
    const reponse = await fetch(ADRESSE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    return { mode: 'api', ok: reponse.ok };
  }
  window.location.href = lienDemande(destinataire, d);
  return { mode: 'mailto' };
}
