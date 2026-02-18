"use client"

import { Button } from "@/components/crm/ui/button"
import { ArrowLeft, Printer } from "lucide-react"
import Link from "next/link"
import type { CrmCertificacion, CrmCliente } from "@/lib/crm/types"

interface Props {
  fase: number
  certificacion: CrmCertificacion
  cliente: CrmCliente | null
}

const FASE_NOMBRES: Record<number, string> = {
  1: 'Diagnóstico y Compromiso',
  2: 'Análisis de Contexto',
  3: 'Documentación del SGC',
  4: 'Implementación y Formación',
  5: 'Auditoría Interna',
  6: 'Certificación',
}

const FASE_DOCUMENTOS: Record<number, string[]> = {
  1: ['Caso de Negocio', 'Compromiso de la Dirección', 'Política de Calidad', 'Cronograma del Proyecto'],
  2: ['Análisis de Contexto (PESTEL)', 'Partes Interesadas', 'Análisis de Riesgos y Oportunidades', 'Mapa de Procesos'],
  3: ['Fichas de Proceso', 'Procedimientos Documentados', 'Formatos y Registros'],
  4: ['Plan de Comunicación', 'Plan de Formación', 'Registros de Capacitación'],
  5: ['Programa de Auditoría', 'Plan de Auditoría', 'Checklist de Auditoría', 'Informe de Hallazgos', 'Informe de Auditoría'],
  6: ['Selección de Organismo Certificador', 'Preparación Final', 'Registro de Certificación'],
}

export default function DocumentoClient({ fase, certificacion: c, cliente: cl }: Props) {
  const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toolbar - hidden on print */}
      <div className="no-print p-4 bg-slate-800/50 border-b flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href={`/crm/certificacion/${c._id}`}>
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="font-bold text-lg">Fase {fase}: {FASE_NOMBRES[fase]}</h1>
            <p className="text-sm text-slate-400">{c.codigo} - {c.clienteNombre}</p>
          </div>
        </div>
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" />Imprimir / PDF
        </Button>
      </div>

      {/* Document Content */}
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-6">
          <h1 className="text-2xl font-bold tracking-wide">AUDICO S.A.S.</h1>
          <p className="text-sm text-slate-400 mt-1">Auditoría, Diagnóstico y Consultoría Organizacional</p>
          <h2 className="text-xl font-semibold mt-4">FASE {fase}: {FASE_NOMBRES[fase]?.toUpperCase()}</h2>
          <p className="text-sm mt-2">Proyecto: {c.codigo} | Normas: {c.normas?.join(', ')}</p>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-2 gap-4 text-sm border p-4 rounded">
          <div><span className="font-semibold">Cliente:</span> {c.clienteNombre}</div>
          <div><span className="font-semibold">NIF:</span> {cl?.nif || '-'}</div>
          <div><span className="font-semibold">Sector:</span> {cl?.sector || '-'}</div>
          <div><span className="font-semibold">Tamaño:</span> {cl?.tamano || '-'} ({cl?.numEmpleados || '-'} empleados)</div>
          <div><span className="font-semibold">Consultor Líder:</span> {c.consultorLider}</div>
          <div><span className="font-semibold">Fecha:</span> {today}</div>
          <div><span className="font-semibold">Fecha Inicio Proyecto:</span> {c.fechaInicio}</div>
          <div><span className="font-semibold">Fecha Objetivo:</span> {c.fechaObjetivo}</div>
        </div>

        {/* Phase-specific content */}
        {fase === 1 && <Fase1Content certificacion={c} cliente={cl} />}
        {fase === 2 && <Fase2Content certificacion={c} cliente={cl} />}
        {fase === 3 && <Fase3Content certificacion={c} />}
        {fase === 4 && <Fase4Content certificacion={c} />}
        {fase === 5 && <Fase5Content certificacion={c} />}
        {fase === 6 && <Fase6Content certificacion={c} cliente={cl} />}

        {/* Documents Checklist */}
        <div className="print-break">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">Documentos de la Fase {fase}</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-700">
                <th className="border p-2 text-left">Documento</th>
                <th className="border p-2 text-center w-24">Estado</th>
                <th className="border p-2 text-center w-32">Fecha</th>
                <th className="border p-2 text-left">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {FASE_DOCUMENTOS[fase]?.map((doc, i) => (
                <tr key={i}>
                  <td className="border p-2">{doc}</td>
                  <td className="border p-2 text-center">☐ Pendiente</td>
                  <td className="border p-2 text-center">___/___/______</td>
                  <td className="border p-2">{c.consultorLider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="mt-16 grid grid-cols-2 gap-16 text-sm">
          <div className="text-center">
            <div className="border-t border-gray-800 pt-2 mt-16">
              <p className="font-semibold">{c.consultorLider}</p>
              <p className="text-slate-400">Consultor AUDICO S.A.S.</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-800 pt-2 mt-16">
              <p className="font-semibold">Representante de la Dirección</p>
              <p className="text-slate-400">{c.clienteNombre}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 border-t pt-4 mt-8">
          <p>AUDICO S.A.S. | NIT 000.000.000-0 | Cali, Colombia</p>
          <p>audicoempresarial@gmail.com | +57 316 137 4657</p>
        </div>
      </div>
    </div>
  )
}

/* ========= Phase-specific content components ========= */

function Fase1Content({ certificacion: c, cliente: cl }: { certificacion: CrmCertificacion; cliente: CrmCliente | null }) {
  return (
    <>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">1. Caso de Negocio</h3>
        <div className="space-y-3 text-sm">
          <p><strong>Objetivo:</strong> Implementar un Sistema de Gestión conforme a {c.normas?.join(', ')} para {c.clienteNombre}.</p>
          <p><strong>Justificación:</strong> La certificación permitirá a la organización demostrar su compromiso con la calidad, acceder a nuevos mercados y mejorar la satisfacción de sus clientes y partes interesadas.</p>
          <p><strong>Alcance:</strong> Todos los procesos de la organización ubicados en {cl?.direccion || '[Dirección]'}, {cl?.ciudad || '[Ciudad]'}.</p>
          <p><strong>Inversión estimada:</strong> {c.valorProyecto ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(c.valorProyecto) : '[Por definir]'}</p>
          <p><strong>Plazo estimado:</strong> Desde {c.fechaInicio} hasta {c.fechaObjetivo}.</p>
        </div>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Compromiso de la Dirección</h3>
        <p className="text-sm">La Alta Dirección de {c.clienteNombre} se compromete a:</p>
        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
          <li>Proveer los recursos necesarios para la implementación del SGC.</li>
          <li>Participar activamente en las revisiones por la dirección.</li>
          <li>Promover la cultura de calidad en toda la organización.</li>
          <li>Garantizar la comunicación interna efectiva del SGC.</li>
          <li>Asegurar la mejora continua del sistema.</li>
        </ul>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">3. Política de Calidad (Borrador)</h3>
        <div className="bg-slate-800/50 border p-4 text-sm italic">
          <p>&ldquo;{c.clienteNombre} se compromete a satisfacer los requisitos de sus clientes y partes interesadas, cumpliendo con los requisitos legales y reglamentarios aplicables, mediante la implementación y mejora continua de un Sistema de Gestión basado en {c.normas?.join(', ')}, orientado a la excelencia operativa y la generación de valor sostenible.&rdquo;</p>
        </div>
        <p className="text-xs text-slate-400 mt-2">* Esta política debe ser revisada y aprobada por la Alta Dirección.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">4. Cronograma del Proyecto</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Fase</th>
              <th className="border p-2 text-left">Actividad</th>
              <th className="border p-2 text-center">Duración Est.</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['1', 'Diagnóstico y Compromiso', '2-3 semanas'],
              ['2', 'Análisis de Contexto', '3-4 semanas'],
              ['3', 'Documentación del SGC', '6-8 semanas'],
              ['4', 'Implementación y Formación', '4-6 semanas'],
              ['5', 'Auditoría Interna', '2-3 semanas'],
              ['6', 'Certificación', '2-4 semanas'],
            ].map(([num, act, dur]) => (
              <tr key={num}>
                <td className="border p-2 font-medium">Fase {num}</td>
                <td className="border p-2">{act}</td>
                <td className="border p-2 text-center">{dur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

function Fase2Content({ certificacion: c, cliente: cl }: { certificacion: CrmCertificacion; cliente: CrmCliente | null }) {
  return (
    <>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">1. Análisis de Contexto (PESTEL)</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Factor</th>
              <th className="border p-2 text-left">Descripción</th>
              <th className="border p-2 text-left">Impacto</th>
            </tr>
          </thead>
          <tbody>
            {['Político', 'Económico', 'Social', 'Tecnológico', 'Ecológico/Ambiental', 'Legal'].map(f => (
              <tr key={f}>
                <td className="border p-2 font-medium">{f}</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Partes Interesadas</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Parte Interesada</th>
              <th className="border p-2 text-left">Necesidades y Expectativas</th>
              <th className="border p-2 text-left">Requisitos Pertinentes</th>
            </tr>
          </thead>
          <tbody>
            {['Clientes', 'Empleados', 'Proveedores', 'Entes reguladores', 'Socios / Accionistas', 'Comunidad'].map(p => (
              <tr key={p}>
                <td className="border p-2 font-medium">{p}</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">3. Análisis de Riesgos y Oportunidades</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Tipo</th>
              <th className="border p-2 text-left">Descripción</th>
              <th className="border p-2 text-center">Probabilidad</th>
              <th className="border p-2 text-center">Impacto</th>
              <th className="border p-2 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map(i => (
              <tr key={i}>
                <td className="border p-2">☐ Riesgo / ☐ Oportunidad</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2 text-center">☐A ☐M ☐B</td>
                <td className="border p-2 text-center">☐A ☐M ☐B</td>
                <td className="border p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">4. Mapa de Procesos</h3>
        <div className="border p-4 text-center text-sm text-slate-400">
          <div className="bg-blue-900/30 border border-blue-700 p-3 mb-2 rounded font-semibold">PROCESOS ESTRATÉGICOS</div>
          <div className="flex gap-2 justify-center my-2">
            <div className="bg-green-50 border border-green-200 p-3 rounded flex-1">PROCESOS MISIONALES / OPERATIVOS</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-3 mt-2 rounded font-semibold">PROCESOS DE APOYO</div>
          <p className="mt-4 text-xs italic">El mapa de procesos debe ser adaptado a la estructura de {c.clienteNombre}.</p>
        </div>
      </section>
    </>
  )
}

function Fase3Content({ certificacion: c }: { certificacion: CrmCertificacion }) {
  return (
    <>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">1. Fichas de Proceso</h3>
        <p className="text-sm mb-3">Cada proceso identificado en el mapa de procesos debe documentarse con la siguiente estructura:</p>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {[
              ['Nombre del Proceso', ''],
              ['Objetivo', ''],
              ['Alcance', ''],
              ['Responsable (Dueño)', ''],
              ['Entradas', ''],
              ['Salidas', ''],
              ['Recursos', ''],
              ['Indicadores (KPIs)', ''],
              ['Riesgos Asociados', ''],
              ['Documentos Relacionados', ''],
              ['Norma(s) Aplicable(s)', c.normas?.join(', ') || ''],
            ].map(([label, value]) => (
              <tr key={label}>
                <td className="border p-2 font-medium bg-slate-800/50 w-1/3">{label}</td>
                <td className="border p-2">{value || <span className="text-slate-500">[Completar]</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Lista de Procedimientos Documentados</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Código</th>
              <th className="border p-2 text-left">Procedimiento</th>
              <th className="border p-2 text-center">Versión</th>
              <th className="border p-2 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {['Control de Documentos', 'Control de Registros', 'Auditoría Interna', 'Acciones Correctivas', 'Revisión por la Dirección'].map((p, i) => (
              <tr key={p}>
                <td className="border p-2">PRO-{String(i + 1).padStart(3, '0')}</td>
                <td className="border p-2">{p}</td>
                <td className="border p-2 text-center">1.0</td>
                <td className="border p-2 text-center">☐ Borrador</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">3. Control de Formatos y Registros</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Código</th>
              <th className="border p-2 text-left">Formato</th>
              <th className="border p-2 text-left">Proceso</th>
              <th className="border p-2 text-center">Retención</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i}>
                <td className="border p-2">FOR-{String(i).padStart(3, '0')}</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2 text-center">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

function Fase4Content({ certificacion: c }: { certificacion: CrmCertificacion }) {
  return (
    <>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">1. Plan de Comunicación</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Qué Comunicar</th>
              <th className="border p-2 text-left">A Quién</th>
              <th className="border p-2 text-left">Cuándo</th>
              <th className="border p-2 text-left">Medio</th>
              <th className="border p-2 text-left">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Política de calidad', 'Todo el personal', 'Al inicio', 'Reunión / Cartelera', ''],
              ['Objetivos de calidad', 'Líderes de proceso', 'Mensual', 'Reunión', ''],
              ['Resultados de auditorías', 'Alta dirección', 'Post-auditoría', 'Informe', ''],
              ['Cambios en el SGC', 'Personal involucrado', 'Cuando aplique', 'Email / Reunión', ''],
            ].map(([que, quien, cuando, medio, resp], i) => (
              <tr key={i}>
                <td className="border p-2">{que}</td>
                <td className="border p-2">{quien}</td>
                <td className="border p-2">{cuando}</td>
                <td className="border p-2">{medio}</td>
                <td className="border p-2">{resp || c.consultorLider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Plan de Formación</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Tema</th>
              <th className="border p-2 text-left">Dirigido a</th>
              <th className="border p-2 text-center">Duración</th>
              <th className="border p-2 text-center">Fecha</th>
              <th className="border p-2 text-left">Instructor</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Sensibilización al SGC', 'Todo el personal', '4h', '', ''],
              [`Interpretación ${c.normas?.[0] || 'norma'}`, 'Líderes de proceso', '8h', '', ''],
              ['Gestión de riesgos', 'Equipo de calidad', '4h', '', ''],
              ['Auditor interno', 'Auditores designados', '16h', '', ''],
              ['Documentación del SGC', 'Personal clave', '4h', '', ''],
            ].map(([tema, dirigido, dur, fecha, inst], i) => (
              <tr key={i}>
                <td className="border p-2">{tema}</td>
                <td className="border p-2">{dirigido}</td>
                <td className="border p-2 text-center">{dur}</td>
                <td className="border p-2 text-center">{fecha || '___/___/___'}</td>
                <td className="border p-2">{inst || c.consultorLider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">3. Registro de Capacitación</h3>
        <div className="grid grid-cols-2 gap-4 text-sm border p-4 rounded mb-4">
          <div><strong>Tema:</strong> _________________________________</div>
          <div><strong>Fecha:</strong> ___/___/______</div>
          <div><strong>Instructor:</strong> ____________________________</div>
          <div><strong>Duración:</strong> _______ horas</div>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-center">N°</th>
              <th className="border p-2 text-left">Nombre</th>
              <th className="border p-2 text-left">Cargo</th>
              <th className="border p-2 text-center">Firma</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, i) => (
              <tr key={i}>
                <td className="border p-2 text-center">{i + 1}</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

function Fase5Content({ certificacion: c }: { certificacion: CrmCertificacion }) {
  return (
    <>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">1. Programa de Auditoría</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Proceso / Área</th>
              <th className="border p-2 text-left">Cláusulas</th>
              <th className="border p-2 text-center">Fecha</th>
              <th className="border p-2 text-left">Auditor</th>
            </tr>
          </thead>
          <tbody>
            {['Alta Dirección', 'Gestión Comercial', 'Operaciones', 'Compras', 'Talento Humano', 'Gestión de Calidad'].map(p => (
              <tr key={p}>
                <td className="border p-2">{p}</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2 text-center">___/___/___</td>
                <td className="border p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Plan de Auditoría</h3>
        <div className="grid grid-cols-2 gap-4 text-sm border p-4 rounded mb-4">
          <div><strong>Norma(s):</strong> {c.normas?.join(', ')}</div>
          <div><strong>Tipo:</strong> Auditoría Interna</div>
          <div><strong>Auditor Líder:</strong> ____________________________</div>
          <div><strong>Fecha:</strong> ___/___/______ al ___/___/______</div>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-center">Hora</th>
              <th className="border p-2 text-left">Actividad</th>
              <th className="border p-2 text-left">Auditado</th>
              <th className="border p-2 text-left">Auditor</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['08:00', 'Reunión de apertura', 'Alta Dirección', ''],
              ['08:30', 'Revisión de documentación', 'Calidad', ''],
              ['10:00', 'Auditoría de procesos operativos', 'Operaciones', ''],
              ['12:00', 'Receso', '-', '-'],
              ['13:00', 'Auditoría procesos de apoyo', 'RRHH / Compras', ''],
              ['15:00', 'Preparación de informe', '-', ''],
              ['16:00', 'Reunión de cierre', 'Alta Dirección', ''],
            ].map(([hora, act, auditado, auditor], i) => (
              <tr key={i}>
                <td className="border p-2 text-center">{hora}</td>
                <td className="border p-2">{act}</td>
                <td className="border p-2">{auditado}</td>
                <td className="border p-2">{auditor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">3. Checklist de Auditoría</h3>
        <p className="text-sm mb-2">Norma: {c.normas?.[0] || '[Norma]'}</p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Cláusula</th>
              <th className="border p-2 text-left">Pregunta / Requisito</th>
              <th className="border p-2 text-center">C/NC/NA</th>
              <th className="border p-2 text-left">Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['4.1', 'Se ha determinado el contexto de la organización?', '', ''],
              ['4.2', 'Se han identificado las partes interesadas?', '', ''],
              ['5.1', 'La Alta Dirección demuestra liderazgo y compromiso?', '', ''],
              ['5.2', 'Existe una política de calidad documentada?', '', ''],
              ['6.1', 'Se han abordado riesgos y oportunidades?', '', ''],
              ['7.1', 'Se han determinado los recursos necesarios?', '', ''],
              ['8.1', 'Se planifican y controlan los procesos operacionales?', '', ''],
              ['9.1', 'Se realiza seguimiento, medición y análisis?', '', ''],
              ['10.1', 'Se implementan acciones de mejora?', '', ''],
            ].map(([cl, preg, result, ev], i) => (
              <tr key={i}>
                <td className="border p-2 font-medium">{cl}</td>
                <td className="border p-2">{preg}</td>
                <td className="border p-2 text-center">{result || '☐C ☐NC ☐NA'}</td>
                <td className="border p-2">{ev}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">4. Registro de Hallazgos</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-center">N°</th>
              <th className="border p-2 text-left">Tipo</th>
              <th className="border p-2 text-left">Cláusula</th>
              <th className="border p-2 text-left">Descripción</th>
              <th className="border p-2 text-left">Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i}>
                <td className="border p-2 text-center">{i}</td>
                <td className="border p-2">☐NCM ☐NCm ☐Obs ☐OM</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}

function Fase6Content({ certificacion: c, cliente: cl }: { certificacion: CrmCertificacion; cliente: CrmCliente | null }) {
  return (
    <>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">1. Selección de Organismo Certificador</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Criterio</th>
              <th className="border p-2 text-center">Organismo A</th>
              <th className="border p-2 text-center">Organismo B</th>
              <th className="border p-2 text-center">Organismo C</th>
            </tr>
          </thead>
          <tbody>
            {[
              'Acreditación reconocida',
              'Experiencia en el sector',
              'Costo de certificación',
              'Disponibilidad de fechas',
              'Reputación y referencias',
              'Valor agregado',
            ].map(criterio => (
              <tr key={criterio}>
                <td className="border p-2 font-medium">{criterio}</td>
                <td className="border p-2 text-center">&nbsp;</td>
                <td className="border p-2 text-center">&nbsp;</td>
                <td className="border p-2 text-center">&nbsp;</td>
              </tr>
            ))}
            <tr className="bg-slate-800/50 font-semibold">
              <td className="border p-2">TOTAL</td>
              <td className="border p-2 text-center">&nbsp;</td>
              <td className="border p-2 text-center">&nbsp;</td>
              <td className="border p-2 text-center">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">2. Preparación Final</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-700">
              <th className="border p-2 text-left">Actividad</th>
              <th className="border p-2 text-center">Estado</th>
              <th className="border p-2 text-left">Responsable</th>
              <th className="border p-2 text-left">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {[
              'Revisión final de documentación',
              'Cierre de no conformidades de auditoría interna',
              'Revisión por la dirección actualizada',
              'Simulacro de auditoría externa',
              'Verificación de registros completos',
              'Preparación logística para auditoría',
              'Comunicación al personal',
            ].map(act => (
              <tr key={act}>
                <td className="border p-2">{act}</td>
                <td className="border p-2 text-center">☐</td>
                <td className="border p-2">&nbsp;</td>
                <td className="border p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3 className="text-lg font-bold border-b pb-2 mb-4">3. Registro de Certificación</h3>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {[
              ['Organización', c.clienteNombre],
              ['NIF', cl?.nif || ''],
              ['Norma(s)', c.normas?.join(', ') || ''],
              ['Organismo Certificador', ''],
              ['N° de Certificado', ''],
              ['Fecha de Emisión', '___/___/______'],
              ['Fecha de Vencimiento', '___/___/______'],
              ['Alcance de la Certificación', ''],
              ['Auditor Líder (OC)', ''],
            ].map(([label, value]) => (
              <tr key={label}>
                <td className="border p-2 font-medium bg-slate-800/50 w-1/3">{label}</td>
                <td className="border p-2">{value || <span className="text-slate-500">[Completar]</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}
