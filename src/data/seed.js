// ─── DATA SEED ──────────────────────────────────────────────────────
export const INIT_PROPS = [
  { id:1, name:'Apto 301 - Ed. Mirador',    address:'Calle 50 #30-20, Medellín',   rent:1800000, tenant:'Carlos Rodríguez', phone:'310-111-2222', status:'active',  due:1,  paid:true,  deposit:3600000, start:'2024-03-01', end:'2026-03-01', area:'65m²',  rooms:2, type:'Apartamento', baths:2 },
  { id:2, name:'Casa 45 - Laureles',         address:'Carrera 76 #45-10, Medellín', rent:2500000, tenant:'Ana García',       phone:'310-333-4444', status:'active',  due:5,  paid:false, deposit:5000000, start:'2023-08-01', end:'2026-08-01', area:'120m²', rooms:3, type:'Casa',         baths:3 },
  { id:3, name:'Local 12 - CC Punto',        address:'Av. El Poblado #10-50',       rent:4200000, tenant:'Tienda Moda XYZ',  phone:'310-555-6666', status:'overdue', due:1,  paid:false, deposit:8400000, start:'2023-01-01', end:'2026-01-01', area:'45m²',  rooms:0, type:'Local',        baths:1 },
  { id:4, name:'Apto 502 - Torres Norte',    address:'Calle 80 #20-15, Medellín',   rent:1600000, tenant:'María Torres',     phone:'310-777-8888', status:'active',  due:10, paid:true,  deposit:3200000, start:'2024-07-01', end:'2026-07-01', area:'55m²',  rooms:2, type:'Apartamento', baths:1 },
  { id:5, name:'Bodega Industrial - Itagüí', address:'Zona Industrial, Itagüí',     rent:5800000, tenant:'',                  phone:'',             status:'vacant',  due:0,  paid:false, deposit:0,       start:'',           end:'',           area:'300m²', rooms:0, type:'Bodega',       baths:1 },
  { id:6, name:'Casa Campestre - Rionegro',  address:'Vereda El Tablazo, Rionegro', rent:3200000, tenant:'Pedro Vargas',     phone:'310-999-0000', status:'active',  due:15, paid:true,  deposit:6400000, start:'2024-01-01', end:'2026-01-01', area:'200m²', rooms:4, type:'Casa',         baths:3 },
];

export const INIT_PAYMENTS = [
  { id:1, prop:'Apto 301 - Ed. Mirador',    tenant:'Carlos Rodríguez', amount:1800000, date:'2026-05-01', method:'Transferencia', status:'paid' },
  { id:2, prop:'Apto 502 - Torres Norte',   tenant:'María Torres',     amount:1600000, date:'2026-05-01', method:'PSE',           status:'paid' },
  { id:3, prop:'Casa Campestre - Rionegro', tenant:'Pedro Vargas',     amount:3200000, date:'2026-04-30', method:'Transferencia', status:'paid' },
  { id:4, prop:'Casa 45 - Laureles',        tenant:'Ana García',       amount:2500000, date:'2026-05-05', method:'Pendiente',     status:'pending' },
  { id:5, prop:'Local 12 - CC Punto',       tenant:'Tienda Moda XYZ',  amount:4200000, date:'2026-04-01', method:'—',             status:'overdue' },
];

export const INIT_MAINT = [
  { id:1, prop:'Casa 45 - Laureles',       issue:'Goteras en el techo',          priority:'high',   status:'open',     date:'2026-04-28', tech:'' },
  { id:2, prop:'Local 12 - CC Punto',      issue:'Puerta eléctrica dañada',      priority:'high',   status:'progress', date:'2026-04-25', tech:'Eléctricos Norte' },
  { id:3, prop:'Apto 301 - Ed. Mirador',   issue:'Cambio de grifo cocina',       priority:'low',    status:'done',     date:'2026-04-20', tech:'Plomería Rápida' },
  { id:4, prop:'Apto 502 - Torres Norte',  issue:'Pintura habitación principal', priority:'medium', status:'open',     date:'2026-04-29', tech:'' },
];

export const MONTHLY_INCOME = [
  { mes:'Oct', total:11400000 }, { mes:'Nov', total:12800000 }, { mes:'Dic', total:13100000 },
  { mes:'Ene', total:11800000 }, { mes:'Feb', total:12600000 }, { mes:'Mar', total:13400000 },
  { mes:'Abr', total:13900000 }, { mes:'May', total:14900000 },
];
