"use client"
import { useModal } from '@/components/ModalContext'
import Accordion from '@/components/Accordion'

/* ═══════════════════════════════════════════════ */
/*  SVG Icon helpers                               */
/* ═══════════════════════════════════════════════ */
const Icon = ({ d, cls }: { d: string; cls?: string }) => (
  <svg className={cls || "w-6 h-6"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{typeof d === 'string' ? <path d={d} /> : d}</svg>
)

const CheckIcon = () => <span className="text-amber-600 font-bold text-lg leading-none">&#10003;</span>
const XIcon = () => <span className="text-red-500 font-bold text-lg leading-none">&#10007;</span>

/* ═══════════════════════════════════════════════ */
/*  Data                                           */
/* ═══════════════════════════════════════════════ */

const PROBLEMS = [
  'Has perdido contratos porque te piden certificación ISO y no la tienes',
  'Tus procesos varían según quien los ejecute, sin estándares claros',
  'Desperdicias dinero en reprocesos, errores y materiales sin control',
  'Tus costos energéticos están fuera de control',
  'Clientes se quejan de inconsistencias en calidad o entregas',
  'Todo depende de 2-3 personas clave y si faltan hay caos',
  'Quieres participar en licitaciones públicas pero no cumples requisitos',
  'Sabes que tu competencia está certificándose y quedas rezagado',
  'Has recibido multas o sanciones por no cumplir con las normas ambientales',
  'Te han hecho reclamaciones por incumplir los tiempos de entrega',
]

const STATS = [
  { value: '15-35%', label: 'Reducción Costos Operativos', sub: 'Ahorro promedio primer año: $50K-$120K', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
  { value: '20-30%', label: 'Ahorro Energético', sub: 'Menos consumo = más rentabilidad', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8' },
  { value: '30-50%', label: 'Más Contratos Ganados', sub: 'Acceso a mercados antes cerrados', icon: 'M6 9H4.5a2.5 2.5 0 010-5C6 4 8 5.5 8 8v1M18 9h1.5a2.5 2.5 0 000-5C18 4 16 5.5 16 8v1M8 9v10a2 2 0 002 2h4a2 2 0 002-2V9' },
  { value: '12-18', label: 'Meses para ROI Completo', sub: 'Después: ganancia pura año tras año', icon: 'M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0' },
  { value: '73%', label: 'De Grandes Empresas', sub: 'Solo contratan proveedores certificados', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2' },
]

const PHASES = [
  {
    num: 1, title: 'Diagnóstico Gratuito', duration: '1 semana', investment: '$0 (GRATIS)',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    tasks: ['Visitamos tu empresa', 'Analizamos procesos actuales', 'Identificamos brechas vs. requisitos ISO', 'Detectamos oportunidades de ahorro', 'Calculamos ROI potencial para TU caso'],
    deliverables: ['Reporte detallado de situación actual', 'Plan de acción personalizado', 'Cotización transparente', 'Respuestas a todas tus dudas'],
  },
  {
    num: 2, title: 'Diseño a Tu Medida', duration: '3-4 semanas', investment: null,
    icon: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
    tasks: ['Diseñamos procedimientos adaptados a tu realidad', 'Creamos documentación que tu equipo entienda', 'Aprovechamos lo que ya funciona bien', 'Definimos indicadores relevantes'],
    deliverables: ['Manual de calidad personalizado', 'Procedimientos operativos claros', 'Formatos prácticos y usables', 'Mapa de procesos de tu empresa'],
  },
  {
    num: 3, title: 'Implementación Acompañada', duration: '3-5 meses', investment: null,
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    tasks: ['Capacitamos a tu equipo completo', 'Implementamos sistemas paso a paso', 'Trabajamos codo a codo contigo', 'Medimos avances semanalmente'],
    deliverables: ['Equipo capacitado y comprometido', 'Sistemas funcionando en operación real', 'Indicadores siendo monitoreados', 'Cultura de mejora continua iniciada'],
  },
  {
    num: 4, title: 'Preparación para Auditoría', duration: '2-4 semanas', investment: null,
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    tasks: ['Auditoría interna simulada', 'Identificamos áreas de mejora', 'Corregimos no conformidades', 'Preparamos a tu equipo para auditoría externa'],
    deliverables: ['Tu empresa 100% lista', 'Equipo confiado y preparado', 'Documentación completa y ordenada', 'Cero sorpresas en auditoría'],
  },
  {
    num: 5, title: 'Certificación y Mejora Continua', duration: 'Permanente', investment: null,
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2',
    tasks: ['Acompañamos en auditoría de certificación', 'Soporte post-certificación incluido', 'Asesoría para mantener sistemas', 'Preparación para auditorías de seguimiento'],
    deliverables: ['Certificado ISO oficial', 'Sistema que sigue generando valor', 'Soporte cuando lo necesites', 'Evolución continua de tu empresa'],
  },
]

const CASES = [
  {
    sector: 'Manufactura', employees: 45, revenue: '$3M', time: '8 meses',
    certs: 'ISO 9001:2015 & ISO 14001:2015',
    situation: 'Veníamos perdiendo contratos importantes porque nuestros clientes potenciales exigían certificación ISO. Además, nuestros costos estaban fuera de control sin saber exactamente por qué.',
    challenges: ['$85,000 anuales en desperdicios de material', '$60,000 en reprocesos constantes', 'Contrato perdido de $180,000 por falta de certificación', 'Quejas recurrentes de clientes por retrasos'],
    results: [
      { label: 'Desperdicios reducidos', value: '-68%' },
      { label: 'Reprocesos eliminados', value: '-72%' },
      { label: 'Ahorro anual', value: '$98,000' },
      { label: 'Nuevos contratos', value: '$340,000/año' },
      { label: 'ROI completo', value: '10 meses' },
    ],
    testimonial: 'La certificación ISO cambió completamente nuestra empresa. No solo ganamos los contratos que antes perdíamos, nuestra operación es mucho más eficiente. La inversión se pagó sola en poco más de un año.',
    role: 'Director de Operaciones',
  },
  {
    sector: 'Servicios de Ingeniería', employees: 28, revenue: '$1.8M', time: '7 meses',
    certs: 'ISO 9001:2015',
    situation: 'Queríamos profesionalizar la empresa para crecer, pero todo dependía de mí y de dos personas clave. No había procesos documentados y cada proyecto se manejaba diferente.',
    challenges: ['Alta rotación de personal (45% anual)', 'Conocimiento solo en cabezas de fundadores', 'No podían participar en licitaciones grandes', 'Clientes corporativos pedían certificación'],
    results: [
      { label: 'Rotación personal', value: '-62%' },
      { label: 'Satisfacción clientes', value: '+38%' },
      { label: 'Nuevos contratos', value: '$280,000/año' },
      { label: 'Capacitación nuevos', value: '-55% tiempo' },
      { label: 'Margen utilidad', value: '+22%' },
    ],
    testimonial: 'Ahora puedo delegar con confianza. Tenemos un sistema que funciona incluso cuando yo no estoy. Eso no tiene precio. Accedimos a contratos corporativos que antes nos estaban vedados.',
    role: 'Gerente General',
  },
  {
    sector: 'Distribución Industrial', employees: 62, revenue: '$5.2M', time: '9 meses',
    certs: 'ISO 9001:2015 & ISO 14001:2015',
    situation: 'Nuestro mayor cliente corporativo nos dio un ultimátum: certifícate en ISO o buscamos otro proveedor. Eso representaba 35% de nuestra facturación.',
    challenges: ['Riesgo de perder cliente principal ($1.8M anuales)', 'Inventarios mal controlados', 'Consumo energético elevado en almacenes', 'Quejas por retrasos en entregas'],
    results: [
      { label: 'Cliente principal', value: 'RETENIDO' },
      { label: 'Nuevos clientes corp.', value: '+$920,000/año' },
      { label: 'Costos operativos', value: '-28%' },
      { label: 'Consumo energético', value: '-31%' },
      { label: 'Entregas a tiempo', value: '97%' },
    ],
    testimonial: 'No solo salvamos la relación con nuestro cliente principal, sino que ahora somos proveedores preferentes. La certificación nos abrió puertas que ni siquiera sabíamos que existían.',
    role: 'Gerente General',
  },
]

const DIFFERENTIATORS = [
  { title: 'Consultores Certificados', desc: 'Especialistas certificados en ISO 9001, ISO 14001 e ISO 45001 con años de experiencia práctica real.', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { title: 'Sistemas a Tu Medida', desc: 'Cero plantillas genéricas. Diseñamos cada procedimiento específicamente para TU empresa, TU sector, TU realidad operativa.', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Enfoque 100% Práctico', desc: 'Trabajamos con resultados medibles desde el primer mes. Si no genera valor, no lo hacemos. Simple.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { title: 'Sin Paralizar Operación', desc: 'Implementamos sistemas de forma paralela a tu operación diaria. Como remodelar tu casa mientras sigues viviendo en ella.', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { title: 'Plazos Realistas y Cumplidos', desc: 'Cronograma claro desde día uno con hitos medibles. Cumplimos lo que prometemos o extendemos soporte sin costo.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { title: 'Empoderamos a Tu Equipo', desc: 'No creamos dependencia. Capacitamos a tu gente para que ELLOS sean los protagonistas.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { title: 'Comunicación Transparente', desc: 'Siempre sabrás en qué etapa estamos, qué sigue y cómo vamos. Reuniones semanales. Acceso directo a tu consultor. Cero sorpresas.', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { title: 'Garantía de Resultados', desc: 'Si no obtienes tu certificación siguiendo nuestro método, seguimos trabajando sin costo adicional.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Soporte Post-Certificación', desc: 'Incluimos soporte post-certificación para auditorías de seguimiento, dudas y mejora continua. Estamos contigo a largo plazo.', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
]

const FAQ_ITEMS = [
  {
    question: '¿Cuánto cuesta realmente certificarse en ISO?',
    answer: (
      <div className="space-y-3">
        <p>La inversión típica por norma incluye consultoría + certificación externa y varía según el tamaño y complejidad de tu empresa:</p>
        <ul className="space-y-1">
          <li><strong>Microempresa (1-10 empleados):</strong> COP $8.000.000 - $15.000.000</li>
          <li><strong>Pequeña empresa (11-50 empleados):</strong> COP $15.000.000 - $28.000.000</li>
          <li><strong>Mediana empresa (51-200 empleados):</strong> COP $28.000.000 - $55.000.000</li>
          <li><strong>Mediana-Grande (201-500 empleados):</strong> COP $55.000.000 - $95.000.000</li>
          <li><strong>Gran empresa (+500 empleados):</strong> COP $95.000.000 - $200.000.000+</li>
        </ul>
        <p className="font-medium text-slate-800">Pero aquí está lo importante:</p>
        <p>Empresas certificadas ahorran en promedio <strong>$25.000.000-$60.000.000 anuales</strong> y ganan contratos adicionales por <strong>$40.000.000-$200.000.000 anuales</strong>.</p>
        <p className="text-amber-700 font-semibold">ROI real: 12-18 meses. La pregunta no es &quot;cuánto cuesta?&quot; sino &quot;cuánto pierdo cada mes sin certificarme?&quot;</p>
      </div>
    ),
  },
  {
    question: '¿Cuánto tiempo toma todo el proceso?',
    answer: (
      <div className="space-y-2">
        <p>Con nuestra metodología estructurada: <strong>6-9 meses</strong> desde inicio hasta certificado en mano.</p>
        <ul className="space-y-1">
          <li>Diagnóstico: 1 semana</li>
          <li>Diseño de sistemas: 3-4 semanas</li>
          <li>Implementación: 3-5 meses</li>
          <li>Preparación auditoría: 2-4 semanas</li>
          <li>Auditoría de certificación: 2-3 días</li>
        </ul>
        <p>Lo importante: <strong>NO tienes que paralizar tu operación</strong>. Todo se hace de forma paralela a tu negocio diario.</p>
      </div>
    ),
  },
  {
    question: '¿Es muy complicado? Requiere mucho papeleo?',
    answer: (
      <div className="space-y-3">
        <p>Este es el <strong>mito #1</strong> que le cuesta más dinero a las empresas. La realidad: ISO te pide documentar SOLO lo esencial.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-red-600 mb-1">NO necesitas:</p>
            <ul className="space-y-1 text-sm"><li>Manuales de 500 páginas que nadie lee</li><li>Formularios para cada respiración</li><li>Burocracia absurda e innecesaria</li></ul>
          </div>
          <div>
            <p className="font-semibold text-green-600 mb-1">SI necesitas:</p>
            <ul className="space-y-1 text-sm"><li>Procedimientos claros de procesos críticos</li><li>Registros que demuestren lo que haces</li><li>Sistema simple de seguimiento y mejora</li></ul>
          </div>
        </div>
        <p>De hecho, empresas bien certificadas <strong>REDUCEN papeleo innecesario</strong>, no lo aumentan.</p>
      </div>
    ),
  },
  {
    question: '¿Mi empresa es muy pequeña para certificarse?',
    answer: (
      <div className="space-y-3">
        <p>Tamaño NO es el factor decisivo. El factor es: <strong>tu mercado objetivo valora o exige certificación?</strong></p>
        <p>Probablemente SI tiene sentido si: vendes o quieres vender a gobierno/corporaciones, buscas profesionalizar para crecer, o has perdido contratos por falta de certificación.</p>
        <p>Hemos certificado empresas desde <strong>8 hasta 300 empleados</strong> éxitosamente.</p>
      </div>
    ),
  },
  {
    question: '¿Qué pasa si no paso la auditoría de certificación?',
    answer: (
      <div className="space-y-2">
        <p>Con nuestra metodología es extremadamente raro que no obtengas la certificación en la primera auditoría.</p>
        <p>Pero si hipotéticamente no se obtiene: los auditores dan un plazo para corregir observaciones y <strong>nosotros seguimos trabajando contigo SIN COSTO ADICIONAL</strong> hasta que obtengas el certificado. Esto está incluido en nuestra garantía.</p>
      </div>
    ),
  },
  {
    question: '¿Debo certificarme en ISO 9001, ISO 14001 o ambas?',
    answer: (
      <div className="space-y-2">
        <p><strong>ISO 9001:</strong> Si tus clientes exigen gestión de calidad, quieres optimizar procesos o participar en licitaciones.</p>
        <p><strong>ISO 14001:</strong> Si quieres reducir consumos energéticos, tu industria tiene impacto ambiental o buscas financiamiento verde.</p>
        <p><strong>Ambas:</strong> Los sistemas se integran, no se duplican. Implementarlas juntas es más eficiente que hacerlas por separado.</p>
        <p className="text-amber-700 font-semibold">En el diagnóstico gratuito analizamos tu caso específico y te recomendamos la mejor estrategia.</p>
      </div>
    ),
  },
  {
    question: '¿El certificado tiene vigencia? Hay que renovar?',
    answer: (
      <div className="space-y-2">
        <p>Los certificados ISO tienen vigencia de <strong>3 años</strong>.</p>
        <ul className="space-y-1">
          <li><strong>Año 1:</strong> Auditoría de certificación (te da el certificado)</li>
          <li><strong>Año 2-3:</strong> Auditorías de seguimiento (verifican que mantienes el sistema)</li>
          <li><strong>Año 4:</strong> Auditoría de recertificación (renuevas por 3 años más)</li>
        </ul>
        <p>Mantener el certificado es <strong>más fácil que obtenerlo inicialmente</strong>. Incluimos preparación para tu primera auditoría de seguimiento.</p>
      </div>
    ),
  },
  {
    question: '¿Puedo certificarme sin consultoría externa?',
    answer: (
      <div className="space-y-2">
        <p>Técnicamente sí, pero <strong>NO lo recomendamos</strong>. Sin consultor: tardarás 2 a 3 veces más tiempo (18-24 meses), alta probabilidad de fallar en auditoría (80%+), e invertirás tiempo valioso que deberías dedicar a tu negocio.</p>
        <p>Con consultoría profesional: experiencia de decenas de certificaciones exitosas, sistemas optimizados desde el inicio, y preparación garantizada.</p>
      </div>
    ),
  },
  {
    question: '¿Qué sectores o industrias pueden certificarse?',
    answer: (
      <div className="space-y-2">
        <p><strong>TODOS.</strong> Las normas ISO son aplicables a cualquier tipo de organización: manufactura, servicios, comercio, construcción, salud, educación, transporte, agricultura, hotelería y más.</p>
        <p>Las normas son genéricas intencionalmente. Se enfocan en <strong>CÓMO gestionas tu organización</strong>, no en QUE produces o vendes. Si tu empresa tiene clientes, procesos, empleados y productos o servicios — puede certificarse.</p>
      </div>
    ),
  },
  {
    question: '¿Mis empleados tendrán que hacer trabajo extra?',
    answer: (
      <div className="space-y-2">
        <p><strong>Ocasionalmente, durante la implementación (3-5 meses):</strong> SI, habrá trabajo adicional temporal — capacitaciones, participación en diseño de procedimientos, ajustar algunos hábitos.</p>
        <p><strong>Después de la implementación:</strong> NO, menos trabajo. Con sistemas bien diseñados: menos confusión, menos reprocesos, roles definidos, menos errores.</p>
        <p className="font-semibold text-slate-800">Resultado: equipo más eficiente que trabaja MEJOR, no MÁS.</p>
      </div>
    ),
  },
  {
    question: '¿Tengo que certificarme con un organismo específico?',
    answer: (
      <div className="space-y-2">
        <p>NO estás obligado a uno específico, PERO debe ser <strong>acreditado</strong> (SGS, Bureau Veritas, ICONTEC, TUV, AENOR, etc.).</p>
        <p>Nosotros NO certificamos (somos consultores). Preparamos a tu empresa para que CUALQUIER organismo certificador acreditado te certifique. Te ayudamos a elegir el más conveniente para tu caso.</p>
      </div>
    ),
  },
  {
    question: '¿Cuál es la experiencia de nuestro equipo?',
    answer: (
      <div className="space-y-3">
        <p>Experiencia de <strong>4 años</strong> liderando el Sistema de Gestión de Calidad ISO 9001:2015 del proceso Atención al Usuario de la Secretaría de Desarrollo Territorial y Participación Ciudadana de la <strong>Alcaldía de Santiago de Cali</strong>; experiencia de 4 años en atención de auditorías internas y externas-ICONTEC; experiencia en dos Recertificaciones del ICONTEC.</p>
        <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="font-semibold text-blue-800 mb-2">Nuestro Equipo</p>
          <p className="text-sm text-slate-700">Equipo con formación profesional en <strong>Administración de Empresas y Negocios Internacionales</strong>, y en <strong>Ingeniería de Sistemas</strong>; con especializaciones en Proyectos de Desarrollo, y en Sistemas Integrados de Gestión (Normas ISO 9001:2015, 14001:2015, 45001:2018); Certificación como <strong>Auditor Interno</strong> en las Normas ISO 9001:2015, 14001:2015, 45001:2018.</p>
        </div>
      </div>
    ),
  },
  {
    question: '¿Cuáles son las diferencias entre auditoría, consultoría y certificación?',
    answer: (
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-slate-800">Auditoría</p>
          <p>Es el proceso de evaluación para determinar si una organización cumple con los requisitos de una norma.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Consultoría</p>
          <p>Es un servicio de asesoría y acompañamiento para ayudar a las empresas a que cumplan con los requisitos de la norma.</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Certificación</p>
          <p>Es el reconocimiento formal y oficial otorgado por un organismo acreditado como ICONTEC, SGS, Bureau Veritas, entre otras, que indica que el sistema de gestión de la empresa cumple con los requisitos de la norma ISO.</p>
        </div>
      </div>
    ),
  },
]

const GUARANTEES = [
  { title: 'Garantía de Certificación', desc: 'Si sigues nuestro método y no obtienes certificación, seguimos trabajando sin costo adicional hasta que la obtengas.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Garantía de Tiempo', desc: 'Si por nuestra responsabilidad excedemos los plazos acordados, extendemos soporte adicional sin cargo.', icon: 'M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0' },
  { title: 'Confidencialidad Total', desc: 'Toda información de tu empresa está protegida por acuerdo de confidencialidad. Lo que vemos en tu empresa, queda en tu empresa.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { title: 'Satisfacción Garantizada', desc: 'Si en las primeras 2 semanas decides que no somos fit para tu empresa, cancelas sin penalización. Sin letra pequeña.', icon: 'M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5' },
]

/* ═══════════════════════════════════════════════ */
/*  Main Page Component                            */
/* ═══════════════════════════════════════════════ */
export default function Page() {
  const { setOpen } = useModal()

  return (
    <>
      {/* ══════════ HERO ══════════ */}
      <section id="inicio" className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F1B33 0%, #1B2A4A 40%, #2563EB 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pt-6 md:pt-10 lg:pt-12 pb-12 md:pb-16 lg:pb-20">
          <div className="grid lg:grid-cols-[1fr_45%] gap-12 items-center">
            <div className="max-w-3xl">
              <div className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full mb-6 tracking-wide">
                AUDITORIAS &middot; CONSULTORIA &middot; CERTIFICACIÓN ISO
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                ¿Tu Empresa Pierde Contratos por No Tener{' '}
                <span className="text-amber-400">Certificación ISO?</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl">
                Reduce costos hasta 35%, gana más licitaciones y transforma tu empresa en líder certificado en solo 6-9 meses
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-blue-100">
                <span className="flex items-center gap-2"><CheckIcon /> Reducción de costos operativos 15-35%</span>
                <span className="flex items-center gap-2"><CheckIcon /> Ahorro energético 20-30%</span>
                <span className="flex items-center gap-2"><CheckIcon /> Acceso a contratos exclusivos</span>
                <span className="flex items-center gap-2"><CheckIcon /> ROI garantizado en 12-18 meses</span>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <button onClick={() => setOpen(true)} className="btn-primary text-base px-8 py-4 animate-pulse-glow">
                  Agenda Tu Diagnóstico GRATUITO
                </button>
                <a href="#casos" className="btn-secondary text-base px-8 py-4">
                  Ver Casos de Éxito
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-end items-center self-stretch">
              <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl" style={{ height: '90%' }}>
                <img
                  src="/imagen.png"
                  alt="AUDICO ISO - Consultoría y Certificación"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PROBLEMS ══════════ */}
      <section id="problemas" className="section-light py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Reconoces Estas Situaciones en Tu Empresa?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {PROBLEMS.map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-red-50/60 border border-red-100 hover:bg-red-50 transition-colors">
                <XIcon />
                <span className="text-slate-700 text-sm leading-relaxed">{p}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Si identificaste al menos 2 de estos problemas, la <strong className="text-slate-900">certificación ISO es exactamente lo que tu empresa necesita.</strong>
            </p>
            <a href="#soluciones" className="inline-block mt-6 btn-outline">
              Descubre Cómo Solucionarlo
            </a>
          </div>
        </div>
      </section>

      {/* ══════════ SOLUTIONS ══════════ */}
      <section id="soluciones" className="section-gray py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              ISO 9001 e ISO 14001: Tu Ventaja Competitiva
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Transforma problemas en oportunidades con sistemas de gestión certificados que generan resultados medibles
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* ISO 9001 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138c.093.69.39 1.344.806 1.946a3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="text-xs font-bold text-blue-600 tracking-widest mb-1">ISO 9001:2015</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Sistema de Gestión de Calidad</h3>
              <ul className="space-y-2.5">
                {['Procesos documentados y estandarizados', 'Reducción de costos operativos 15-35%', 'Clientes más satisfechos (+25-45%)', 'Acceso a licitaciones exclusivas', 'Decisiones basadas en datos reales', 'Mejora continua sistematizada'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckIcon /><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ISO 14001 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 card-hover">
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="text-xs font-bold text-green-600 tracking-widest mb-1">ISO 14001:2015</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Sistema de Gestión Ambiental</h3>
              <ul className="space-y-2.5">
                {['Ahorro energético 20-30%', 'Reducción de desperdicios y consumos', 'Cumplimiento legal garantizado', 'Mejor imagen corporativa', 'Acceso a financiamiento verde', 'Sostenibilidad con rentabilidad'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckIcon /><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-2xl px-8 py-5">
              <p className="text-lg font-semibold text-slate-800">
                Cuando implementas <strong>AMBAS</strong> normas, maximizas resultados:
              </p>
              <p className="text-blue-600 font-bold mt-1">Rentabilidad + Sostenibilidad + Competitividad</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS / RESULTS ══════════ */}
      <section id="resultados" className="section-navy py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Resultados Reales de Empresas Certificadas
            </h2>
            <p className="mt-4 text-blue-200">
              No vendemos promesas. Estos son datos verificables.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {STATS.map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                  <Icon d={s.icon} cls="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-amber-400">{s.value}</div>
                <div className="text-sm font-semibold text-white mt-2">{s.label}</div>
                <div className="text-xs text-blue-200 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-blue-100 text-sm max-w-xl mx-auto">
            Estos números no son proyecciones. Son resultados reales de empresas que tomaron la decisión de certificarse.
          </p>
          <div className="mt-6 text-center">
            <button onClick={() => setOpen(true)} className="btn-primary text-base">
              Quiero Estos Resultados Para Mi Empresa
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ PROCESS / TIMELINE ══════════ */}
      <section id="proceso" className="section-light py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Nuestro Método: Simple, Práctico y Efectivo
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              En 5 fases claras llevamos tu empresa de donde está hoy a certificada y generando resultados
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {PHASES.map((phase) => (
              <div key={phase.num} className="relative bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden card-hover">
                <div className="flex flex-col md:flex-row">
                  {/* Phase number sidebar */}
                  <div className="md:w-48 flex-shrink-0 p-6 flex flex-col items-center justify-center text-center" style={{ background: 'linear-gradient(135deg, #1B2A4A, #2563EB)' }}>
                    <div className="text-4xl font-extrabold text-amber-400">0{phase.num}</div>
                    <div className="text-white font-bold text-sm mt-1">{phase.title}</div>
                    <div className="text-blue-200 text-xs mt-2">{phase.duration}</div>
                    {phase.investment && (
                      <div className="mt-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full">
                        {phase.investment}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Qué hacemos</h4>
                        <ul className="space-y-2">
                          {phase.tasks.map((t) => (
                            <li key={t} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="text-blue-500 mt-0.5">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                              </span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Qué obtienes</h4>
                        <ul className="space-y-2">
                          {phase.deliverables.map((d) => (
                            <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                              <CheckIcon />{d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-amber-50 border border-amber-200 rounded-2xl px-8 py-5">
              <div className="text-2xl font-extrabold text-slate-900">TIEMPO TOTAL: 6-9 MESES</div>
              <div className="text-amber-700 font-medium mt-1">desde diagnóstico hasta certificación</div>
            </div>
            <div className="mt-6">
              <button onClick={() => setOpen(true)} className="btn-primary text-base">
                Comienza Tu Fase 1 GRATIS Ahora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CASE STUDIES ══════════ */}
      <section id="casos" className="section-gray py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Empresas Reales, Resultados Reales
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Conoce como organizaciones transformaron su operación y rentabilidad
            </p>
          </div>

          <div className="space-y-8">
            {CASES.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                {/* Case header */}
                <div className="px-8 py-5 border-b border-slate-100 flex flex-wrap items-center gap-4" style={{ background: 'linear-gradient(135deg, #F8FAFC, #EFF6FF)' }}>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">CASO #{i + 1}</span>
                  <span className="text-sm font-semibold text-slate-800">{c.sector}</span>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{c.employees} empleados</span>
                    <span>Facturación: {c.revenue}/año</span>
                    <span>{c.certs}</span>
                    <span>{c.time}</span>
                  </div>
                </div>

                <div className="p-8">
                  {/* Situation */}
                  <blockquote className="text-slate-600 italic border-l-4 border-blue-200 pl-4 mb-6">
                    &ldquo;{c.situation}&rdquo;
                  </blockquote>

                  {/* Challenges */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Desafíos</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {c.challenges.map((ch) => (
                        <div key={ch} className="flex items-start gap-2 text-sm text-slate-600">
                          <XIcon /><span>{ch}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-3">Resultados</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {c.results.map((r) => (
                        <div key={r.label} className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                          <div className="text-xl font-extrabold text-green-700">{r.value}</div>
                          <div className="text-xs text-green-600 mt-1">{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-slate-50 rounded-xl p-5 flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">&ldquo;</div>
                    <div>
                      <p className="text-slate-700 text-sm italic leading-relaxed">{c.testimonial}</p>
                      <p className="text-xs text-slate-500 font-semibold mt-2">&mdash; {c.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-slate-700 font-semibold mb-4">Tu empresa puede ser nuestro próximo caso de éxito.</p>
            <button onClick={() => setOpen(true)} className="btn-primary text-base">
              Agenda Tu Diagnóstico Gratuito
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ DIFFERENTIATORS ══════════ */}
      <section id="diferenciadores" className="section-light py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Por Qué Confiar en Nosotros?
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Porque parte de nuestro equipo ha trabajado como líder de calidad con entidades como la Alcaldía de Cali.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DIFFERENTIATORS.map((d, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 card-hover group">
                <div className="w-12 h-12 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                  <Icon d={d.icon} cls="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{d.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 max-w-xl mx-auto">
              No elegimos clientes solo por facturación. Elegimos <strong className="text-slate-900">empresas comprometidas con la excelencia</strong>. Si ese es tu caso, trabajemos juntos.
            </p>
            <button onClick={() => setOpen(true)} className="mt-6 btn-primary">
              Quiero Trabajar Con Expertos Comprometidos
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section id="faq" className="section-gray py-20">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Preguntas Frecuentes
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Resolvemos las dudas más comunes de empresarios como tú
            </p>
          </div>

          <Accordion items={FAQ_ITEMS} />

          <div className="mt-10 text-center bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <p className="text-lg font-semibold text-slate-800">¿Tienes otra pregunta?</p>
            <p className="text-sm text-slate-600 mt-1">Agenda tu diagnóstico gratuito y resolvemos TODAS tus dudas personalmente.</p>
            <button onClick={() => setOpen(true)} className="mt-4 btn-primary">
              Agendar Diagnóstico y Resolver Mis Dudas
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ GUARANTEES ══════════ */}
      <section id="garantías" className="section-light py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tu Inversión Está Protegida
            </h2>
            <p className="mt-4 text-slate-600 text-lg">Nuestras garantías</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {GUARANTEES.map((g, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 text-center card-hover">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <Icon d={g.icon} cls="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{g.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section id="contacto" className="relative py-20" style={{ background: 'linear-gradient(135deg, #0F1B33 0%, #1B2A4A 40%, #2563EB 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-80 h-80 bg-amber-500 rounded-full blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                ¿Listo Para Transformar Tu Empresa?
              </h2>
              <p className="mt-4 text-xl text-blue-100">
                El primer paso es el más fácil. Y es completamente <strong className="text-amber-400">GRATIS</strong>.
              </p>

              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-amber-400 font-bold text-sm mb-3">EN TU DIAGNÓSTICO PERSONALIZADO:</div>
                <ul className="space-y-2.5">
                  {[
                    'Visitamos tu empresa y conocemos tu operación real',
                    'Analizamos tus procesos actuales y documentación existente',
                    'Identificamos brechas específicas vs. requisitos ISO',
                    'Detectamos oportunidades concretas de ahorro en TU caso',
                    'Calculamos ROI potencial personalizado para tu empresa',
                    'Te entregamos plan de acción detallado con tiempos y costos',
                    'Respondemos TODAS tus preguntas sin compromiso',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-blue-100">
                      <CheckIcon /><span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-slate-400 line-through text-sm">Valor: $1.500.000</span>
                  <span className="text-amber-400 font-extrabold text-xl">$0 GRATIS</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <div className="text-blue-100 text-sm font-semibold">Contacto directo:</div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href="tel:+573161374657" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                    +57 316 137 4657
                  </a>
                  <a href="https://wa.me/573161374657" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-300 hover:text-green-200 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.332-1.543l-.382-.228-2.65.889.889-2.65-.228-.382A9.94 9.94 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" /></svg>
                    WhatsApp
                  </a>
                  <a href="mailto:contacto@audicoiso.com" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
                    contacto@audicoiso.com
                  </a>
                </div>
                <div className="text-xs text-blue-300">
                  Lunes a Viernes: 8:00 AM - 6:00 PM &middot; Sábados: 9:00 AM - 1:00 PM
                </div>
              </div>
            </div>

            {/* Right - CTA Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full mb-3">
                  CUPOS LIMITADOS: 8 DIAGNÓSTICOS AL MES
                </div>
                <h3 className="text-xl font-bold text-slate-900">Solicita Tu Diagnóstico</h3>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-lg hover:shadow-xl text-lg cursor-pointer animate-pulse-glow"
              >
                SOLICITAR DIAGNÓSTICO GRATUITO
              </button>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Sin compromiso ni presión
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Sin letra pequeña
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Información valiosa que puedes usar
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  100% confidencial y protegido
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-400">
                Cali, Valle del Cauca &middot; Colombia &middot; AUDICO S.A.S.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
