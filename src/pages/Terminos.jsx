import { useEffect } from 'react'
import mosaico from '../assets/mosaicos/Tlaloc.png'
import './LegalPage.css'

export default function Terminos() {
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
        <h1 className="legal-page__title">TÉRMINOS DE USO</h1>
        <p className="legal-page__meta">Última actualización: mayo 2026</p>

        <div className="legal-page__body">
          <h2>1. Aceptación de los Términos</h2>
          <p>
            El acceso, navegación y uso de jeeljel.com implica la aceptación plena e incondicional de
            los presentes Términos de Uso por parte del usuario. Si no estás de acuerdo con alguno de
            estos términos, deberás abstenerte de utilizar este sitio.
          </p>

          <h2>2. Identificación del Titular</h2>
          <p>
            JeelJel Kaanab es el titular de los derechos sobre el contenido, marcas, logotipos,
            diseño y demás elementos que conforman este sitio web, accesible a través de jeeljel.com.
          </p>
          <p>
            Para cualquier consulta relacionada con estos términos, puedes contactarnos en:{' '}
            hola@jeeljel.com
          </p>

          <h2>3. Restricción de Edad — Mayoría de Edad Obligatoria</h2>
          <p>
            El acceso a jeeljel.com está destinado exclusivamente a personas mayores de 18 años.
          </p>
          <p>
            Al navegar en este sitio, el usuario declara, bajo su propia responsabilidad, tener 18
            años cumplidos o más, o contar con la autorización expresa de su tutor legal en caso de
            ser menor de edad.
          </p>
          <p>
            JeelJel Kaanab no se hace responsable del acceso de menores de edad al sitio ni a las
            plataformas del ecosistema a las que este redirige, incluyendo —sin limitarse a—
            plataformas de contenido para adultos, plataformas con modalidades de apuestas deportivas
            o cualquier otro contenido restringido por edad. La responsabilidad de supervisar el uso
            de internet por parte de menores recae exclusivamente en sus padres o tutores legales.
          </p>

          <h2>4. Naturaleza del Sitio</h2>
          <p>
            jeeljel.com es un sitio de carácter informativo y de catálogo. Su función principal es
            presentar y dar acceso al ecosistema de aplicaciones y plataformas desarrolladas bajo la
            marca JeelJel Kaanab. Este sitio no ofrece directamente servicios de compra, suscripción,
            almacenamiento de datos personales ni procesamiento de pagos a través de su página
            principal, salvo que se indique expresamente en una sección específica habilitada para
            ello.
          </p>

          <h2>5. Propiedad Intelectual</h2>
          <p>
            Todo el contenido de jeeljel.com, incluyendo pero no limitándose a: textos, imágenes,
            logotipos, íconos, diseño gráfico, código fuente, animaciones, nombres comerciales y
            marcas, es propiedad de JeelJel Kaanab o de sus respectivos titulares, y se encuentra
            protegido por la legislación aplicable en materia de propiedad intelectual.
          </p>
          <p>
            Queda estrictamente prohibida la reproducción, distribución, modificación, comunicación
            pública o cualquier otro uso —parcial o total— de dichos contenidos sin la autorización
            previa y escrita de JeelJel Kaanab.
          </p>

          <h2>6. Ecosistema de Aplicaciones</h2>
          <p>
            JeelJel Kaanab opera como plataforma de acceso a un ecosistema de aplicaciones
            independientes. Los enlaces disponibles en este sitio pueden redirigir al usuario hacia
            las siguientes plataformas:
          </p>
          <table>
            <thead>
              <tr>
                <th>Plataforma</th>
                <th>Descripción general</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ikan Naat IA</td>
                <td>Ecosistema de inteligencia artificial latinoamericano</td>
              </tr>
              <tr>
                <td>Ollin Deportes</td>
                <td>Seguimiento deportivo en tiempo real con modo apostador</td>
              </tr>
              <tr>
                <td>VirtYou</td>
                <td>Identidad digital, tarjeta virtual y organizador personal</td>
              </tr>
              <tr>
                <td>Izydra OS</td>
                <td>Gestión operativa para seguridad privada y empresas</td>
              </tr>
              <tr>
                <td>Inkógnito</td>
                <td>Plataforma de relatos y contenido para adultos</td>
              </tr>
            </tbody>
          </table>
          <p>
            Cada una de estas plataformas es independiente de jeeljel.com, cuenta con su propio aviso
            de privacidad, términos de uso y políticas internas, y es responsable de forma exclusiva
            de su propio contenido, funcionamiento y relación con sus usuarios.
          </p>

          <h2>7. Deslinde de Responsabilidad sobre Plataformas del Ecosistema</h2>
          <p>
            JeelJel Kaanab actúa únicamente como punto de acceso o catálogo hacia las plataformas
            listadas en la sección anterior. En consecuencia:
          </p>
          <ul>
            <li>
              JeelJel Kaanab no es responsable del contenido, políticas, servicios, disponibilidad ni
              actuaciones de las plataformas del ecosistema.
            </li>
            <li>
              Cualquier conflicto, reclamación o controversia derivada del uso de dichas plataformas
              deberá dirigirse directamente a la plataforma correspondiente.
            </li>
            <li>
              El hecho de que jeeljel.com enlace a una plataforma del ecosistema no implica que JeelJel
              Kaanab respalde, valide ni garantice el contenido o los servicios de dicha plataforma.
            </li>
          </ul>

          <h2>8. Enlaces de Afiliado</h2>
          <p>
            Algunos enlaces presentes en este sitio pueden ser enlaces de afiliado. Esto significa que
            JeelJel Kaanab puede recibir una comisión económica por compras, registros o suscripciones
            realizadas a través de ellos, sin costo adicional para el usuario.
          </p>
          <p>
            JeelJel Kaanab se compromete a mantener transparencia sobre el uso de este tipo de
            enlaces. La existencia de una relación de afiliado no influye en la información ni en las
            opiniones expresadas en el sitio.
          </p>

          <h2>9. Disponibilidad del Servicio</h2>
          <p>
            JeelJel Kaanab no garantiza la disponibilidad ininterrumpida, continua ni libre de errores
            de jeeljel.com ni de las plataformas del ecosistema. El sitio puede experimentar
            interrupciones temporales por razones técnicas, de mantenimiento, fuerza mayor u otras
            causas fuera del control razonable de JeelJel Kaanab, sin que ello constituya
            incumplimiento de ninguna obligación frente al usuario.
          </p>

          <h2>10. Limitación de Responsabilidad</h2>
          <p>
            En la máxima medida permitida por la ley aplicable, JeelJel Kaanab no será responsable
            por daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso
            o la imposibilidad de uso de este sitio o de las plataformas a las que redirige,
            incluyendo pérdidas de datos, pérdidas económicas o daños a dispositivos del usuario.
          </p>
          <p>
            El uso de jeeljel.com y de las plataformas del ecosistema es bajo el propio riesgo del
            usuario.
          </p>

          <h2>11. Modificaciones al Sitio y a los Presentes Términos</h2>
          <p>
            JeelJel Kaanab se reserva el derecho de modificar, actualizar, suspender o discontinuar
            cualquier parte del sitio, sus contenidos o sus funcionalidades en cualquier momento y
            sin previo aviso.
          </p>
          <p>
            Asimismo, estos Términos de Uso podrán ser modificados en cualquier momento. Los cambios
            serán publicados en esta misma página con la fecha de actualización correspondiente. El
            uso continuado de jeeljel.com después de publicada una actualización implica la
            aceptación de los nuevos términos.
          </p>
          <p>Se recomienda al usuario revisar periódicamente este documento.</p>

          <h2>12. Ley Aplicable y Jurisdicción</h2>
          <p>
            Los presentes Términos de Uso se rigen e interpretan de conformidad con las leyes vigentes
            de los Estados Unidos Mexicanos.
          </p>
          <p>
            Para la resolución de cualquier controversia, reclamación o conflicto derivado del uso de
            jeeljel.com que no pueda resolverse de forma amistosa, las partes se someten
            expresamente a la jurisdicción de los tribunales competentes de la Ciudad de México,
            renunciando a cualquier otro fuero que pudiera corresponderles por razón de su domicilio
            presente o futuro.
          </p>

          <h2>13. Contacto</h2>
          <p>
            Para dudas, aclaraciones, quejas o sugerencias relacionadas con estos Términos de Uso o
            con el funcionamiento de jeeljel.com, puedes comunicarte a través de:
          </p>
          <p>📧 hola@jeeljel.com</p>

          <p>© 2026 JeelJel Kaanab. Todos los derechos reservados.</p>
        </div>
      </div>
    </article>
  )
}
