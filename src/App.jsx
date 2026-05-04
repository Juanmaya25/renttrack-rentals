import { useState, useMemo, useCallback } from "react";

// ─── DATA SEED ──────────────────────────────────────────────────────
const INIT_PROPS = [
  { id:1, name:'Apto 301 - Ed. Mirador',    address:'Calle 50 #30-20, Medellín',   rent:1800000, tenant:'Carlos Rodríguez', phone:'310-111-2222', status:'active',  due:1,  paid:true,  deposit:3600000, start:'2024-03-01', end:'2026-03-01', area:'65m²',  rooms:2, type:'Apartamento', baths:2 },
  { id:2, name:'Casa 45 - Laureles',         address:'Carrera 76 #45-10, Medellín', rent:2500000, tenant:'Ana García',       phone:'310-333-4444', status:'active',  due:5,  paid:false, deposit:5000000, start:'2023-08-01', end:'2026-08-01', area:'120m²', rooms:3, type:'Casa',         baths:3 },
  { id:3, name:'Local 12 - CC Punto',        address:'Av. El Poblado #10-50',       rent:4200000, tenant:'Tienda Moda XYZ',  phone:'310-555-6666', status:'overdue', due:1,  paid:false, deposit:8400000, start:'2023-01-01', end:'2026-01-01', area:'45m²',  rooms:0, type:'Local',        baths:1 },
  { id:4, name:'Apto 502 - Torres Norte',    address:'Calle 80 #20-15, Medellín',   rent:1600000, tenant:'María Torres',     phone:'310-777-8888', status:'active',  due:10, paid:true,  deposit:3200000, start:'2024-07-01', end:'2026-07-01', area:'55m²',  rooms:2, type:'Apartamento', baths:1 },
  { id:5, name:'Bodega Industrial - Itagüí', address:'Zona Industrial, Itagüí',     rent:5800000, tenant:'',                  phone:'',             status:'vacant',  due:0,  paid:false, deposit:0,       start:'',           end:'',           area:'300m²', rooms:0, type:'Bodega',       baths:1 },
  { id:6, name:'Casa Campestre - Rionegro',  address:'Vereda El Tablazo, Rionegro', rent:3200000, tenant:'Pedro Vargas',     phone:'310-999-0000', status:'active',  due:15, paid:true,  deposit:6400000, start:'2024-01-01', end:'2026-01-01', area:'200m²', rooms:4, type:'Casa',         baths:3 },
];

const INIT_PAYMENTS = [
  { id:1, prop:'Apto 301 - Ed. Mirador',    tenant:'Carlos Rodríguez', amount:1800000, date:'2026-05-01', method:'Transferencia', status:'paid' },
  { id:2, prop:'Apto 502 - Torres Norte',   tenant:'María Torres',     amount:1600000, date:'2026-05-01', method:'PSE',           status:'paid' },
  { id:3, prop:'Casa Campestre - Rionegro', tenant:'Pedro Vargas',     amount:3200000, date:'2026-04-30', method:'Transferencia', status:'paid' },
  { id:4, prop:'Casa 45 - Laureles',        tenant:'Ana García',       amount:2500000, date:'2026-05-05', method:'Pendiente',     status:'pending' },
  { id:5, prop:'Local 12 - CC Punto',       tenant:'Tienda Moda XYZ',  amount:4200000, date:'2026-04-01', method:'—',             status:'overdue' },
];

const INIT_MAINT = [
  { id:1, prop:'Casa 45 - Laureles',       issue:'Goteras en el techo',          priority:'high',   status:'open',     date:'2026-04-28', tech:'' },
  { id:2, prop:'Local 12 - CC Punto',      issue:'Puerta eléctrica dañada',      priority:'high',   status:'progress', date:'2026-04-25', tech:'Eléctricos Norte' },
  { id:3, prop:'Apto 301 - Ed. Mirador',   issue:'Cambio de grifo cocina',       priority:'low',    status:'done',     date:'2026-04-20', tech:'Plomería Rápida' },
  { id:4, prop:'Apto 502 - Torres Norte',  issue:'Pintura habitación principal', priority:'medium', status:'open',     date:'2026-04-29', tech:'' },
];

const MONTHLY_INCOME = [
  { mes:'Oct', total:11400000 }, { mes:'Nov', total:12800000 }, { mes:'Dic', total:13100000 },
  { mes:'Ene', total:11800000 }, { mes:'Feb', total:12600000 }, { mes:'Mar', total:13400000 },
  { mes:'Abr', total:13900000 }, { mes:'May', total:14900000 },
];

// PALETTE: real-estate cyan + slate, mucho whitespace, estilo Airbnb
const themes = {
  light: {
    bg:        '#f5f5f4',     // beige claro
    bg2:       '#ffffff',
    bg3:       '#fafaf9',
    accent:    '#0d9488',     // teal premium
    accent2:   '#0891b2',     // cyan
    accent3:   '#f59e0b',     // dorado para destacar
    success:   '#059669',
    danger:    '#e11d48',
    warning:   '#ea580c',
    text:      '#1c1917',
    text2:     '#57534e',
    text3:     '#a8a29e',
    border:    '#e7e5e4',
    borderDark:'#d6d3d1',
    shadow:    '0 1px 2px rgba(28,25,23,.04)',
    shadowMd:  '0 6px 20px rgba(28,25,23,.06)',
    shadowLg:  '0 20px 60px rgba(28,25,23,.12)',
  },
  dark: {
    bg:        '#0c0a09',
    bg2:       '#1c1917',
    bg3:       '#292524',
    accent:    '#2dd4bf',
    accent2:   '#22d3ee',
    accent3:   '#fbbf24',
    success:   '#10b981',
    danger:    '#fb7185',
    warning:   '#fb923c',
    text:      '#fafaf9',
    text2:     '#a8a29e',
    text3:     '#78716c',
    border:    '#292524',
    borderDark:'#44403c',
    shadow:    '0 1px 2px rgba(0,0,0,.3)',
    shadowMd:  '0 6px 20px rgba(0,0,0,.5)',
    shadowLg:  '0 20px 60px rgba(0,0,0,.6)',
  },
};

const statusInfo = {
  active:  { l:'Arrendado',  bg:'rgba(16,185,129,.12)', c:'#059669', dot:'#10b981' },
  overdue: { l:'En mora',    bg:'rgba(225,29,72,.12)',  c:'#e11d48', dot:'#fb7185' },
  vacant:  { l:'Disponible', bg:'rgba(13,148,136,.12)', c:'#0d9488', dot:'#2dd4bf' },
};

const payStatus = {
  paid:    { l:'Pagado',    bg:'rgba(16,185,129,.12)', c:'#059669' },
  pending: { l:'Pendiente', bg:'rgba(234,88,12,.12)',  c:'#ea580c' },
  overdue: { l:'En mora',   bg:'rgba(225,29,72,.12)',  c:'#e11d48' },
};

const maintPriority = { high:'#e11d48', medium:'#ea580c', low:'#a8a29e' };

const maintStatus = {
  open:     { l:'Abierto',    bg:'rgba(225,29,72,.12)', c:'#e11d48' },
  progress: { l:'En proceso', bg:'rgba(234,88,12,.12)', c:'#ea580c' },
  done:     { l:'Resuelto',   bg:'rgba(16,185,129,.12)', c:'#059669' },
};

const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');

// Imagen placeholder por tipo de propiedad (gradient + emoji)
const propTypeStyle = {
  Apartamento: { bg:'linear-gradient(135deg, #06b6d4, #3b82f6)', emoji:'🏢' },
  Casa:        { bg:'linear-gradient(135deg, #f59e0b, #ef4444)', emoji:'🏡' },
  Local:       { bg:'linear-gradient(135deg, #8b5cf6, #ec4899)', emoji:'🏬' },
  Bodega:      { bg:'linear-gradient(135deg, #64748b, #475569)', emoji:'🏭' },
};

// ─── SVG ICONS ──────────────────────────────────────────────────────
const Icon = {
  pencil: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  alert: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  pin: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  bed: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
  bath: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="7" y1="19" x2="7" y2="21"/><line x1="17" y1="19" x2="17" y2="21"/></svg>,
  ruler: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>,
  user: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  phone: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  calendar: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  sun: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  building: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M10 22v-4h4v4"/></svg>,
  dollar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  wrench: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  chart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  key: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
};

// ─── REUSABLE COMPONENTS ────────────────────────────────────────────

function Modal({ title, onSave, onClose, children, C, S }) {
  return (
    <div
      style={{position:'fixed', inset:0, background:'rgba(28, 25, 23, .65)', backdropFilter:'blur(6px)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{background:C.bg2, borderRadius:20, padding:30, width:'100%', maxWidth:540, boxShadow:C.shadowLg, border:`1px solid ${C.border}`}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
          <h2 style={{fontSize:22, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.6px'}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:C.bg3, border:'none', color:C.text2, width:36, height:36, borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {Icon.close()}
          </button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:24}}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={S.btnPri} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{marginBottom:16}}>
      <label style={{fontSize:12, color:'inherit', opacity:.7, display:'block', marginBottom:6, fontWeight:600}}>{label}</label>
      {children}
    </div>
  );
}

// ─── APP ────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]               = useState('light');
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
    const matchQ = p.name.toLowerCase().includes(q) || (p.tenant || '').toLowerCase().includes(q) || p.address.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || p.status === filterStatus;
    return matchQ && matchS;
  }), [props, search, filterStatus]);

  const saveProperty = () => {
    if (!validate([['Nombre', form.name], ['Arriendo', form.rent]])) return;
    const p = { ...form, rent: +form.rent || 0, rooms: +form.rooms || 0, baths: +form.baths || 1 };
    if (!editTarget) {
      setProps(pp => [...pp, { ...p, id: nextId(pp), status: form.tenant ? 'active' : 'vacant', paid:false, deposit:(+form.rent || 0) * 2, type: form.type || 'Apartamento' }]);
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
      id: nextId(pp), prop: form.prop, tenant: prop?.tenant || form.tenant || '',
      amount: +form.amount || 0, date: form.date || new Date().toISOString().split('T')[0],
      method: form.method || 'Transferencia', status: 'paid',
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
      id: nextId(mm), prop: form.prop, issue: form.issue,
      priority: form.priority || 'medium', status: 'open',
      date: new Date().toISOString().split('T')[0], tech: '',
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
    { id:'dashboard',   icon: Icon.home,     label:'Inicio' },
    { id:'properties',  icon: Icon.building, label:'Propiedades' },
    { id:'payments',    icon: Icon.dollar,   label:'Pagos' },
    { id:'maintenance', icon: Icon.wrench,   label:'Mantenimiento' },
    { id:'reports',     icon: Icon.chart,    label:'Reportes' },
  ];

  const S = {
    card:    { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:18, padding:22, boxShadow:C.shadow },
    input:   { background:C.bg2, border:`1px solid ${C.borderDark}`, borderRadius:10, padding:'11px 14px', fontSize:14, color:C.text, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box', transition:'border-color .15s, box-shadow .15s' },
    btnPri:  { background:C.text, color:C.bg2, border:'none', borderRadius:100, padding:'12px 22px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, transition:'transform .15s, box-shadow .2s' },
    btnGhost:{ background:'transparent', color:C.text, border:`1px solid ${C.borderDark}`, borderRadius:100, padding:'12px 18px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6, transition:'all .15s' },
    btnIcon: { background:'transparent', color:C.text2, border:'none', cursor:'pointer', padding:8, borderRadius:10, display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .15s, color .15s' },
  };

  const focusH = {
    onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}25`; },
    onBlur:  e => { e.target.style.borderColor = C.borderDark; e.target.style.boxShadow = 'none'; },
  };

  // ─── PAGE RENDERERS ───────────────────────────────────────────────

  const renderDashboard = () => {
    const max = Math.max(...MONTHLY_INCOME.map(x => x.total));
    return (
      <div className="fade-in" style={{display:'flex', flexDirection:'column', gap:24}}>
        {/* HEADER */}
        <div>
          <div style={{fontSize:13, color:C.text3, fontWeight:500, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>RentTrack · Mayo 2026</div>
          <h1 style={{fontSize:40, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.5px', lineHeight:1.05, fontFamily:'Georgia, "Times New Roman", serif'}}>
            Tu portafolio de hoy
          </h1>
          <div style={{fontSize:16, color:C.text2, marginTop:8}}>
            {props.length} propiedades · {fmt(monthlyTotal)} en ingresos mensuales
          </div>
        </div>

        {/* KPIs grandes con border-radius enorme */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16}}>
          {[
            { l:'Propiedades',   v:props.length,        sub:`${activeProps} arrendadas`,                                   c:C.text     },
            { l:'Ingreso/mes',   v:fmt(monthlyTotal),   sub:`${activeProps + overdueProps} contratos activos`,             c:C.accent   },
            { l:'Pendiente',     v:fmt(pendingAmount),  sub:`${payments.filter(p => p.status !== 'paid').length} propiedades`, c:C.warning  },
            { l:'Disponibles',   v:vacantProps,         sub:'Para arrendar',                                                c:C.accent2  },
          ].map(k => (
            <div key={k.l} style={S.card}>
              <div style={{fontSize:12, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:10}}>{k.l}</div>
              <div style={{fontSize:32, fontWeight:700, color:k.c, fontFamily:'Georgia, serif', letterSpacing:'-1px', lineHeight:1, marginBottom:6}}>{k.v}</div>
              <div style={{fontSize:13, color:C.text3}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* GRAPH + DONUT layout */}
        <div style={{display:'grid', gridTemplateColumns:'minmax(0,1.8fr) minmax(0,1fr)', gap:16}}>
          <div style={S.card}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
              <div>
                <h2 style={{fontSize:18, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.3px'}}>Ingresos mensuales</h2>
                <div style={{fontSize:13, color:C.text2, marginTop:3}}>Últimos 8 meses · proyección de cierre {fmt(178800000)}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:28, fontWeight:700, color:C.accent, fontFamily:'Georgia, serif'}}>{fmt(14900000)}</div>
                <div style={{fontSize:11, color:C.text3, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase'}}>Mayo 2026</div>
              </div>
            </div>
            <div style={{display:'flex', gap:8, alignItems:'flex-end', height:160, paddingBottom:24, position:'relative'}}>
              {MONTHLY_INCOME.map((m, i) => {
                const pct = (m.total / max) * 100;
                const isLast = i === MONTHLY_INCOME.length - 1;
                return (
                  <div key={m.mes} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8, position:'relative'}}>
                    <div style={{
                      width:'100%', height:`${pct}%`,
                      background: isLast ? `linear-gradient(180deg, ${C.accent}, ${C.accent2})` : C.bg3,
                      borderRadius:'8px 8px 4px 4px',
                      minHeight:8,
                      transition:'all .3s',
                      cursor:'pointer',
                    }} />
                    <div style={{fontSize:11, color: isLast ? C.accent : C.text3, fontWeight: isLast ? 700 : 500}}>{m.mes}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={S.card}>
            <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 18px', color:C.text, letterSpacing:'-.3px'}}>Estado del portafolio</h2>
            {[
              { l:'Arrendadas',  n:activeProps,  c:C.success, pct: Math.round((activeProps  / props.length) * 100) },
              { l:'En mora',     n:overdueProps, c:C.danger,  pct: Math.round((overdueProps / props.length) * 100) },
              { l:'Disponibles', n:vacantProps,  c:C.accent,  pct: Math.round((vacantProps  / props.length) * 100) },
            ].map(s => (
              <div key={s.l} style={{marginBottom:16}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
                  <span style={{fontSize:13, color:C.text, fontWeight:500}}>{s.l}</span>
                  <span style={{fontSize:13, fontWeight:700, color:s.c, fontFamily:'Georgia, serif'}}>{s.n} <span style={{fontSize:11, color:C.text3, fontWeight:500}}>({s.pct}%)</span></span>
                </div>
                <div style={{height:6, background:C.bg3, borderRadius:3, overflow:'hidden'}}>
                  <div style={{width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:3, transition:'width .5s'}} />
                </div>
              </div>
            ))}
            <div style={{marginTop:20, padding:18, background:C.bg3, borderRadius:14, textAlign:'center'}}>
              <div style={{fontSize:11, color:C.text3, fontWeight:600, letterSpacing:'.4px', textTransform:'uppercase', marginBottom:6}}>Ocupación total</div>
              <div style={{fontSize:36, fontWeight:700, color:C.success, fontFamily:'Georgia, serif', letterSpacing:'-1px', lineHeight:1}}>
                {Math.round(((activeProps + overdueProps) / props.length) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* RECIENTES */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          <div style={S.card}>
            <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 14px', color:C.text, letterSpacing:'-.3px'}}>Pagos recientes</h2>
            {payments.slice(0, 4).map(p => (
              <div key={p.id} style={{display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:36, height:36, borderRadius:'50%', background:`${p.status === 'paid' ? C.success : C.warning}15`, color: p.status === 'paid' ? C.success : C.warning, display:'flex', alignItems:'center', justifyContent:'center'}}>
                  {p.status === 'paid' ? Icon.check() : <span style={{fontSize:16, fontWeight:700}}>!</span>}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:600, color:C.text}}>{p.tenant}</div>
                  <div style={{fontSize:11, color:C.text2}}>{p.date}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontFamily:'Georgia, serif', fontWeight:700, color: p.status === 'paid' ? C.success : C.warning, fontSize:14}}>{fmt(p.amount)}</div>
                  <span style={{fontSize:10, color:payStatus[p.status].c, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase'}}>{payStatus[p.status].l}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 14px', color:C.text, letterSpacing:'-.3px'}}>Mantenimientos activos</h2>
            {maint.filter(m => m.status !== 'done').map(m => (
              <div key={m.id} style={{display:'flex', gap:12, alignItems:'flex-start', padding:'12px 0', borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:8, height:8, borderRadius:'50%', background:maintPriority[m.priority], marginTop:6, flexShrink:0}} />
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:600, color:C.text}}>{m.issue}</div>
                  <div style={{fontSize:11, color:C.text2, marginTop:2}}>{m.prop}</div>
                </div>
                <span style={{fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:100, background:maintStatus[m.status].bg, color:maintStatus[m.status].c, flexShrink:0, whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'.3px'}}>{maintStatus[m.status].l}</span>
              </div>
            ))}
            {maint.filter(m => m.status !== 'done').length === 0 && (
              <div style={{fontSize:13, color:C.text2, textAlign:'center', padding:24}}>Sin mantenimientos pendientes</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProperties = () => (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <div style={{fontSize:13, color:C.text3, fontWeight:600, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>Catálogo</div>
          <h1 style={{fontSize:36, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.2px', fontFamily:'Georgia, serif', lineHeight:1.1}}>Propiedades</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{filteredProps.length} de {props.length}</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={() => exportCSV(filteredProps, 'propiedades')}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={() => { setModal('prop'); setEditTarget(null); setForm({}); }}>
            <Icon.plus /> Agregar propiedad
          </button>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div style={{display:'flex', gap:10, marginBottom:24, flexWrap:'wrap', alignItems:'center'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:400}}>
          <span style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input style={{...S.input, paddingLeft:38}} placeholder="Buscar dirección, propiedad, inquilino..." value={search} onChange={e => setSearch(e.target.value)} {...focusH} />
        </div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {['all','active','overdue','vacant'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                background: filterStatus === s ? C.text : 'transparent',
                color:      filterStatus === s ? C.bg2 : C.text,
                border: `1px solid ${filterStatus === s ? C.text : C.borderDark}`,
                borderRadius:100, padding:'10px 18px', fontSize:13, fontWeight: filterStatus === s ? 600 : 500,
                cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
              }}
            >
              {s === 'all' ? 'Todas' : s === 'active' ? 'Arrendadas' : s === 'overdue' ? 'En mora' : 'Disponibles'}
            </button>
          ))}
        </div>
      </div>

      {/* AIRBNB-STYLE LISTING CARDS */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:24}}>
        {filteredProps.map(p => {
          const ts = propTypeStyle[p.type] || propTypeStyle.Apartamento;
          return (
            <div key={p.id} style={{
              background:C.bg2,
              borderRadius:18,
              overflow:'hidden',
              cursor:'pointer',
              transition:'transform .25s, box-shadow .25s',
              boxShadow:C.shadow,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = C.shadowLg; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = C.shadow; }}>
              {/* "Imagen" - gradient + emoji */}
              <div style={{
                background: ts.bg,
                height:200, position:'relative',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{fontSize:80, opacity:.4}}>{ts.emoji}</span>
                <div style={{position:'absolute', top:14, left:14}}>
                  <span style={{fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:100, background:'rgba(255,255,255,.95)', color:statusInfo[p.status].c, display:'inline-flex', alignItems:'center', gap:6}}>
                    <span style={{width:6, height:6, borderRadius:'50%', background:statusInfo[p.status].dot}} />
                    {statusInfo[p.status].l}
                  </span>
                </div>
                <div style={{position:'absolute', top:14, right:14}}>
                  <span style={{fontSize:11, fontWeight:600, padding:'5px 12px', borderRadius:100, background:'rgba(0,0,0,.4)', color:'#fff', backdropFilter:'blur(4px)'}}>
                    {p.type}
                  </span>
                </div>
                <div style={{position:'absolute', bottom:14, left:14, right:14, display:'flex', gap:8}}>
                  <button style={{flex:1, background:'rgba(255,255,255,.95)', color:C.text, border:'none', borderRadius:10, padding:'8px 12px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6}} onClick={e => { e.stopPropagation(); setModal('prop'); setEditTarget(p); setForm({ ...p }); }}>
                    <Icon.pencil /> Editar
                  </button>
                  <button style={{background:'rgba(255,255,255,.95)', color:C.danger, border:'none', borderRadius:10, padding:'8px 12px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6}} onClick={e => { e.stopPropagation(); delProperty(p.id); }}>
                    <Icon.trash />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{padding:'20px 22px'}}>
                <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:6}}>
                  <h3 style={{fontSize:17, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.3px'}}>{p.name}</h3>
                </div>
                <div style={{fontSize:13, color:C.text2, marginBottom:14, display:'flex', alignItems:'center', gap:5}}>
                  {Icon.pin()} {p.address}
                </div>

                <div style={{display:'flex', gap:14, marginBottom:14, fontSize:12, color:C.text2, paddingBottom:14, borderBottom:`1px solid ${C.border}`}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:5}}>{Icon.ruler()} {p.area}</span>
                  {p.rooms > 0 && <span style={{display:'inline-flex', alignItems:'center', gap:5}}>{Icon.bed()} {p.rooms} hab</span>}
                  <span style={{display:'inline-flex', alignItems:'center', gap:5}}>{Icon.bath()} {p.baths || 1}</span>
                </div>

                {p.tenant ? (
                  <>
                    <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:6, marginBottom:4}}>
                      {Icon.user()} <strong style={{color:C.text, fontWeight:600}}>{p.tenant}</strong>
                    </div>
                    <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:6, marginBottom:14}}>
                      {Icon.phone()} {p.phone}
                    </div>
                  </>
                ) : (
                  <div style={{padding:'10px 14px', background:`${C.accent}10`, color:C.accent, borderRadius:10, fontSize:12, fontWeight:600, marginBottom:14, display:'inline-flex', alignItems:'center', gap:8}}>
                    {Icon.key()} Disponible para arrendar
                  </div>
                )}

                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <div>
                    <div style={{fontSize:24, fontWeight:700, color:C.text, fontFamily:'Georgia, serif', letterSpacing:'-.5px', display:'inline'}}>{fmt(p.rent)}</div>
                    <span style={{fontSize:13, color:C.text2, marginLeft:4}}>/mes</span>
                  </div>
                  {p.end && (
                    <div style={{fontSize:11, color:C.text3, display:'inline-flex', alignItems:'center', gap:5}}>
                      {Icon.calendar()} hasta {p.end}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredProps.length === 0 && (
          <div style={{...S.card, gridColumn:'1/-1', textAlign:'center', padding:40, color:C.text2}}>
            <div style={{fontSize:48, marginBottom:10, opacity:.3}}>🏠</div>
            Ninguna propiedad coincide con los filtros.
          </div>
        )}
      </div>
    </div>
  );

  const renderPayments = () => {
    const cobrado   = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const porCobrar = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
    const enMora    = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
    return (
      <div className="fade-in">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
          <div>
            <div style={{fontSize:13, color:C.text3, fontWeight:600, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>Cobranza</div>
            <h1 style={{fontSize:36, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.2px', fontFamily:'Georgia, serif', lineHeight:1.1}}>Pagos</h1>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button style={S.btnGhost} onClick={() => exportCSV(payments, 'pagos')}><Icon.download /> Exportar</button>
            <button style={S.btnPri} onClick={() => { setModal('payment'); setForm({}); }}>
              <Icon.plus /> Registrar pago
            </button>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:24}}>
          {[
            { l:'Cobrado este mes', v:fmt(cobrado),   c:C.success },
            { l:'Por cobrar',       v:fmt(porCobrar), c:C.warning },
            { l:'En mora',          v:fmt(enMora),    c:C.danger  },
          ].map(k => (
            <div key={k.l} style={S.card}>
              <div style={{fontSize:12, color:C.text2, marginBottom:8, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase'}}>{k.l}</div>
              <div style={{fontSize:24, fontWeight:700, color:k.c, fontFamily:'Georgia, serif', letterSpacing:'-.5px'}}>{k.v}</div>
            </div>
          ))}
        </div>
        <div style={{...S.card, padding:0, overflow:'hidden'}}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', minWidth:760}}>
              <thead>
                <tr style={{background:C.bg3}}>
                  {['Propiedad','Inquilino','Monto','Fecha','Método','Estado','Acción'].map(h => (
                    <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'14px 18px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}
                    style={{borderBottom:`1px solid ${C.border}`, transition:'background .12s'}}
                    onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{padding:'14px 18px', fontSize:13, fontWeight:500, color:C.text}}>{p.prop}</td>
                    <td style={{padding:'14px 18px', fontSize:13, color:C.text2}}>{p.tenant}</td>
                    <td style={{padding:'14px 18px', fontFamily:'Georgia, serif', fontWeight:700, fontSize:14, color:C.text}}>{fmt(p.amount)}</td>
                    <td style={{padding:'14px 18px', fontSize:12, color:C.text2}}>{p.date}</td>
                    <td style={{padding:'14px 18px', fontSize:12, color:C.text2}}>{p.method}</td>
                    <td style={{padding:'14px 18px'}}>
                      <span style={{fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:100, background:payStatus[p.status].bg, color:payStatus[p.status].c, textTransform:'uppercase', letterSpacing:'.3px'}}>{payStatus[p.status].l}</span>
                    </td>
                    <td style={{padding:'14px 18px'}}>
                      {p.status !== 'paid' && (
                        <button onClick={() => markPaid(p.id)} style={{background:`${C.success}15`, border:`1px solid ${C.success}40`, color:C.success, borderRadius:100, padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5}}>
                          <Icon.check /> Marcar pagado
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
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <div style={{fontSize:13, color:C.text3, fontWeight:600, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>Operaciones</div>
          <h1 style={{fontSize:36, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.2px', fontFamily:'Georgia, serif', lineHeight:1.1}}>Mantenimiento</h1>
        </div>
        <button style={S.btnPri} onClick={() => { setModal('maint'); setForm({}); }}>
          <Icon.plus /> Nuevo reporte
        </button>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {maint.map(m => (
          <div key={m.id} style={{
            ...S.card,
            display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
            borderLeft:`5px solid ${maintPriority[m.priority]}`,
          }}>
            <div style={{width:42, height:42, borderRadius:'50%', background:`${maintPriority[m.priority]}15`, color:maintPriority[m.priority], display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              {Icon.wrench()}
            </div>
            <div style={{flex:1, minWidth:200}}>
              <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:5}}>
                <h3 style={{fontSize:15, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.2px'}}>{m.issue}</h3>
                <span style={{fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:100, background:`${maintPriority[m.priority]}15`, color:maintPriority[m.priority], textTransform:'uppercase', letterSpacing:'.3px'}}>
                  {m.priority === 'high' ? 'Alta' : m.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
              <div style={{fontSize:13, color:C.text2, marginBottom:3}}>{m.prop}</div>
              <div style={{fontSize:12, color:C.text3}}>Reportado: {m.date}{m.tech && ` · ${m.tech}`}</div>
            </div>
            <div style={{display:'flex', gap:8, alignItems:'center', flexShrink:0}}>
              <span style={{fontSize:11, fontWeight:700, padding:'5px 14px', borderRadius:100, background:maintStatus[m.status].bg, color:maintStatus[m.status].c, textTransform:'uppercase', letterSpacing:'.3px'}}>{maintStatus[m.status].l}</span>
              {m.status !== 'done' && (
                <button onClick={() => closeMaint(m.id)} style={{background:`${C.success}15`, border:`1px solid ${C.success}40`, color:C.success, borderRadius:100, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5}}>
                  <Icon.check /> Resolver
                </button>
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
        <div style={{marginBottom:24}}>
          <div style={{fontSize:13, color:C.text3, fontWeight:600, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>Análisis</div>
          <h1 style={{fontSize:36, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.2px', fontFamily:'Georgia, serif', lineHeight:1.1}}>Reportes</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>Análisis financiero del portafolio</div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          <div style={S.card}>
            <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 18px', color:C.text, letterSpacing:'-.3px'}}>Ingresos por propiedad</h2>
            {props.filter(p => p.status !== 'vacant').sort((a, b) => b.rent - a.rent).map(p => (
              <div key={p.id} style={{marginBottom:16}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:6, gap:10}}>
                  <span style={{fontSize:13, color:C.text, maxWidth:'60%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:500}}>{p.name}</span>
                  <span style={{fontSize:13, fontFamily:'Georgia, serif', fontWeight:700, color:C.accent}}>{fmt(p.rent)}</span>
                </div>
                <div style={{height:5, background:C.bg3, borderRadius:3, overflow:'hidden'}}>
                  <div style={{width:`${(p.rent / maxRent) * 100}%`, height:'100%', background:statusInfo[p.status].dot, borderRadius:3, transition:'width .5s'}} />
                </div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 18px', color:C.text, letterSpacing:'-.3px'}}>Resumen financiero</h2>
            {[
              { l:'Ingreso mensual bruto',    v:fmt(monthlyTotal),       c:C.success },
              { l:'Total depósitos',          v:fmt(totalDeposits),      c:C.accent  },
              { l:'Pagos pendientes',         v:fmt(pendingAmount),      c:C.warning },
              { l:'Ingreso anual proyectado', v:fmt(monthlyTotal * 12),  c:C.text    },
            ].map(r => (
              <div key={r.l} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:13, color:C.text2}}>{r.l}</span>
                <span style={{fontFamily:'Georgia, serif', fontWeight:700, color:r.c, fontSize:15, letterSpacing:'-.3px'}}>{r.v}</span>
              </div>
            ))}
            <div style={{marginTop:20, padding:18, background:`${C.success}10`, borderRadius:14, textAlign:'center', border:`1px solid ${C.success}25`}}>
              <div style={{fontSize:11, color:C.success, marginBottom:6, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase'}}>Tasa de ocupación</div>
              <div style={{fontSize:42, fontWeight:700, color:C.success, fontFamily:'Georgia, serif', letterSpacing:'-1.5px', lineHeight:1}}>
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

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", color:C.text, fontSize:14}}>

      {/* MODALS */}
      {modal === 'prop' && (
        <Modal title={editTarget ? 'Editar propiedad' : 'Nueva propiedad'} onSave={saveProperty} onClose={closeModal} C={C} S={S}>
          <Field label="Nombre de la propiedad *">
            <input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Apto 301 - Ed. Mirador" autoComplete="off" {...focusH} />
          </Field>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <Field label="Dirección"><input style={S.input} value={form.address||''} onChange={fv('address')} placeholder="Calle 50 #30-20, Medellín" autoComplete="off" {...focusH} /></Field>
            <Field label="Tipo">
              <select style={S.input} value={form.type||''} onChange={fv('type')} {...focusH}>
                <option value="">Seleccionar...</option>
                <option>Apartamento</option><option>Casa</option><option>Local</option><option>Bodega</option>
              </select>
            </Field>
            <Field label="Arriendo (COP) *"><input style={S.input} type="number" min="0" value={form.rent||''} onChange={fv('rent')} placeholder="1800000" {...focusH} /></Field>
            <Field label="Área"><input style={S.input} value={form.area||''} onChange={fv('area')} placeholder="65m²" autoComplete="off" {...focusH} /></Field>
            <Field label="Habitaciones"><input style={S.input} type="number" min="0" value={form.rooms||''} onChange={fv('rooms')} placeholder="2" {...focusH} /></Field>
            <Field label="Baños"><input style={S.input} type="number" min="1" value={form.baths||''} onChange={fv('baths')} placeholder="1" {...focusH} /></Field>
            <Field label="Arrendatario"><input style={S.input} value={form.tenant||''} onChange={fv('tenant')} placeholder="Nombre del inquilino" autoComplete="off" {...focusH} /></Field>
            <Field label="Teléfono"><input style={S.input} value={form.phone||''} onChange={fv('phone')} placeholder="310-000-0000" autoComplete="off" {...focusH} /></Field>
            <Field label="Inicio contrato"><input style={S.input} type="date" value={form.start||''} onChange={fv('start')} {...focusH} /></Field>
            <Field label="Fin contrato"><input style={S.input} type="date" value={form.end||''} onChange={fv('end')} {...focusH} /></Field>
          </div>
        </Modal>
      )}

      {modal === 'payment' && (
        <Modal title="Registrar pago" onSave={savePayment} onClose={closeModal} C={C} S={S}>
          <Field label="Propiedad *">
            <select style={S.input} value={form.prop||''} onChange={fv('prop')} {...focusH}>
              <option value="">Seleccionar propiedad...</option>
              {props.filter(p => p.status !== 'vacant').map(p => <option key={p.id} value={p.name}>{p.name} · {p.tenant}</option>)}
            </select>
          </Field>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            <Field label="Monto (COP) *"><input style={S.input} type="number" min="0" value={form.amount||''} onChange={fv('amount')} placeholder="1800000" {...focusH} /></Field>
            <Field label="Fecha"><input style={S.input} type="date" value={form.date||''} onChange={fv('date')} {...focusH} /></Field>
            <Field label="Método de pago">
              <select style={S.input} value={form.method||'Transferencia'} onChange={fv('method')} {...focusH}>
                <option>Transferencia</option><option>PSE</option><option>Efectivo</option><option>Cheque</option>
              </select>
            </Field>
            <Field label="Notas"><input style={S.input} value={form.notes||''} onChange={fv('notes')} placeholder="Opcional" autoComplete="off" {...focusH} /></Field>
          </div>
        </Modal>
      )}

      {modal === 'maint' && (
        <Modal title="Nuevo reporte de mantenimiento" onSave={saveMaintenance} onClose={closeModal} C={C} S={S}>
          <Field label="Propiedad *">
            <select style={S.input} value={form.prop||''} onChange={fv('prop')} {...focusH}>
              <option value="">Seleccionar propiedad...</option>
              {props.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </Field>
          <Field label="Descripción del problema *">
            <input style={S.input} value={form.issue||''} onChange={fv('issue')} placeholder="Descripción del daño o mantenimiento" autoComplete="off" {...focusH} />
          </Field>
          <Field label="Prioridad">
            <select style={S.input} value={form.priority||'medium'} onChange={fv('priority')} {...focusH}>
              <option value="high">Alta — Urgente</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </Field>
        </Modal>
      )}

      {/* CONFIRM */}
      {confirm && (
        <div style={{position:'fixed', inset:0, background:'rgba(28, 25, 23, .65)', backdropFilter:'blur(6px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={() => setConfirm(null)}>
          <div style={{background:C.bg2, borderRadius:20, padding:32, maxWidth:400, textAlign:'center', boxShadow:C.shadowLg, border:`1px solid ${C.border}`}} onClick={e => e.stopPropagation()}>
            <div style={{width:56, height:56, borderRadius:'50%', background:`${C.danger}15`, color:C.danger, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px'}}>
              {Icon.alert()}
            </div>
            <div style={{fontSize:18, fontWeight:700, marginBottom:6, color:C.text, fontFamily:'Georgia, serif', letterSpacing:'-.3px'}}>{confirm.msg}</div>
            <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Esta acción no se puede deshacer.</div>
            <div style={{display:'flex', gap:10, justifyContent:'center'}}>
              <button style={S.btnGhost} onClick={() => setConfirm(null)}>Cancelar</button>
              <button style={{...S.btnPri, background:C.danger}} onClick={confirm.onYes}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background:C.bg2, color:C.text, padding:'14px 20px', borderRadius:100, fontSize:14, fontWeight:600, zIndex:1001, boxShadow:C.shadowLg, display:'flex', alignItems:'center', gap:10, border:`1px solid ${C.border}`}}>
          <span style={{color: toast.type === 'error' ? C.danger : C.success, display:'flex'}}>
            {toast.type === 'error' ? Icon.alert() : Icon.check()}
          </span>
          {toast.msg}
        </div>
      )}

      {/* TOP BAR HORIZONTAL minimal */}
      <header style={{background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:'18px 32px', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(12px)'}}>
        <div style={{maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:40, height:40, borderRadius:12, background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>
              {Icon.building()}
            </div>
            <div>
              <div style={{fontWeight:800, fontSize:18, letterSpacing:'-.5px', color:C.text, fontFamily:'Georgia, serif'}}>RentTrack</div>
              <div style={{fontSize:11, color:C.text2, marginTop:1, letterSpacing:'.3px'}}>Gestión de arrendamientos</div>
            </div>
          </div>

          <nav style={{display:'flex', gap:4}}>
            {nav.map(n => {
              const active = page === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setPage(n.id)}
                  style={{
                    background: active ? C.text : 'transparent',
                    color:      active ? C.bg2 : C.text2,
                    border:'none', borderRadius:100, padding:'10px 18px',
                    fontSize:13, fontWeight: active ? 700 : 500,
                    cursor:'pointer', fontFamily:'inherit',
                    display:'inline-flex', alignItems:'center', gap:8,
                    transition:'all .15s', whiteSpace:'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.bg3; e.currentTarget.style.color = C.text; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text2; }}}
                >
                  <span style={{display:'flex', opacity:.85}}>{n.icon()}</span>
                  {n.label}
                </button>
              );
            })}
          </nav>

          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <div style={{padding:'8px 14px', background:C.bg3, borderRadius:100, fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:8}}>
              <span style={{color:C.text3, fontSize:10, letterSpacing:'.4px', textTransform:'uppercase'}}>Mes</span>
              <span style={{color:C.success, fontFamily:'Georgia, serif', fontSize:14}}>{fmt(monthlyTotal)}</span>
            </div>
            <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} aria-label="Tema" style={{background:C.bg3, border:'none', color:C.text, width:38, height:38, borderRadius:'50%', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
              {theme === 'light' ? Icon.moon() : Icon.sun()}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main style={{maxWidth:1400, margin:'0 auto', padding:'32px 32px 60px'}}>
        {pageRender()}
      </main>
    </div>
  );
}
