import { useEffect } from 'react'
import mosaico from '../assets/mosaicos/Tlaloc.png'
import './LegalPage.css'

export default function Privacidad() {
  useEffect(() => {
    document.body.classList.add('page-legal')
    return () => document.body.classList.remove('page-legal')
  }, [])

  return (
    <article className="legal-page">
      <div
        className="legal-page__mosaic"
        style={{ backgroundImage: `url(${mosaico})` }}
        aria-hidden
      />

      <div className="legal-page__content">
        <h1 className="legal-page__title">AVISO DE PRIVACIDAD</h1>
        <p className="legal-page__meta">
          Última actualización: mayo 2026 · Versión: 1.1
        </p>

        <div className="legal-page__body">
          <h2>1. Identidad y domicilio del Responsable</h2>
          <p>
            <strong>JeelJel Kaanab</strong>, en adelante &quot;el Responsable&quot;, con domicilio en
            la Ciudad de México, México, y presencia digital en <strong>jeeljel.com</strong>, es la
            persona moral responsable del tratamiento de los datos personales que se recaben a
            través del presente sitio web, de conformidad con la{' '}
            <em>
              Ley Federal de Protección de Datos Personales en Posesión de los Particulares
            </em>{' '}
            (LFPDPPP) y su Reglamento.
          </p>
          <p>
            Para cualquier asunto relacionado con el tratamiento de tus datos personales, puedes
            contactarnos en: <strong>hola@jeeljel.com</strong>
          </p>

          <h2>2. Naturaleza del sitio y alcance del aviso</h2>
          <p>
            <strong>jeeljel.com</strong> (JeelJel Kaanab) opera principalmente como un sitio
            vitrina informativo que presenta el ecosistema de aplicaciones desarrolladas bajo la
            marca JeelJel Kaanab. La recolección de datos personales en esta página se limita
            estrictamente a la información que decidas proporcionar de manera voluntaria a través
            de los canales y formularios de contacto disponibles.
          </p>
          <blockquote>
            <strong>Aviso importante sobre las aplicaciones del ecosistema:</strong> Cada
            plataforma alojada o vinculada desde este sitio (Ikan Naat IA, Ollin Deportes, VirtYou,
            Izydra OS, Inkógnito) cuenta con su propio Aviso de Privacidad y Términos y
            Condiciones específicos, disponibles dentro de cada plataforma. El presente aviso
            aplica exclusivamente al dominio <strong>jeeljel.com</strong> y no cubre el
            tratamiento de datos realizado por dichas aplicaciones.
          </blockquote>

          <h2>3. Datos personales que podemos recabar</h2>
          <h3>3.1 A través del formulario de contacto</h3>
          <p>
            Cuando decidas comunicarte con nosotros mediante el formulario de contacto del sitio o
            directamente a través del correo <strong>hola@jeeljel.com</strong>, podremos recabar los
            siguientes datos personales:
          </p>
          <ul>
            <li>
              <strong>Nombre</strong> (nombre y apellido)
            </li>
            <li>
              <strong>Correo electrónico</strong>
            </li>
            <li>
              <strong>Mensaje o consulta</strong> que decidas compartir voluntariamente
            </li>
          </ul>
          <p>
            La finalidad de estos datos es <strong>exclusivamente</strong> brindar seguimiento a tu
            solicitud, consulta o petición. No serán utilizados para ningún otro fin sin tu
            consentimiento expreso.
          </p>
          <h3>3.2 Datos de navegación (registros técnicos)</h3>
          <p>
            De forma automática y mediante el uso de tecnologías de rastreo como{' '}
            <strong>Cookies</strong> y herramientas de análisis estadístico, nuestro sitio puede
            recabar:
          </p>
          <ul>
            <li>Dirección IP</li>
            <li>Tipo y versión de navegador</li>
            <li>Sistema operativo</li>
            <li>Páginas visitadas dentro del sitio</li>
            <li>Tiempo de permanencia en cada sección</li>
            <li>Fecha y hora de visita</li>
          </ul>
          <p>
            Estos datos se utilizan únicamente con <strong>fines estadísticos internos</strong>{' '}
            para mejorar la experiencia de navegación y el rendimiento del sitio. No se asocian a tu
            identidad personal ni se comparten con terceros.
          </p>

          <h2>4. Cookies y Web Beacons</h2>
          <p>
            Este sitio utiliza <strong>Cookies</strong> (pequeños archivos de texto que se almacenan
            en tu dispositivo) y puede hacer uso de <strong>Web Beacons</strong> (elementos de
            rastreo embebidos en páginas web) con las siguientes finalidades:
          </p>
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Finalidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cookies técnicas/esenciales</td>
                <td>Garantizar el correcto funcionamiento y navegación del sitio</td>
              </tr>
              <tr>
                <td>Cookies analíticas</td>
                <td>Recopilar datos estadísticos anónimos sobre el uso del sitio</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>¿Cómo puedes controlar las Cookies?</strong>
          </p>
          <p>
            Puedes inhabilitar, bloquear o eliminar las Cookies en cualquier momento desde la
            configuración de tu navegador, sin que esto afecte de forma significativa tu navegación
            general en el sitio. Para instrucciones específicas según tu navegador, consulta:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrean-preferencias"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/es-mx/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>

          <h2>5. Finalidades del tratamiento de datos</h2>
          <p>Los datos personales que recabemos serán tratados para las siguientes finalidades:</p>
          <p>
            <strong>Finalidades primarias (necesarias para la relación contigo):</strong>
          </p>
          <ul>
            <li>
              Atender y dar seguimiento a tus consultas, solicitudes o comentarios enviados mediante
              los canales de contacto
            </li>
            <li>Garantizar el correcto funcionamiento técnico del sitio</li>
          </ul>
          <p>
            <strong>Finalidades secundarias (sujetas a tu consentimiento):</strong>
          </p>
          <ul>
            <li>Informarte sobre actualizaciones relevantes del ecosistema JeelJel Kaanab</li>
            <li>
              Contactarte en caso de que tu solicitud requiera seguimiento adicional
            </li>
          </ul>
          <p>
            Si no deseas que tus datos sean utilizados para las finalidades secundarias, puedes
            manifestarlo en cualquier momento escribiéndonos a <strong>hola@jeeljel.com</strong>.
          </p>

          <h2>6. Base legal del tratamiento</h2>
          <p>
            El tratamiento de tus datos personales se realiza bajo las siguientes bases de
            legitimación, de conformidad con la LFPDPPP:
          </p>
          <ul>
            <li>
              <strong>Consentimiento:</strong> Para el tratamiento de los datos que nos
              proporciones voluntariamente a través del formulario de contacto o por correo
              electrónico.
            </li>
            <li>
              <strong>Interés legítimo:</strong> Para el tratamiento de registros técnicos de
              navegación (Cookies analíticas) con fines estadísticos internos y mejora del servicio.
            </li>
          </ul>

          <h2>7. Transferencia de datos a terceros</h2>
          <p>
            JeelJel Kaanab <strong>no vende, cede ni transfiere</strong> tus datos personales a
            terceros sin tu consentimiento, salvo en los casos previstos por la LFPDPPP o cuando sea
            necesario para cumplir con una obligación legal o resolución de autoridad competente.
          </p>
          <p>
            Los registros técnicos de navegación generados por herramientas de analítica (como
            servicios de métricas de rendimiento del servidor) no se comparten con terceros de forma
            que permitan identificar a los usuarios de manera personal.
          </p>

          <h2>8. Enlaces a plataformas de terceros y programas de afiliados</h2>
          <p>
            Este sitio puede contener <strong>enlaces a plataformas externas</strong>, incluyendo
            vínculos a programas de afiliados de terceros. Al hacer clic en dichos enlaces y acceder
            a plataformas externas, debes tener presente que:
          </p>
          <ul>
            <li>
              Las políticas de privacidad, términos y condiciones aplicables son{' '}
              <strong>responsabilidad exclusiva de dichos terceros</strong>.
            </li>
            <li>
              JeelJel Kaanab <strong>no es responsable</strong> del tratamiento de datos que
              realicen dichas plataformas ni de sus prácticas de privacidad.
            </li>
            <li>
              La <strong>creación de cuentas, uso, interacción o realización de transacciones</strong>{' '}
              en plataformas externas se rigen íntegramente bajo los Términos y Condiciones propios
              de cada tercero.
            </li>
          </ul>
          <p>
            Te recomendamos revisar el aviso de privacidad de cualquier plataforma externa antes de
            proporcionar tus datos.
          </p>

          <h2>9. Derechos ARCO</h2>
          <p>
            De conformidad con la LFPDPPP, tienes derecho a{' '}
            <strong>Acceder, Rectificar, Cancelar u Oponerte</strong> (derechos ARCO) al tratamiento
            de tus datos personales.
          </p>
          <p>
            Para ejercer cualquiera de estos derechos, envía una solicitud a{' '}
            <strong>hola@jeeljel.com</strong> indicando:
          </p>
          <ol>
            <li>Nombre completo y correo electrónico del titular</li>
            <li>Descripción clara del derecho que deseas ejercer</li>
            <li>Documentación que acredite tu identidad (en caso necesario)</li>
          </ol>
          <p>
            Daremos respuesta a tu solicitud en un plazo máximo de <strong>20 días hábiles</strong>
            , conforme a lo establecido en la LFPDPPP.
          </p>
          <p>
            Asimismo, tienes derecho a <strong>revocar el consentimiento</strong> que hayas otorgado
            para el tratamiento de tus datos personales en cualquier momento, siguiendo el mismo
            procedimiento descrito anteriormente.
          </p>

          <h2>10. Medidas de seguridad</h2>
          <p>
            JeelJel Kaanab implementa medidas técnicas, administrativas y físicas razonables para
            proteger tus datos personales contra pérdida, uso indebido, acceso no autorizado,
            divulgación, alteración o destrucción, incluyendo:
          </p>
          <ul>
            <li>Comunicaciones cifradas mediante protocolo HTTPS/SSL en todo el sitio</li>
            <li>Acceso restringido a los datos por personal autorizado</li>
            <li>Revisión periódica de los sistemas de seguridad</li>
          </ul>

          <h2>11. Modificaciones al presente Aviso de Privacidad</h2>
          <p>
            JeelJel Kaanab se reserva el derecho de actualizar o modificar el presente Aviso de
            Privacidad en cualquier momento, como resultado de nuevas disposiciones legales, cambios
            en nuestras prácticas de privacidad o el lanzamiento de nuevas funcionalidades en el
            sitio.
          </p>
          <p>
            <strong>
              Cualquier modificación será reflejada y visible a través de la fecha de &quot;Última
              actualización&quot; indicada al inicio de este documento.
            </strong>{' '}
            Te recomendamos revisar periódicamente esta página para mantenerte informado sobre cómo
            protegemos tu información.
          </p>
          <p>
            El uso continuado del sitio después de publicada una actualización implica la aceptación
            de los cambios realizados.
          </p>

          <h2>12. Contacto</h2>
          <p>
            Para cualquier duda, aclaración o solicitud relacionada con el tratamiento de tus datos
            personales o con el presente Aviso de Privacidad, puedes contactarnos en:
          </p>
          <p>
            <strong>Correo electrónico:</strong> hola@jeeljel.com
            <br />
            <strong>Sitio web:</strong>{' '}
            <a href="https://jeeljel.com">jeeljel.com</a>
          </p>

          <p className="legal-page__footer-note">
            Este Aviso de Privacidad fue elaborado en cumplimiento de la Ley Federal de Protección de
            Datos Personales en Posesión de los Particulares (LFPDPPP), su Reglamento, y los
            Lineamientos del Aviso de Privacidad emitidos por el INAI (Instituto Nacional de
            Transparencia, Acceso a la Información y Protección de Datos Personales).
          </p>
        </div>
      </div>
    </article>
  )
}
