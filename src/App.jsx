import { useState, useMemo, useCallback } from 'react';

import { INIT_PROPS, INIT_PAYMENTS, INIT_MAINT } from './data/seed.js';
import { themes } from './data/themes.js';
import { makeStyles, makeFocusHandlers } from './utils/styles.js';
import { downloadCSV } from './utils/csv.js';
import { nextId } from './utils/ids.js';
import { useToast } from './hooks/useToast.js';

import { Header } from './components/Header.jsx';
import { Modal } from './components/Modal.jsx';
import { ConfirmDialog } from './components/ConfirmDialog.jsx';
import { Toast } from './components/Toast.jsx';
import { PropertyForm } from './components/PropertyForm.jsx';
import { PaymentForm } from './components/PaymentForm.jsx';
import { MaintenanceForm } from './components/MaintenanceForm.jsx';

import { Dashboard } from './pages/Dashboard.jsx';
import { Properties } from './pages/Properties.jsx';
import { Payments } from './pages/Payments.jsx';
import { Maintenance } from './pages/Maintenance.jsx';
import { Reports } from './pages/Reports.jsx';

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
  const [confirm, setConfirm]           = useState(null);

  const [toast, showToast] = useToast();

  const C = themes[theme];
  const S = useMemo(() => makeStyles(C), [C]);
  const focusH = useMemo(() => makeFocusHandlers(C), [C]);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const closeModal = useCallback(() => { setModal(null); setEditTarget(null); setForm({}); }, []);

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
    downloadCSV(data, name);
    showToast(`${name}.csv descargado`);
  };

  const pages = {
    dashboard: (
      <Dashboard
        props={props} payments={payments} maint={maint}
        activeProps={activeProps} overdueProps={overdueProps} vacantProps={vacantProps}
        monthlyTotal={monthlyTotal} pendingAmount={pendingAmount}
        C={C} S={S}
      />
    ),
    properties: (
      <Properties
        props={props} filteredProps={filteredProps}
        search={search} onSearch={setSearch} filterStatus={filterStatus} onFilter={setFilterStatus}
        onExport={() => exportCSV(filteredProps, 'propiedades')}
        onNew={() => { setModal('prop'); setEditTarget(null); setForm({}); }}
        onEdit={p => { setModal('prop'); setEditTarget(p); setForm({ ...p }); }}
        onDelete={delProperty}
        C={C} S={S} focusH={focusH}
      />
    ),
    payments: (
      <Payments
        payments={payments}
        onExport={() => exportCSV(payments, 'pagos')}
        onNew={() => { setModal('payment'); setForm({}); }}
        onMarkPaid={markPaid}
        C={C} S={S}
      />
    ),
    maintenance: (
      <Maintenance
        maint={maint}
        onNew={() => { setModal('maint'); setForm({}); }}
        onClose={closeMaint}
        C={C} S={S}
      />
    ),
    reports: (
      <Reports
        props={props} monthlyTotal={monthlyTotal} pendingAmount={pendingAmount}
        activeProps={activeProps} overdueProps={overdueProps}
        C={C} S={S}
      />
    ),
  };

  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", color:C.text, fontSize:14}}>

      {/* MODALS */}
      {modal === 'prop' && (
        <Modal title={editTarget ? 'Editar propiedad' : 'Nueva propiedad'} onSave={saveProperty} onClose={closeModal} C={C} S={S}>
          <PropertyForm form={form} fv={fv} S={S} focusH={focusH} />
        </Modal>
      )}

      {modal === 'payment' && (
        <Modal title="Registrar pago" onSave={savePayment} onClose={closeModal} C={C} S={S}>
          <PaymentForm form={form} fv={fv} props={props} S={S} focusH={focusH} />
        </Modal>
      )}

      {modal === 'maint' && (
        <Modal title="Nuevo reporte de mantenimiento" onSave={saveMaintenance} onClose={closeModal} C={C} S={S}>
          <MaintenanceForm form={form} fv={fv} props={props} S={S} focusH={focusH} />
        </Modal>
      )}

      <ConfirmDialog confirm={confirm} onCancel={() => setConfirm(null)} C={C} S={S} />
      <Toast toast={toast} C={C} />

      <Header
        page={page} onNavigate={setPage}
        theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        monthlyTotal={monthlyTotal} C={C}
      />

      {/* MAIN */}
      <main style={{maxWidth:1400, margin:'0 auto', padding:'32px 32px 60px'}}>
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}
