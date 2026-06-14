import { Icon } from './icons.jsx';

export function ConfirmDialog({ confirm, onCancel, C, S }) {
  if (!confirm) return null;
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(28, 25, 23, .65)', backdropFilter:'blur(6px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16}} onClick={onCancel}>
      <div style={{background:C.bg2, borderRadius:20, padding:32, maxWidth:400, textAlign:'center', boxShadow:C.shadowLg, border:`1px solid ${C.border}`}} onClick={e => e.stopPropagation()}>
        <div style={{width:56, height:56, borderRadius:'50%', background:`${C.danger}15`, color:C.danger, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px'}}>
          {Icon.alert()}
        </div>
        <div style={{fontSize:18, fontWeight:700, marginBottom:6, color:C.text, fontFamily:'Georgia, serif', letterSpacing:'-.3px'}}>{confirm.msg}</div>
        <div style={{fontSize:13, color:C.text2, marginBottom:24}}>Esta acción no se puede deshacer.</div>
        <div style={{display:'flex', gap:10, justifyContent:'center'}}>
          <button style={S.btnGhost} onClick={onCancel}>Cancelar</button>
          <button style={{...S.btnPri, background:C.danger}} onClick={confirm.onYes}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
