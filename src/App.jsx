import { useState, useMemo, useCallback } from "react";

// ─── DATA SEED ──────────────────────────────────────────────────────
const INIT_PROPS = [
  { id:1, name:'Apto 301 - Ed. Mirador',    address:'Calle 50 #30-20, Medellín',   rent:1800000, tenant:'Carlos Rodríguez', phone:'310-111-2222', status:'active',  due:1,  paid:true,  deposit:3600000, start:'2024-03-01', end:'2025-03-01', area:'65m²',  rooms:2 },
  { id:2, name:'Casa 45 - Laureles',         address:'Carrera 76 #45-10, Medellín', rent:2500000, tenant:'Ana García',       phone:'310-333-4444', status:'active',  due:5,  paid:false, deposit:5000000, start:'2023-08-01', end:'2025-08-01', area:'120m²', rooms:3 },
  { id:3, name:'Local 12 - CC Punto',        address:'Av. El Poblado #10-50',       rent:4200000, tenant:'Tienda Moda XYZ',  phone:'310-555-6666', status:'overdue', due:1,  paid:false, deposit:8400000, start:'2023-01-01', end:'2026-01-01', area:'45m²',  rooms:0 },
  { id:4, name:'Apto 502 - Torres Norte',    address:'Calle 80 #20-15, Medellín',   rent:1600000, tenant:'María Torres',     phone:'310-777-8888', status:'active',  due:10, paid:true,  deposit:3200000, start:'2024-07-01', end:'2025-07-01', area:'55m²',  rooms:2 },
  { id:5, name:'Bodega Industrial - Itagüí', address:'Zona Industrial, Itagüí',     rent:5800000, tenant:'',                  phone:'',             status:'vacant',  due:0,  paid:false, deposit:0,       start:'',           end:'',           area:'300m²', rooms:0 },
  { id:6, name:'Casa Campestre - Rionegro',  address:'Vereda El Tablazo, Rionegro', rent:3200000, tenant:'Pedro Vargas',     phone:'310-999-0000', status:'active',  due:15, paid:true,  deposit:6400000, start:'2024-01-01', end:'2026-01-01', area:'200m²', rooms:4 },
];

const INIT_PAYMENTS = [
  { id:1, prop:'Apto 301 - Ed. Mirador',    tenant:'Carlos Rodríguez', amount:1800000, date:'2025-05-01', method:'Transferencia', status:'paid' },
  { id:2, prop:'Apto 502 - Torres Norte',   tenant:'María Torres',     amount:1600000, date:'2025-05-01', method:'PSE',           status:'paid' },
  { id:3, prop:'Casa Campestre - Rionegro', tenant:'Pedro Vargas',     amount:3200000, date:'2025-04-30', method:'Transferencia', status:'paid' },
  { id:4, prop:'Casa 45 - Laureles',        tenant:'Ana García',       amount:2500000, date:'2025-05-05', method:'Pendiente',     status:'pending' },
  { id:5, prop:'Local 12 - CC Punto',       tenant:'Tienda Moda XYZ',  amount:4200000, date:'2025-04-01', method:'—',             status:'overdue' },
];

const INIT_MAINT = [
  { id:1, prop:'Casa 45 - Laureles',       issue:'Goteras en el techo',         priority:'high',   status:'open',     date:'2025-04-28', tech:'' },
  { id:2, prop:'Local 12 - CC Punto',      issue:'Puerta eléctrica dañada',     priority:'high',   status:'progress', date:'2025-04-25', tech:'Eléctricos Norte' },
  { id:3, prop:'Apto 301 - Ed. Mirador',   issue:'Cambio de grifo cocina',      priority:'low',    status:'done',     date:'2025-04-20', tech:'Plomería Rápida' },
  { id:4, prop:'Apto 502 - Torres Norte',  issue:'Pintura habitación principal', priority:'medium', status:'open',     date:'2025-04-29', tech:'' },
];

const MONTHLY_INCOME = [
  { mes:'Oct', total:11400000 }, { mes:'Nov', total:12800000 }, { mes:'Dic', total:13100000 },
  { mes:'Ene', total:11800000 }, { mes:'Feb', total:12600000 }, { mes:'Mar', total:13400000 },
  { mes:'Abr', total:13900000 }, { mes:'May', total:14900000 },
];

const themes = {
  dark:  { bg:'#0c1221', bg2:'#111827', bg3:'#1a2438', accent:'#38bdf8', accent2:'#818cf8', accent3:'#34d399', orange:'#fb923c', red:'#f87171', text:'#e2e8f0', text2:'#94a3b8', text3:'#475569', border:'#1e293b', border2:'#2d3f5e' },
  light: { bg:'#f8fafc', bg2:'#ffffff', bg3:'#f1f5f9', accent:'#0284c7', accent2:'#6366f1', accent3:'#059669', orange:'#ea580c', red:'#dc2626', text:'#0f172a', text2:'#475569', text3:'#94a3b8', border:'#e2e8f0', border2:'#cbd5e1' },
};

const statusInfo = {
  active:  { l:'Arrendado',  bg:'rgba(52,211,153,.12)',  c:'#34d399', dot:'#34d399' },
  overdue: { l:'Mora',       bg:'rgba(248,113,113,.12)', c:'#f87171', dot:'#f87171' },
  vacant:  { l:'Disponible', bg:'rgba(56,189,248,.12)',  c:'#38bdf8', dot:'#38bdf8' },
};

const payStatus = {
  paid:    { l:'Pagado',    bg:'rgba(52,211,153,.12)',  c:'#34d399' },
  pending: { l:'Pendiente', bg:'rgba(251,191,36,.12)',  c:'#fbbf24' },
  overdue: { l:'En mora',   bg:'rgba(248,113,113,.12)', c:'#f87171' },
};

const maintPriority = { high:'#f87171', medium:'#fb923c', low:'#94a3b8' };
const maintStatus = {
  open:     { l:'Abierto',    bg:'rgba(248,113,113,.12)', c:'#f87171' },
  progress: { l:'En proceso', bg:'rgba(251,191,36,.12)',  c:'#fbbf24' },
  done:     { l:'Resuelto',   bg:'rgba(52,211,153,.12)',  c:'#34d399' },
};

const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');

// ─── COMPONENTES TOP-LEVEL ──────────────────────────────────────────

function Modal({ title, onSave, onClose, children, C }) {
  return (
    <div
      style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.8)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'48px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{background:C.bg2, border:`1px solid ${C.border2}`, borderRadius:16, padding:28, width:'100%', maxWidth:520, boxShadow:'0 30px 80px rgba(0,0,0,.6)'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22}}>
          <div style={{fontSize:16, fontWeight:700, color:C.text}}>{title}</div>
          <button onClick={onClose} aria-label="Cerrar" style={{background:'transparent', border:'none', color:C.text2, fontSize:22, cursor:'pointer'}}>×</button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:20}}>
          <button onClick={onClose} style={{background:'transparent', border:`1px solid ${C.border2}`, color:C.text2, borderRadius:8, padding:'9px 18px', fontSize:13, cursor:'pointer', fontFamily:'inherit'}}>Cancelar</button>
          <button onClick={onSave} style={{background:C.accent, color:'#000', border:'none', borderRadius:8, padding:'9px 20px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, C, span }) {
  return (
    <div style={{marginBottom:14, ...(span ? {gridColumn:'1/-1'} : null)}}>
      <label style={{fontSize:10, color:C.text3, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'.5px', fontWeight:600}}>{label}</label>
      {children}
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]               = useState('dark');
  const [page, setPage]                 = useState('dashboard');
  const [modal, setModal]               = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState({});
  const [props, setProps]               = useState(INIT_PROPS);
  const [payments, setPayments]         = useState(INIT_PAYMENTS);
  const [maint, setMaint]               = useState(INIT_MAINT);
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [toast, setToast]               = useState(null);
  const [confirm, setConfirm]           = useState(null);

  const C = themes[theme];

  const showToast = useCallback((msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const closeModal = useCallback(() => { setModal(null); setEditTarget(null); setForm({}); }, []);
  const nextId = arr => (arr.length ? Math.max(...arr.map(x => x.id)) : 0) + 1;

  const validate = (fields) => {
    for (const [k, v] of fields) {
      if (!v && v !== 0) { showToast(`"${k}" es requerido`, 'error'); return false; }
    }
    return true;
  };

  const activeProps   = useMemo(() => props.filter(p => p.status === 'active').length,   [props]);
  const overdueProps  = useMemo(() => props.filter(p => p.status === 'overdue').length,  [props]);
  const vacantProps   = useMemo(() => props.filter(p => p.status === 'vacant').length,   [props]);
  const monthlyTotal  = useMemo(() => props.filter(p => p.status !== 'vacant').reduce((s, p) => s + p.rent, 0), [props]);
  const pendingAmount = useMemo(() => payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0), [payments]);

  const filteredProps = useMemo(() => props.filter(p => {
    const q = search.toLowerCase();
    const matchQ = p.name.toLowerCase().includes(q) || p.tenant.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || p.status === filterStatus;
    return matchQ && matchS;
  }), [props, search, filterStatus]);

  const saveProperty = () => {
    if (!validate([['Nombre', form.name], ['Arriendo', form.rent]])) return;
    const p = { ...form, rent: +form.rent || 0 };
    if (!editTarget) {
      const newProp = { ...p, id: nextId(props), status: form.tenant ? 'active' : 'vacant', paid:false, deposit:(+form.rent || 0) * 2 };
      setProps(pp => [...pp, newProp]);
      showToast('Propiedad agregada');
    } else {
      setProps(pp => pp.map(x => x.id === editTarget.id ? { ...x, ...p } : x));
      showToast('Propiedad actualizada');
    }
    closeModal();
  };

  const delProperty = id => setConfirm({
    msg: '¿Eliminar esta propiedad?',
    onYes: () => { setProps(pp => pp.filter(x => x.id !== id)); showToast('Propiedad eliminada'); setConfirm(null); }
  });

  const markPaid = id => {
    setPayments(pp => pp.map(p => p.id === id ? { ...p, status:'paid', method:'Transferencia', date: new Date().toISOString().split('T')[0] } : p));
    showToast('Pago marcado como pagado');
  };

  const savePayment = () => {
    if (!validate([['Propiedad', form.prop], ['Monto', form.amount]])) return;
    const prop = props.find(p => p.name === form.prop);
    setPayments(pp => [...pp, {
      id: nextId(pp),
      prop: form.prop,
      tenant: prop?.tenant || form.tenant || '',
      amount: +form.amount || 0,
      date: form.date || new Date().toISOString().split('T')[0],
      method: form.method || 'Transferencia',
      status: 'paid',
    }]);
    showToast('Pago registrado correctamente');
    closeModal();
  };

  const closeMaint = id => {
    setMaint(mm => mm.map(m => m.id === id ? { ...m, status:'done' } : m));
    showToast('Mantenimiento resuelto');
  };

  const saveMaintenance = () => {
    if (!validate([['Propiedad', form.prop], ['Descripción', form.issue]])) return;
    setMaint(mm => [...mm, {
      id: nextId(mm),
      prop: form.prop,
      issue: form.issue,
      priority: form.priority || 'medium',
      status: 'open',
      date: new Date().toISOString().split('T')[0],
      tech: '',
    }]);
    showToast('Reporte creado');
    closeModal();
  };

  const exportCSV = (data, name) => {
    if (!data.length) { showToast('No hay datos', 'error'); return; }
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${name}.csv descargado`);
  };

  const nav = [
    { id:'dashboard',   icon:'⊞', label:'Dashboard' },
    { id:'properties',  icon:'🏠', label:'Propiedades' },
    { id:'payments',    icon:'💰', label:'Pagos' },
    { id:'maintenance', icon:'🔧', label:'Mantenimiento' },
    { id:'reports',     icon:'📊', label:'Reportes' },
  ];

  const inputBase = {
    width:'100%',
    background:C.bg3,
    border:`1px solid ${C.border2}`,
    borderRadius:8,
    padding:'10px 14px',
    fontSize:13,
    color:C.text,
    outline:'none',
    fontFamily:'inherit',
    boxSizing:'border-box',
  };

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => {
    const kpis = [
      { l:'Propiedades',      v:props.length,       s:`${activeProps} arrendadas`,                                               c:C.accent,  icon:'🏠' },
      { l:'Ingresos/mes',     v:fmt(monthlyTotal),  s:`${activeProps + overdueProps} contratos`,                                  c:C.accent3, icon:'💰' },
      { l:'Pagos pendientes', v:fmt(pendingAmount), s:`${payments.filter(p => p.status !== 'paid').length} propiedades`,          c:C.orange,  icon:'⏳' },
      { l:'Disponibles',      v:vacantProps,        s:'Para arrendar',                                                            c:C.accent2, icon:'🔑' },
    ];
    const portfolio = [
      { l:'Arrendadas',  n:activeProps,  c:C.accent3, pct: Math.round((activeProps  / props.length) * 100) },
      { l:'En mora',     n:overdueProps, c:C.red,     pct: Math.round((overdueProps / props.length) * 100) },
      { l:'Disponibles', n:vacantProps,  c:C.accent,  pct: Math.round((vacantProps  / props.length) * 100) },
    ];
    return (
      <div className="fade-in">
        <div style={{fontSize:22, fontWeight:700, marginBottom:4}}>Dashboard</div>
        <div style={{fontSize:13, color:C.text2, marginBottom:24}}>RentTrack · Portafolio de propiedades · Mayo 2025</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginBottom:22}}>
          {kpis.map(k => (
            <div key={k.l}
              style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:20, transition:'transform .2s'}}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10}}>
                <div style={{fontSize:11, color:C.text2, textTransform:'uppercase', letterSpacing:'.5px'}}>{k.l}</div>
                <span style={{fontSize:20}}>{k.icon}</span>
              </div>
              <div style={{fontSize:22, fontWeight:700, color:k.c, fontFamily:'monospace', marginBottom:4}}>{k.v}</div>
              <div style={{fontSize:12, color:C.text3}}>{k.s}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.6fr) minmax(0,1fr)', gap:14, marginBottom:14}}>
          <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:22}}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:16}}>Ingresos mensuales</div>
            <div style={{display:'flex', gap:6, alignItems:'flex-end', height:130, marginBottom:10}}>
              {MONTHLY_INCOME.map((m, i) => {
                const max    = Math.max(...MONTHLY_INCOME.map(x => x.total));
                const pct    = m.total / max * 100;
                const isLast = i === MONTHLY_INCOME.length - 1;
                return (
                  <div key={m.mes} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
                    <div style={{width:'100%', height:`${pct}%`, background: isLast ? C.accent : `${C.accent}35`, borderRadius:'4px 4px 0 0', minHeight:4, transition:'height .5s'}} />
                    <div style={{fontSize:9, color: isLast ? C.accent : C.text3}}>{m.mes}</div>
                  </div>
                );
              })}
            </div>
            <div style={{display:'flex', gap:24}}>
              <div><div style={{fontSize:11, color:C.text2}}>Este mes</div><div style={{fontWeight:700, color:C.accent, fontFamily:'monospace'}}>{fmt(14900000)}</div></div>
              <div><div style={{fontSize:11, color:C.text2}}>Proyectado año</div><div style={{fontWeight:700, fontFamily:'monospace', color:C.text}}>{fmt(178800000)}</div></div>
            </div>
          </div>
          <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:22}}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Estado del portafolio</div>
            {portfolio.map(s => (
              <div key={s.l} style={{marginBottom:14}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:5}}>
                  <span style={{fontSize:13, color:C.text}}>{s.l}</span>
                  <span style={{fontSize:13, fontWeight:700, color:s.c}}>{s.n} ({s.pct}%)</span>
                </div>
                <div style={{height:6, background:C.bg3, borderRadius:3}}>
                  <div style={{width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:3, transition:'width .5s'}} />
                </div>
              </div>
            ))}
            <div style={{marginTop:16, background:C.bg3, borderRadius:10, padding:14}}>
              <div style={{fontSize:11, color:C.text2, marginBottom:4}}>Ocupación total</div>
              <div style={{fontSize:24, fontWeight:700, color:C.accent3, fontFamily:'monospace'}}>
                {Math.round(((activeProps + overdueProps) / props.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
          <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:22}}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Pagos recientes</div>
            {payments.slice(0, 4).map(p => (
              <div key={p.id} style={{display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:36, height:36, borderRadius:10, background:`${p.status === 'paid' ? C.accent3 : C.orange}14`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0}}>
                  {p.status === 'paid' ? '✓' : '⏳'}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:500}}>{p.tenant}</div>
                  <div style={{fontSize:11, color:C.text2}}>{p.date}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'monospace', fontWeight:700, color: p.status === 'paid' ? C.accent3 : C.orange, fontSize:13}}>{fmt(p.amount)}</div>
                  <span style={{fontSize:10, color:payStatus[p.status].c}}>{payStatus[p.status].l}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:22}}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:14}}>Mantenimientos activos</div>
            {maint.filter(m => m.status !== 'done').map(m => (
              <div key={m.id} style={{display:'flex', gap:12, alignItems:'flex-start', padding:'10px 0', borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:8, height:8, borderRadius:50, background:maintPriority[m.priority], marginTop:5, flexShrink:0}} />
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:500}}>{m.issue}</div>
                  <div style={{fontSize:11, color:C.text2}}>{m.prop}</div>
                </div>
                <span style={{fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:10, background:maintStatus[m.status].bg, color:maintStatus[m.status].c, flexShrink:0, whiteSpace:'nowrap'}}>{maintStatus[m.status].l}</span>
              </div>
            ))}
            {maint.filter(m => m.status !== 'done').length === 0 && (
              <div style={{fontSize:12, color:C.text2, textAlign:'center', padding:14}}>✓ Sin mantenimientos pendientes</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProperties = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Propiedades</div>
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => exportCSV(filteredProps, 'propiedades')} style={{background:'transparent', border:`1px solid ${C.border2}`, color:C.text2, borderRadius:8, padding:'10px 16px', fontSize:13, cursor:'pointer', fontFamily:'inherit'}}>📥 Exportar</button>
          <button onClick={() => { setModal('prop'); setEditTarget(null); setForm({}); }} style={{background:C.accent, color:'#000', border:'none', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>+ Agregar propiedad</button>
        </div>
      </div>
      <div style={{fontSize:13, color:C.text2, marginBottom:18}}>{filteredProps.length} de {props.length} propiedades</div>
      <div style={{display:'flex', gap:10, marginBottom:16, flexWrap:'wrap'}}>
        <input
          style={{...inputBase, width:260}}
          placeholder="🔍 Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {['all','active','overdue','vacant'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{background: filterStatus === s ? C.accent : 'transparent', color: filterStatus === s ? '#000' : C.text2, border:`1px solid ${filterStatus === s ? C.accent : C.border2}`, borderRadius:100, padding:'8px 16px', fontSize:12, cursor:'pointer', fontFamily:'inherit', fontWeight: filterStatus === s ? 600 : 400}}
          >
            {s === 'all' ? 'Todas' : s === 'active' ? 'Arrendadas' : s === 'overdue' ? 'En mora' : 'Disponibles'}
          </button>
        ))}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:12}}>
        {filteredProps.map(p => (
          <div key={p.id} style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden', transition:'transform .2s'}}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{height:8, background:statusInfo[p.status].dot}} />
            <div style={{padding:20}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, gap:8}}>
                <div style={{fontSize:14, fontWeight:700, flex:1, minWidth:0}}>{p.name}</div>
                <span style={{fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:10, background:statusInfo[p.status].bg, color:statusInfo[p.status].c, flexShrink:0, whiteSpace:'nowrap'}}>{statusInfo[p.status].l}</span>
              </div>
              <div style={{fontSize:12, color:C.text2, marginBottom:14}}>📍 {p.address}</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14}}>
                <div style={{background:C.bg3, borderRadius:8, padding:10}}>
                  <div style={{fontSize:10, color:C.text3, marginBottom:3}}>Arriendo</div>
                  <div style={{fontSize:14, fontWeight:700, color:C.accent, fontFamily:'monospace'}}>{fmt(p.rent)}</div>
                </div>
                <div style={{background:C.bg3, borderRadius:8, padding:10}}>
                  <div style={{fontSize:10, color:C.text3, marginBottom:3}}>Área · Hab.</div>
                  <div style={{fontSize:14, fontWeight:600}}>{p.area} · {p.rooms > 0 ? p.rooms + ' hab' : 'Local'}</div>
                </div>
              </div>
              {p.tenant ? (
                <div style={{borderTop:`1px solid ${C.border}`, paddingTop:12, marginBottom:12}}>
                  <div style={{fontSize:12, color:C.text2, marginBottom:3}}>👤 {p.tenant}</div>
                  <div style={{fontSize:12, color:C.text2}}>📞 {p.phone}</div>
                  {p.end && <div style={{fontSize:12, color:C.text3, marginTop:3}}>📅 Contrato hasta {p.end}</div>}
                </div>
              ) : (
                <div style={{borderTop:`1px solid ${C.border}`, paddingTop:12, marginBottom:12}}>
                  <div style={{fontSize:13, color:C.accent, fontWeight:500}}>🔑 Disponible para arrendar</div>
                </div>
              )}
              <div style={{display:'flex', gap:8}}>
                <button onClick={() => { setModal('prop'); setEditTarget(p); setForm({ ...p }); }} style={{flex:1, background:C.bg3, border:`1px solid ${C.border2}`, color:C.text2, borderRadius:8, padding:'8px', fontSize:12, cursor:'pointer', fontFamily:'inherit'}}>Editar</button>
                <button onClick={() => delProperty(p.id)} style={{background:`${C.red}15`, border:`1px solid ${C.red}30`, color:C.red, borderRadius:8, padding:'8px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit'}}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
        {filteredProps.length === 0 && (
          <div style={{gridColumn:'1/-1', background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:22, textAlign:'center', color:C.text2}}>
            Ninguna propiedad coincide con los filtros.
          </div>
        )}
      </div>
    </div>
  );

  const renderPayments = () => {
    const cobrado  = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const porCobrar = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
    const enMora    = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
    return (
      <div className="fade-in">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4, flexWrap:'wrap', gap:10}}>
          <div style={{fontSize:22, fontWeight:700}}>Pagos</div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={() => exportCSV(payments, 'pagos')} style={{background:'transparent', border:`1px solid ${C.border2}`, color:C.text2, borderRadius:8, padding:'10px 16px', fontSize:13, cursor:'pointer', fontFamily:'inherit'}}>📥 Exportar</button>
            <button onClick={() => { setModal('payment'); setForm({}); }} style={{background:C.accent, color:'#000', border:'none', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>+ Registrar pago</button>
          </div>
        </div>
        <div style={{fontSize:13, color:C.text2, marginBottom:20}}>{payments.length} registros de pago</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12, marginBottom:20}}>
          {[
            { l:'Cobrado este mes', v:fmt(cobrado),   c:C.accent3 },
            { l:'Por cobrar',       v:fmt(porCobrar), c:C.orange  },
            { l:'En mora',          v:fmt(enMora),    c:C.red     },
          ].map(k => (
            <div key={k.l} style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:12, padding:18}}>
              <div style={{fontSize:11, color:C.text2, marginBottom:8, textTransform:'uppercase', letterSpacing:'.5px'}}>{k.l}</div>
              <div style={{fontSize:20, fontWeight:700, color:k.c, fontFamily:'monospace'}}>{k.v}</div>
            </div>
          ))}
        </div>
        <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', minWidth:700}}>
              <thead>
                <tr>{['Propiedad','Inquilino','Monto','Fecha','Método','Estado','Acción'].map(h => (
                  <th key={h} style={{fontSize:10, color:C.text2, fontWeight:600, textAlign:'left', padding:'12px 14px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} style={{borderBottom:`1px solid ${C.border}`}}>
                    <td style={{padding:'12px 14px', fontSize:13, fontWeight:500}}>{p.prop}</td>
                    <td style={{padding:'12px 14px', fontSize:13, color:C.text2}}>{p.tenant}</td>
                    <td style={{padding:'12px 14px', fontFamily:'monospace', fontWeight:700, fontSize:13}}>{fmt(p.amount)}</td>
                    <td style={{padding:'12px 14px', fontSize:12, color:C.text2, fontFamily:'monospace'}}>{p.date}</td>
                    <td style={{padding:'12px 14px', fontSize:12, color:C.text2}}>{p.method}</td>
                    <td style={{padding:'12px 14px'}}>
                      <span style={{fontSize:10, fontWeight:600, padding:'3px 10px', borderRadius:12, background:payStatus[p.status].bg, color:payStatus[p.status].c}}>{payStatus[p.status].l}</span>
                    </td>
                    <td style={{padding:'12px 14px'}}>
                      {p.status !== 'paid' && (
                        <button onClick={() => markPaid(p.id)} style={{background:`${C.accent3}15`, border:`1px solid ${C.accent3}30`, color:C.accent3, borderRadius:8, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit'}}>
                          ✓ Marcar pagado
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderMaintenance = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10}}>
        <div style={{fontSize:22, fontWeight:700}}>Mantenimiento</div>
        <button onClick={() => { setModal('maint'); setForm({}); }} style={{background:C.accent, color:'#000', border:'none', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>+ Nuevo reporte</button>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {maint.map(m => (
          <div key={m.id} style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:20, display:'flex', alignItems:'center', gap:16, borderLeft:`4px solid ${maintPriority[m.priority]}`, flexWrap:'wrap'}}>
            <div style={{flex:1, minWidth:200}}>
              <div style={{display:'flex', gap:10, alignItems:'center', marginBottom:5, flexWrap:'wrap'}}>
                <div style={{fontSize:14, fontWeight:700}}>{m.issue}</div>
                <span style={{fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:10, background:`${maintPriority[m.priority]}15`, color:maintPriority[m.priority]}}>
                  {m.priority === 'high' ? 'Alta' : m.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
              <div style={{fontSize:13, color:C.text2, marginBottom:3}}>🏠 {m.prop}</div>
              <div style={{fontSize:12, color:C.text3}}>📅 Reportado: {m.date}{m.tech && ` · 🔧 ${m.tech}`}</div>
            </div>
            <div style={{display:'flex', gap:8, alignItems:'center', flexShrink:0}}>
              <span style={{fontSize:11, fontWeight:600, padding:'4px 12px', borderRadius:12, background:maintStatus[m.status].bg, color:maintStatus[m.status].c}}>{maintStatus[m.status].l}</span>
              {m.status !== 'done' && (
                <button onClick={() => closeMaint(m.id)} style={{background:`${C.accent3}15`, border:`1px solid ${C.accent3}30`, color:C.accent3, borderRadius:8, padding:'6px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit'}}>✓ Resolver</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => {
    const totalDeposits = props.reduce((s, p) => s + p.deposit, 0);
    const maxRent       = Math.max(...props.map(p => p.rent), 1);
    return (
      <div className="fade-in">
        <div style={{fontSize:22, fontWeight:700, marginBottom:4}}>Reportes</div>
        <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Análisis financiero del portafolio</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14}}>
          <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:22}}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:16}}>Ingresos por propiedad</div>
            {props.filter(p => p.status !== 'vacant').sort((a, b) => b.rent - a.rent).map(p => (
              <div key={p.id} style={{marginBottom:14}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:5, gap:10}}>
                  <span style={{fontSize:12, color:C.text, maxWidth:'60%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{p.name}</span>
                  <span style={{fontSize:12, fontFamily:'monospace', fontWeight:700, color:C.accent}}>{fmt(p.rent)}</span>
                </div>
                <div style={{height:5, background:C.bg3, borderRadius:3}}>
                  <div style={{width:`${(p.rent / maxRent) * 100}%`, height:'100%', background:statusInfo[p.status].dot, borderRadius:3, transition:'width .5s'}} />
                </div>
              </div>
            ))}
          </div>
          <div style={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:22}}>
            <div style={{fontSize:14, fontWeight:700, marginBottom:16}}>Resumen financiero</div>
            {[
              { l:'Ingreso mensual bruto',    v:fmt(monthlyTotal),    c:C.accent3 },
              { l:'Total depósitos',          v:fmt(totalDeposits),   c:C.accent },
              { l:'Pagos pendientes',         v:fmt(pendingAmount),   c:C.orange },
              { l:'Ingreso anual proyectado', v:fmt(monthlyTotal * 12), c:C.accent2 },
            ].map(r => (
              <div key={r.l} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 0', borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:13, color:C.text2}}>{r.l}</span>
                <span style={{fontFamily:'monospace', fontWeight:700, color:r.c, fontSize:14}}>{r.v}</span>
              </div>
            ))}
            <div style={{marginTop:16, background:`${C.accent3}10`, border:`1px solid ${C.accent3}20`, borderRadius:10, padding:16, textAlign:'center'}}>
              <div style={{fontSize:11, color:C.accent3, marginBottom:4}}>TASA DE OCUPACIÓN</div>
              <div style={{fontSize:32, fontWeight:700, color:C.accent3, fontFamily:'monospace'}}>
                {Math.round(((activeProps + overdueProps) / props.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const pageRender = {
    dashboard:   renderDashboard,
    properties:  renderProperties,
    payments:    renderPayments,
    maintenance: renderMaintenance,
    reports:     renderReports,
  }[page] || renderDashboard;

  const inputForm = (placeholder, type='text') => ({
    placeholder,
    type,
    style: inputBase,
  });

  return (
    <div style={{position:'relative', minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color:C.text, fontSize:14, display:'grid', gridTemplateColumns:'210px 1fr'}}>

      {/* MODAL: PROPERTY */}
      {modal === 'prop' && (
        <Modal title={editTarget ? 'Editar propiedad' : 'Nueva propiedad'} onSave={saveProperty} onClose={closeModal} C={C}>
          <Field label="Nombre de la propiedad *" C={C} span><input {...inputForm('Apto 301 - Ed. Mirador')} value={form.name||''} onChange={fv('name')} autoComplete="off" /></Field>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <Field label="Dirección" C={C}><input {...inputForm('Calle 50 #30-20, Medellín')} value={form.address||''} onChange={fv('address')} autoComplete="off" /></Field>
            <Field label="Arriendo (COP) *" C={C}><input {...inputForm('1800000', 'number')} value={form.rent||''} onChange={fv('rent')} min="0" /></Field>
            <Field label="Área" C={C}><input {...inputForm('65m²')} value={form.area||''} onChange={fv('area')} autoComplete="off" /></Field>
            <Field label="Habitaciones" C={C}><input {...inputForm('2', 'number')} value={form.rooms||''} onChange={fv('rooms')} min="0" /></Field>
            <Field label="Arrendatario" C={C}><input {...inputForm('Nombre del inquilino')} value={form.tenant||''} onChange={fv('tenant')} autoComplete="off" /></Field>
            <Field label="Teléfono" C={C}><input {...inputForm('310-000-0000')} value={form.phone||''} onChange={fv('phone')} autoComplete="off" /></Field>
            <Field label="Inicio contrato" C={C}><input {...inputForm('', 'date')} value={form.start||''} onChange={fv('start')} /></Field>
            <Field label="Fin contrato" C={C}><input {...inputForm('', 'date')} value={form.end||''} onChange={fv('end')} /></Field>
          </div>
        </Modal>
      )}

      {/* MODAL: PAYMENT */}
      {modal === 'payment' && (
        <Modal title="Registrar pago" onSave={savePayment} onClose={closeModal} C={C}>
          <Field label="Propiedad *" C={C}>
            <select style={inputBase} value={form.prop||''} onChange={fv('prop')}>
              <option value="">Seleccionar propiedad...</option>
              {props.filter(p => p.status !== 'vacant').map(p => <option key={p.id} value={p.name}>{p.name} · {p.tenant}</option>)}
            </select>
          </Field>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <Field label="Monto (COP) *" C={C}><input {...inputForm('1800000', 'number')} value={form.amount||''} onChange={fv('amount')} min="0" /></Field>
            <Field label="Fecha" C={C}><input {...inputForm('', 'date')} value={form.date||''} onChange={fv('date')} /></Field>
            <Field label="Método de pago" C={C}>
              <select style={inputBase} value={form.method||'Transferencia'} onChange={fv('method')}>
                <option>Transferencia</option><option>PSE</option><option>Efectivo</option><option>Cheque</option>
              </select>
            </Field>
            <Field label="Notas" C={C}><input {...inputForm('Opcional')} value={form.notes||''} onChange={fv('notes')} autoComplete="off" /></Field>
          </div>
        </Modal>
      )}

      {/* MODAL: MAINTENANCE */}
      {modal === 'maint' && (
        <Modal title="Nuevo reporte de mantenimiento" onSave={saveMaintenance} onClose={closeModal} C={C}>
          <Field label="Propiedad *" C={C}>
            <select style={inputBase} value={form.prop||''} onChange={fv('prop')}>
              <option value="">Seleccionar propiedad...</option>
              {props.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Descripción del problema *" C={C}>
            <input {...inputForm('Descripción del daño o mantenimiento')} value={form.issue||''} onChange={fv('issue')} autoComplete="off" />
          </Field>
          <Field label="Prioridad" C={C}>
            <select style={inputBase} value={form.priority||'medium'} onChange={fv('priority')}>
              <option value="high">Alta — Urgente</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </Field>
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,.8)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{background:C.bg2, border:`1px solid ${C.border2}`, borderRadius:16, padding:28, maxWidth:380, textAlign:'center'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize:36, marginBottom:14}}>⚠️</div>
            <div style={{fontSize:15, fontWeight:600, marginBottom:20, color:C.text}}>{confirm.msg}</div>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button onClick={() => setConfirm(null)} style={{background:'transparent', border:`1px solid ${C.border2}`, color:C.text2, borderRadius:8, padding:'9px 18px', fontSize:13, cursor:'pointer', fontFamily:'inherit'}}>Cancelar</button>
              <button onClick={confirm.onYes} style={{background:C.red, color:'#fff', border:'none', borderRadius:8, padding:'9px 20px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit'}}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background: toast.type === 'error' ? C.red : C.accent3, color:'#000', padding:'12px 20px', borderRadius:10, fontSize:13, fontWeight:600, zIndex:1001, boxShadow:'0 8px 24px rgba(0,0,0,.5)'}}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{background:C.bg2, borderRight:`1px solid ${C.border}`, padding:'20px 0', display:'flex', flexDirection:'column'}}>
        <div style={{padding:'0 18px 20px', borderBottom:`1px solid ${C.border}`, marginBottom:14}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{width:36, height:36, background:`linear-gradient(135deg,${C.accent},${C.accent2})`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>🏠</div>
            <div>
              <div style={{fontSize:16, fontWeight:700}}>RentTrack</div>
              <div style={{fontSize:11, color:C.text2}}>Gestión de arrendamientos</div>
            </div>
          </div>
        </div>
        {nav.map(n => (
          <div key={n.id}
            onClick={() => setPage(n.id)}
            role="button" tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPage(n.id); } }}
            style={{display:'flex', alignItems:'center', gap:10, padding:'10px 18px', cursor:'pointer', fontSize:13, background: page === n.id ? `${C.accent}12` : 'transparent', color: page === n.id ? C.accent : C.text2, borderLeft: page === n.id ? `3px solid ${C.accent}` : '3px solid transparent', fontWeight: page === n.id ? 600 : 400, transition:'all .15s', marginBottom:2, userSelect:'none'}}>
            <span style={{fontSize:16}}>{n.icon}</span>{n.label}
          </div>
        ))}
        <div style={{marginTop:'auto', padding:'18px', borderTop:`1px solid ${C.border}`}}>
          <div style={{background:C.bg3, borderRadius:10, padding:12, textAlign:'center', marginBottom:10}}>
            <div style={{fontSize:10, color:C.text3, marginBottom:4}}>INGRESOS / MES</div>
            <div style={{fontSize:18, fontWeight:700, color:C.accent3, fontFamily:'monospace'}}>{fmt(monthlyTotal)}</div>
          </div>
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            style={{width:'100%', background:'transparent', border:`1px solid ${C.border2}`, color:C.text2, borderRadius:8, padding:'7px 14px', fontSize:12, cursor:'pointer', fontFamily:'inherit'}}
          >
            {theme === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro'}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{padding:28, overflowY:'auto'}}>{pageRender()}</div>
    </div>
  );
}
