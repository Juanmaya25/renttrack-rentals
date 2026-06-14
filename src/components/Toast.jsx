import { Icon } from './icons.jsx';

export function Toast({ toast, C }) {
  if (!toast) return null;
  return (
    <div role="status" aria-live="polite" style={{position:'fixed', bottom:24, right:24, background:C.bg2, color:C.text, padding:'14px 20px', borderRadius:100, fontSize:14, fontWeight:600, zIndex:1001, boxShadow:C.shadowLg, display:'flex', alignItems:'center', gap:10, border:`1px solid ${C.border}`}}>
      <span style={{color: toast.type === 'error' ? C.danger : C.success, display:'flex'}}>
        {toast.type === 'error' ? Icon.alert() : Icon.check()}
      </span>
      {toast.msg}
    </div>
  );
}
