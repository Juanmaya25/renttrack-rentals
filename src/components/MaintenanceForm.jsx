import { Field } from './Modal.jsx';

export function MaintenanceForm({ form, fv, props, S, focusH }) {
  return (
    <>
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
    </>
  );
}
