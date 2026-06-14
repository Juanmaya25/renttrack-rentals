import { Field } from './Modal.jsx';

export function PropertyForm({ form, fv, S, focusH }) {
  return (
    <>
      <Field label="Nombre de la propiedad *">
        <input style={S.input} value={form.name||''} onChange={fv('name')} placeholder="Apto 301 - Ed. Mirador" autoComplete="off" {...focusH} />
      </Field>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14}}>
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
    </>
  );
}
