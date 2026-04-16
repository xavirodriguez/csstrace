/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Download, 
  Chrome, 
  Code2, 
  Layers, 
  CheckCircle2, 
  Layout, 
  History, 
  Box, 
  Waves,
  Settings,
  ExternalLink
} from "lucide-react";
import type { ReactNode } from "react";

export default function App() {
  return (
    <div className="flex min-h-screen bg-bg font-sans text-text-main">
      {/* Sidebar */}
      <aside className="w-[260px] bg-sidebar-bg text-slate-300 p-6 flex flex-col gap-8 hidden lg:flex">
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          <div className="w-6 h-6 bg-accent rounded-sm" />
          <span>CSS Trace v1.2</span>
        </div>
        
        <nav className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-wider opacity-50 font-semibold">Extractores</span>
            <NavItem icon={<Layout size={18} />} label="Inspector de Elementos" active />
            <NavItem icon={<ExternalLink size={18} />} label="Selector de Páginas" />
            <NavItem icon={<History size={18} />} label="Historial de Exportación" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-wider opacity-50 font-semibold">Frameworks</span>
            <NavItem 
              icon={<Box size={18} />} 
              label="Bootstrap" 
              badge={<span className="bg-bootstrap text-white text-[10px] px-1.5 py-0.5 rounded ml-auto">v5.3</span>} 
            />
            <NavItem 
              icon={<Waves size={18} />} 
              label="Tailwind" 
              badge={<span className="bg-tailwind text-white text-[10px] px-1.5 py-0.5 rounded ml-auto">v3.4</span>} 
            />
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700/50">
          <NavItem icon={<Settings size={18} />} label="Configuración" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto">
        <header className="flex justify-between items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-semibold mb-1">Análisis de Trazabilidad</h1>
            <p className="text-text-muted text-sm flex items-center gap-2">
              Elemento detectado: <code className="bg-slate-200/50 px-1.5 py-0.5 rounded text-xs">button.btn-primary.mt-4.flex</code>
            </p>
            <div className="flex gap-2 mt-3">
              <span className="bg-[#f5f3ff] text-bootstrap border border-[#ddd6fe] px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase">Bootstrap Detected</span>
              <span className="bg-[#ecfeff] text-tailwind border border-[#a5f3fc] px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase">Tailwind Detected</span>
            </div>
          </motion.div>
          <button className="bg-accent hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Configurar Reglas
          </button>
        </header>

        {/* Inspector Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
          {/* HTML Card */}
          <div className="bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-border flex justify-between items-center">
              <span className="text-sm font-semibold">HTML Estructurado (Fragmento)</span>
              <span className="text-xs text-text-muted opacity-60">index.html</span>
            </div>
            <div className="flex-1 p-4 bg-code-bg text-slate-300 font-mono text-xs leading-relaxed overflow-auto">
              <div className="text-slate-500 mb-1">&lt;!-- Origen: Híbrido --&gt;</div>
              <div>
                <span className="text-pink-400">&lt;div</span>{" "}
                <span className="text-sky-400">data-origin-bootstrap=</span><span className="text-amber-300">"card"</span>{" "}
                <span className="text-sky-400">data-origin-tailwind=</span><span className="text-amber-300">"p-6 shadow-lg"</span>{" "}
                <span className="text-sky-400">style=</span><span className="text-amber-300">"display: flex; padding: 24px;"</span><span className="text-pink-400">&gt;</span>
              </div>
              <div className="pl-4">
                <span className="text-pink-400">&lt;button</span><br />
                <span className="pl-4 text-sky-400">class=</span><span className="text-amber-300">"btn btn-primary mt-4 flex items-center"</span><br />
                <span className="pl-4 text-sky-400">data-trace-bootstrap=</span><span className="text-amber-300">"btn, btn-primary"</span><br />
                <span className="pl-4 text-sky-400">data-trace-tailwind=</span><span className="text-amber-300">"mt-4, flex, items-center"</span><br />
                <span className="pl-4 text-sky-400">style=</span><span className="text-amber-300">"background-color: #0d6efd; margin-top: 1rem;"</span><span className="text-pink-400">&gt;</span>
              </div>
              <div className="pl-8 text-white">Exportar</div>
              <div className="pl-4 text-pink-400">&lt;/button&gt;</div>
              <div className="text-pink-400">&lt;/div&gt;</div>
            </div>
          </div>

          {/* CSS Card */}
          <div className="bg-surface border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-border flex justify-between items-center">
              <span className="text-sm font-semibold">CSS Agrupado por Framework</span>
              <span className="text-xs text-text-muted opacity-60">styles.css</span>
            </div>
            <div className="flex-1 p-4 bg-code-bg text-slate-300 font-mono text-xs leading-relaxed overflow-auto">
              <div className="text-slate-500 mb-2">/* ===== BOOTSTRAP RULES ===== */</div>
              <div className="mb-4">
                <span className="text-pink-400">.btn-primary</span> {"{"} <br />
                &nbsp;&nbsp;color: <span className="text-amber-300">#fff</span>; <br />
                &nbsp;&nbsp;background-color: <span className="text-amber-300">#0d6efd</span>; <br />
                {"}"}
              </div>
              <div className="text-slate-500 mb-2">/* ===== TAILWIND RULES ===== */</div>
              <div className="space-y-2">
                <div>
                  <span className="text-pink-400">.mt-4</span> {"{"} <br />
                  &nbsp;&nbsp;margin-top: <span className="text-amber-300">1rem</span>; <br />
                  {"}"}
                </div>
                <div>
                  <span className="text-pink-400">.flex</span> {"{"} <br />
                  &nbsp;&nbsp;display: <span className="text-amber-300">flex</span>; <br />
                  {"}"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extension Instructions (Preserved Content) */}
        <section className="bg-white p-8 rounded-xl border border-border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Download className="w-5 h-5 text-accent" />
            Guía de Instalación de la Extensión
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                { step: "1", title: "Descarga los archivos", desc: "Copia manifest.json, content.js, background.js, popup.html/js a una carpeta local." },
                { step: "2", title: "Abre Extensiones", desc: "Ve a chrome://extensions y activa el 'Modo de desarrollador'." },
                { step: "3", title: "Cargar descomprimida", desc: "Selecciona la carpeta donde guardaste los archivos." },
                { step: "4", title: "¡Listo para usar!", desc: "Fija la extensión y empieza a extraer componentes de cualquier web." }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-text-main">{item.title}</h3>
                    <p className="text-text-muted text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <FeatureItem icon={<Layers size={18} className="text-purple-500" />} title="Clasificación" desc="Detecta Bootstrap o Tailwind automáticamente." />
              <FeatureItem icon={<Code2 size={18} className="text-emerald-500" />} title="Trazabilidad" desc="Añade atributos data-origin-* a cada nodo." />
              <FeatureItem icon={<CheckCircle2 size={18} className="text-blue-500" />} title="Fidelidad" desc="Estilos inline para asegurar el renderizado." />
            </div>
          </div>
        </section>

        <footer className="flex justify-end gap-3 pt-4 border-t border-border">
          <button className="bg-white border border-border text-text-main px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Copiar Solo CSS
          </button>
          <button className="bg-white border border-border text-text-main px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
            Vista Previa Render
          </button>
          <button className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Copiar HTML Completo (Bundle)
          </button>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge }: { icon: ReactNode, label: string, active?: boolean, badge?: ReactNode }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${active ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}>
      {icon}
      <span>{label}</span>
      {badge}
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-sm text-text-main">{title}</h3>
        <p className="text-text-muted text-[11px] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
