import { Field } from './Modal.jsx';

export function PaymentForm({ form, fv, props, S, focusH }) {
  return (
    <>
      <Field label="Propiedad *">
        <select style={S.input} value={form.prop||''} onChange={fv('prop')} {...focusH}>
          <option value="">Seleccionar propiedad...</option>
          {props.filter(p => p.status !== 'vacant').map(p => <option key={p.id} value={p.name}>{p.name} · {p.tenant}</option>)}
        </select>
      </Field>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14}}>
        <Field label="Monto (COP) *"><input style={S.input} type="number" min="0" value={form.amount||''} onChange={fv('amount')} placeholder="1800000" {...focusH} /></Field>
        <Field label="Fecha"><input style={S.input} type="date" value={form.date||''} onChange={fv('date')} {...focusH} /></Field>
        <Field label="Método de pago">
          <select style={S.input} value={form.method||'Transferencia'} onChange={fv('method')} {...focusH}>
            <option>Transferencia</option><option>PSE</option><option>Efectivo</option><option>Cheque</option>
          </select>
        </Field>
        <Field label="Notas"><input style={S.input} value={form.notes||''} onChange={fv('notes')} placeholder="Opcional" autoComplete="off" {...focusH} /></Field>
      </div>
    </>
  );
}
