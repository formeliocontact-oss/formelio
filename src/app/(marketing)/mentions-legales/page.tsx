export default function LegalNoticePage() {
  return (
    <article className="py-20">
      <div className="container prose prose-gray mx-auto max-w-4xl px-4">
        <h1>Mentions légales</h1>

        <section>
          <h2>Éditeur du site</h2>
          <p>
            <strong>Raison sociale :</strong> Formelio
            <br />
            <strong>SIRET :</strong> [À COMPLÉTER]
            <br />
            <strong>Adresse :</strong> [À COMPLÉTER]
            <br />
            <strong>Email :</strong> contact@formelio.fr
            <br />
          </p>
        </section>

        <section>
          <h2>Directeur de la publication</h2>
          <p>[Nom du fondateur]</p>
        </section>

        <section>
          <h2>Hébergement</h2>
          <p>
            <strong>Hébergeur :</strong> Vercel Inc.
            <br />
            <strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789,
            USA
            <br />
          </p>
        </section>

        <section>
          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, logos) est la
            propriété exclusive de Formelio. Toute reproduction, distribution,
            modification, adaptation, retransmission ou publication de ces
            différents éléments est strictement interdite sans l&apos;accord
            exprès par écrit de Formelio.
          </p>
        </section>

        <section>
          <h2>Responsabilité</h2>
          <p>
            Formelio s&apos;efforce d&apos;assurer au mieux l&apos;exactitude et
            la mise à jour des informations diffusées sur ce site. Toutefois,
            Formelio ne peut garantir l&apos;exactitude, la précision ou
            l&apos;exhaustivité des informations mises à disposition sur ce
            site.
          </p>
        </section>

        <section>
          <h2>Loi applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En
            cas de litige, compétence exclusive est attribuée aux tribunaux
            compétents.
          </p>
        </section>
      </div>
    </article>
  );
}
