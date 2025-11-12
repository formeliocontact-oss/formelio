export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container prose prose-gray mx-auto max-w-4xl px-4">
        <h1>Politique de Confidentialité</h1>

        <p className="lead">
          Conformément au Règlement Général sur la Protection des Données (RGPD)
          et à la loi Informatique et Libertés, Formelio s&apos;engage à
          protéger vos données personnelles.
        </p>

        <h2>1. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul>
          <li>Données d&apos;identification (nom, prénom, email, téléphone)</li>
          <li>Données professionnelles (profession, entreprise)</li>
          <li>
            Documents fournis volontairement pour le traitement de vos dossiers
          </li>
          <li>Données de connexion (logs, adresse IP)</li>
        </ul>

        <h2>2. Finalité du traitement</h2>
        <p>Les données sont utilisées pour :</p>
        <ul>
          <li>Traiter vos demandes de formalités juridiques</li>
          <li>Gérer votre compte client</li>
          <li>Vous informer de l&apos;avancement de vos dossiers</li>
          <li>Améliorer nos services</li>
          <li>Respecter nos obligations légales et réglementaires</li>
        </ul>

        <h2>3. Base légale du traitement</h2>
        <p>Le traitement de vos données repose sur :</p>
        <ul>
          <li>Votre consentement</li>
          <li>L&apos;exécution du contrat de prestation de services</li>
          <li>Le respect d&apos;obligations légales</li>
          <li>L&apos;intérêt légitime de Formelio</li>
        </ul>

        <h2>4. Durée de conservation</h2>
        <p>
          Vos données sont conservées pendant la durée nécessaire à
          l&apos;accomplissement des finalités mentionnées ci-dessus, et
          conformément aux obligations légales (durées légales de conservation
          des documents administratifs).
        </p>

        <h2>5. Vos droits (RGPD)</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>
            <strong>Droit d&apos;accès :</strong> obtenir une copie de vos
            données
          </li>
          <li>
            <strong>Droit de rectification :</strong> corriger vos données
            inexactes
          </li>
          <li>
            <strong>Droit à l&apos;effacement :</strong> demander la suppression
            de vos données
          </li>
          <li>
            <strong>Droit à la portabilité :</strong> récupérer vos données dans
            un format structuré
          </li>
          <li>
            <strong>Droit d&apos;opposition :</strong> vous opposer au
            traitement de vos données
          </li>
          <li>
            <strong>Droit à la limitation :</strong> limiter le traitement de
            vos données
          </li>
        </ul>

        <p>
          Pour exercer vos droits, contactez-nous à :{' '}
          <a href="mailto:contact@formelio.fr">contact@formelio.fr</a>
        </p>

        <h2>6. Sécurité des données</h2>
        <p>
          Formelio met en œuvre toutes les mesures techniques et
          organisationnelles appropriées pour garantir la sécurité de vos
          données contre la destruction, la perte, l&apos;altération, la
          divulgation non autorisée ou l&apos;accès non autorisé.
        </p>

        <h2>7. Hébergement des données</h2>
        <p>
          Vos données sont hébergées en Europe (région EU-Central-1) par
          Supabase, conforme au RGPD. Les données sont stockées sur des serveurs
          sécurisés et font l&apos;objet de sauvegardes régulières.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Notre site utilise des cookies strictement nécessaires au
          fonctionnement du site (authentification, préférences). Aucun cookie
          publicitaire ou de tracking n&apos;est utilisé. Vous pouvez désactiver
          les cookies dans les paramètres de votre navigateur.
        </p>

        <h2>9. Transfert de données</h2>
        <p>
          Vos données peuvent être partagées avec des prestataires tiers
          uniquement dans le cadre de l&apos;exécution de nos services (greffes,
          administrations, services techniques). Ces prestataires sont soumis
          aux mêmes obligations de protection des données.
        </p>

        <h2>10. Modifications</h2>
        <p>
          Formelio se réserve le droit de modifier la présente politique de
          confidentialité à tout moment. Les modifications entreront en vigueur
          dès leur publication sur le site.
        </p>

        <h2>11. Contact</h2>
        <p>
          Pour toute question concernant cette politique de confidentialité ou
          le traitement de vos données personnelles, contactez-nous :
        </p>
        <ul>
          <li>
            Email : <a href="mailto:contact@formelio.fr">contact@formelio.fr</a>
          </li>
          <li>Adresse : [À COMPLÉTER]</li>
        </ul>

        <h2>12. Réclamation</h2>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez
          introduire une réclamation auprès de la Commission Nationale de
          l&apos;Informatique et des Libertés (CNIL) :{' '}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.cnil.fr
          </a>
        </p>
      </div>
    </div>
  );
}
