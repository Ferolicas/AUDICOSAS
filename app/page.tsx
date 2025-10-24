export default function Page() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Auditoría y Consultoría Empresarial para impulsar tu rentabilidad
          </h1>
          <p className="mt-5 text-slate-300">
            Optimiza recursos, potencia mercados y eleva tu desempeño con metodologías probadas en ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, Gestión Empresarial y Proyectos.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="/register" className="px-5 py-3 rounded bg-accent text-black font-semibold">Agenda una consultoría</a>
            <a href="#servicios" className="px-5 py-3 rounded border border-slate-700">Ver portafolio</a>
          </div>
          <div className="mt-6 text-xs text-slate-400">
            Cali, Valle del Cauca · Colombia · Reconocimiento en el Suroccidente colombiano (Visión 2030)
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
          <ul className="space-y-3 text-sm">
            <li>✓ Auditorías en ISO 9001, 14001, 45001</li>
            <li>✓ Consultoría en Gestión de Calidad, Ambiental, SST y Riesgo</li>
            <li>✓ Mercadeo, Ventas, Servicio al Cliente y Atención al Usuario</li>
            <li>✓ Formulación y Evaluación de Proyectos</li>
            <li>✓ Diseño de Páginas Web y Posicionamiento en Redes</li>
          </ul>
          <div className="mt-6 text-xs text-slate-400">Valores: Compromiso · Responsabilidad · Honestidad · Respeto · Confidencialidad</div>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold">Portafolio de Servicios</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            { title: 'Auditorías Integradas', desc: 'Auditorías internas y de segunda parte en ISO 9001, 14001 y 45001.' },
            { title: 'Sistemas Integrados de Gestión', desc: 'Diseño, implementación, mejora y mantenimiento de SIG.' },
            { title: 'Gestión Empresarial', desc: 'Procesos, indicadores, mejora continua, atención al usuario y servicio al cliente.' },
            { title: 'Proyectos', desc: 'Formulación, evaluación y gerencia de proyectos de desarrollo.' },
            { title: 'Mercadeo y Ventas', desc: 'Estrategia comercial, experiencia de cliente, posicionamiento en redes.' },
            { title: 'Web + SEO', desc: 'Diseño de páginas web y optimización para buscadores y redes.' },
          ].map((s) => (
            <div key={s.title} className="p-5 rounded-xl border border-slate-800 bg-slate-900/30">
              <div className="text-lg font-medium">{s.title}</div>
              <div className="text-sm text-slate-300 mt-2">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="valores" className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-semibold">Nuestro Enfoque</h2>
        <p className="mt-4 text-slate-300">
          Equipo con formación en Administración de Empresas, Negocios Internacionales e Ingeniería de Sistemas; especialistas en Proyectos de Desarrollo y en Sistemas Integrados de Gestión. Certificados como Auditores Internos ISO 9001, 14001 y 45001.
        </p>
      </section>

      <section id="contacto" className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-slate-800 p-8 bg-gradient-to-br from-slate-900/40 to-slate-900/10">
          <div className="text-2xl font-semibold">Conversemos de tus objetivos</div>
          <p className="text-slate-300 mt-2">Déjanos tus datos y agenda una consultoría sin costo.</p>
          <div className="mt-6">
            <a className="px-5 py-3 rounded bg-primary text-black font-semibold" href="/register">Registrarme</a>
          </div>
          <div className="mt-6 text-sm text-slate-400">Correo: audicoempresarial@gmail.com · WhatsApp: +57 316 137 4657</div>
        </div>
      </section>
    </>
  )
}

