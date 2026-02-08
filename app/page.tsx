"use client"
import { useModal } from '@/components/ModalContext'

export default function Page() {
  const { setOpen } = useModal()

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900 text-justify">
            Auditoría y Consultoría Empresarial para impulsar tu rentabilidad
          </h1>
          <p className="mt-5 text-slate-600">
            Optimiza recursos, potencia mercados y eleva tu desempeño con metodologías probadas en ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, Gestión Empresarial y Proyectos.
          </p>
          <div className="mt-8 flex gap-3">
            <button onClick={() => setOpen(true)} className="px-5 py-3 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shadow-sm cursor-pointer">Agenda una consultoría</button>
            <a href="#servicios" className="px-5 py-3 rounded-md border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-semibold transition-colors">Ver portafolio</a>
          </div>
          <div className="mt-6 text-xs text-slate-500">
            Cali, Valle del Cauca · Colombia · Reconocimiento en el Suroccidente colombiano (Visión 2030)
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">&#10003;</span> Auditorías en ISO 9001, 14001, 45001</li>
            <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">&#10003;</span> Consultoría en Gestión de Calidad, Ambiental, SST y Riesgo</li>
            <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">&#10003;</span> Mercadeo, Ventas, Servicio al Cliente y Atención al Usuario</li>
            <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">&#10003;</span> Formulación y Evaluación de Proyectos</li>
            <li className="flex items-start gap-2"><span className="text-amber-600 font-bold">&#10003;</span> Diseño de Páginas Web y Posicionamiento en Redes</li>
          </ul>
          <div className="mt-6 text-xs text-slate-500">Valores: Compromiso · Responsabilidad · Honestidad · Respeto · Confidencialidad</div>
        </div>
      </section>

      <section id="servicios" className="py-16" style={{ background: '#F1F5F9' }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Portafolio de Servicios</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              { title: 'Auditorías Integradas', desc: 'Auditorías internas y de segunda parte en ISO 9001, 14001 y 45001.' },
              { title: 'Sistemas Integrados de Gestión', desc: 'Diseño, implementación, mejora y mantenimiento de SIG.' },
              { title: 'Gestión Empresarial', desc: 'Procesos, indicadores, mejora continua, atención al usuario y servicio al cliente.' },
              { title: 'Proyectos', desc: 'Formulación, evaluación y gerencia de proyectos de desarrollo.' },
              { title: 'Mercadeo y Ventas', desc: 'Estrategia comercial, experiencia de cliente, posicionamiento en redes.' },
              { title: 'Web + SEO', desc: 'Diseño de páginas web y optimización para buscadores y redes.' },
            ].map((s) => (
              <div key={s.title} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-lg font-semibold text-slate-900">{s.title}</div>
                <div className="text-sm text-slate-600 mt-2">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="valores" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900">Nuestro Enfoque</h2>
        <p className="mt-4 text-slate-600 leading-relaxed">
          Equipo con formación en Administración de Empresas, Negocios Internacionales e Ingeniería de Sistemas; especialistas en Proyectos de Desarrollo y en Sistemas Integrados de Gestión. Certificados como Auditores Internos ISO 9001, 14001 y 45001.
        </p>
      </section>

      <section id="contacto" className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl p-8 shadow-lg" style={{ background: 'linear-gradient(135deg, #1B2A4A, #2563EB)' }}>
          <div className="text-2xl font-bold text-white">Conversemos de tus objetivos</div>
          <p className="text-blue-100 mt-2">Déjanos tus datos y agenda una consultoría sin costo.</p>
          <div className="mt-6">
            <button onClick={() => setOpen(true)} className="px-5 py-3 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shadow-sm cursor-pointer">Registrarme</button>
          </div>
          <div className="mt-6 text-sm text-blue-200">Correo: audicoempresarial@gmail.com · WhatsApp: +57 316 137 4657</div>
        </div>
      </section>
    </>
  )
}
