import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getDict, locales } from "@/lib/i18n";
import { href, paths } from "@/lib/nav";
import { site } from "@/lib/site";
import PageHero from "@/components/PageHero";

// Textos legales en castellano (versión vinculante). Revisar con asesoría antes de publicar en el dominio.
const docs: Record<string, { title: string; body: ReactNode }> = {
  "aviso-legal": {
    title: "Aviso legal",
    body: (
      <>
        <p>
          En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los
          datos del titular de este sitio web:
        </p>
        <ul>
          <li>Titular: {site.legalName}</li>
          <li>NIF: [pendiente de completar]</li>
          <li>Domicilio: {site.address}</li>
          <li>Email: {site.email}</li>
          <li>Teléfono: {site.phone}</li>
        </ul>
        <h2>Condiciones de uso</h2>
        <p>
          El acceso a este sitio web atribuye la condición de usuario e implica la aceptación de estas condiciones. El usuario se compromete a hacer un
          uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe.
        </p>
        <h2>Propiedad intelectual</h2>
        <p>
          Los contenidos de este sitio (textos, diseño, logotipos y código) son propiedad de {site.legalName} o de terceros que han autorizado su uso.
          Queda prohibida su reproducción sin autorización expresa. Las marcas de clientes se muestran únicamente a efectos de referencia profesional.
        </p>
        <h2>Responsabilidad</h2>
        <p>
          {site.legalName} no se hace responsable de los daños derivados del uso de la información de este sitio ni de los contenidos de sitios de
          terceros enlazados.
        </p>
        <h2>Legislación aplicable</h2>
        <p>Estas condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los juzgados y tribunales de Madrid.</p>
      </>
    ),
  },
  privacidad: {
    title: "Política de privacidad",
    body: (
      <>
        <h2>Responsable del tratamiento</h2>
        <p>
          {site.legalName} · {site.address} · {site.email}
        </p>
        <h2>Qué datos tratamos y para qué</h2>
        <ul>
          <li>Formulario de contacto: nombre, email, empresa, teléfono y mensaje, para responder a tu solicitud.</li>
          <li>Test de visibilidad: nombre, email, sector y respuestas, para enviarte el diagnóstico y, en su caso, contactarte en relación con él.</li>
        </ul>
        <h2>Legitimación</h2>
        <p>Tu consentimiento expreso al enviar el formulario (art. 6.1.a RGPD). Puedes retirarlo en cualquier momento.</p>
        <h2>Conservación</h2>
        <p>Conservamos los datos mientras dure la relación y, después, durante los plazos legalmente exigibles.</p>
        <h2>Destinatarios</h2>
        <p>
          No cedemos datos a terceros salvo obligación legal. Utilizamos proveedores tecnológicos que actúan como encargados del tratamiento
          (alojamiento web en Vercel Inc. y envío de correo electrónico), que pueden implicar transferencias internacionales amparadas en cláusulas
          contractuales tipo de la Comisión Europea.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a {site.email}. También
          puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
        </p>
      </>
    ),
  },
  cookies: {
    title: "Política de cookies",
    body: (
      <>
        <p>
          Este sitio web no utiliza cookies publicitarias ni de seguimiento. Solo se emplean los elementos técnicos estrictamente necesarios para su
          funcionamiento, que no requieren consentimiento según el art. 22.2 de la LSSI-CE.
        </p>
        <p>
          Algunos servicios externos enlazados o incrustados (por ejemplo, el calendario de reservas o Substack) pueden instalar sus propias cookies
          cuando interactúas con ellos. Consulta sus políticas respectivas.
        </p>
        <p>Si en el futuro incorporamos herramientas de analítica o publicidad, actualizaremos esta política y solicitaremos tu consentimiento.</p>
      </>
    ),
  },
};

export function generateStaticParams() {
  return locales.flatMap((locale) => Object.keys(docs).map((doc) => ({ locale, doc })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/legal/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  return docs[doc] ? { title: docs[doc].title, robots: { index: false } } : {};
}

export default async function LegalPage({ params }: PageProps<"/[locale]/legal/[doc]">) {
  const { locale, doc } = await params;
  const d = docs[doc];
  if (!d) notFound();
  const t = getDict(locale);
  return (
    <>
      <PageHero title={d.title} crumbs={[{ label: "Lateral Zinkin", href: href(locale) }, { label: d.title, href: href(locale, `${paths.legal}/${doc}`) }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap prose" lang="es">
          {t.pages.legalNote && (
            <p>
              <em>{t.pages.legalNote}</em>
            </p>
          )}
          {d.body}
        </div>
      </section>
    </>
  );
}
