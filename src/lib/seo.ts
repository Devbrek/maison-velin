/*
 * Données structurées (JSON-LD) : Devbrek est l'éditeur réel, « Maison Vélin » est le site.
 * Rien ne présente Sertelle, Aubrek ou Calade comme de vraies marques : les démos sont de simples
 * pages web, décrites comme des démonstrations (pas de Brand, Product ni Offer).
 */
import { EDITEUR } from './editeur';

export const NOM_SITE = 'Maison Vélin';

interface Page {
  url: string; // URL canonique absolue
  titre: string;
  description: string;
  site: string; // racine du site, ex. https://velin.devbrek.fr/
}

export function jsonLd({ url, titre, description, site }: Page) {
  const devbrek = `${EDITEUR.site}/#organisation`;
  const siteId = `${site}#site`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': devbrek,
        name: EDITEUR.nomCommercial,
        url: EDITEUR.site,
        logo: { '@type': 'ImageObject', url: new URL('/logo/carre-monogramme-jour.svg', site).href, width: 1024, height: 1024 },
      },
      {
        '@type': 'WebSite',
        '@id': siteId,
        name: NOM_SITE,
        url: site,
        inLanguage: 'fr-FR',
        publisher: { '@id': devbrek },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: titre,
        description,
        inLanguage: 'fr-FR',
        isPartOf: { '@id': siteId },
        publisher: { '@id': devbrek },
      },
    ],
  };
}
