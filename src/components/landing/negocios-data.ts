export interface Tarea {
  tarea: string;
  icono: string;
  horas: number;
}

export interface Negocio {
  id: string;
  label: string;
  icono: string;
  mensajes: string[];
  tareas: Tarea[];
}

export const NEGOCIOS: Negocio[] = [
  {
    id: "restaurante",
    label: "Restaurante",
    icono: "plate",
    mensajes: [
      "¿Tienen domicilio hoy?",
      "¿A qué hora cierran?",
      "Quiero reservar para 4",
      "¿Aceptan Nequi?",
      "¿Cuál es el menú del día?",
      "¿Hacen pedidos grandes?",
    ],
    tareas: [
      { tarea: 'Responder "¿tienen domicilio?" por WhatsApp', icono: "chat", horas: 6 },
      { tarea: "Tomar reservas por teléfono", icono: "calendar", horas: 4 },
      { tarea: "Pasar pedidos al Excel de inventario", icono: "sheet", horas: 5 },
      { tarea: "Publicar el menú del día en redes", icono: "megaphone", horas: 3 },
      { tarea: "Responder reseñas de Google", icono: "star", horas: 2 },
    ],
  },
  {
    id: "clinica",
    label: "Clínica / Salud",
    icono: "health",
    mensajes: [
      "¿Tienen cita para mañana?",
      "¿Aceptan mi seguro?",
      "¿Ya están mis resultados?",
      "Necesito reprogramar",
      "¿Cuánto cuesta la consulta?",
    ],
    tareas: [
      { tarea: "Confirmar citas por WhatsApp", icono: "chat", horas: 5 },
      { tarea: "Recordar pagos pendientes", icono: "card", horas: 3 },
      { tarea: "Actualizar historias en Excel", icono: "sheet", horas: 4 },
      { tarea: "Responder preguntas de horarios", icono: "chat", horas: 4 },
      { tarea: "Enviar resultados de exámenes", icono: "doc", horas: 3 },
    ],
  },
  {
    id: "inmobiliaria",
    label: "Inmobiliaria",
    icono: "home",
    mensajes: [
      "¿Sigue disponible el apartamento?",
      "¿Puedo verlo este finde?",
      "¿Cuál es el precio final?",
      "¿Incluye parqueadero?",
      "¿Aceptan mascotas?",
    ],
    tareas: [
      { tarea: "Responder consultas de propiedades", icono: "chat", horas: 7 },
      { tarea: "Agendar visitas por teléfono", icono: "calendar", horas: 5 },
      { tarea: "Actualizar listados en portales", icono: "sheet", horas: 4 },
      { tarea: "Enviar documentos a clientes", icono: "doc", horas: 3 },
      { tarea: "Dar seguimiento a leads fríos", icono: "star", horas: 4 },
    ],
  },
  {
    id: "tienda",
    label: "Tienda online",
    icono: "bag",
    mensajes: [
      "¿Dónde está mi pedido?",
      "¿Tienen talla M?",
      "¿Hacen cambios?",
      "¿Cuánto tarda el envío?",
      "¿Tienen en otro color?",
    ],
    tareas: [
      { tarea: "Responder dudas de pedidos", icono: "chat", horas: 6 },
      { tarea: "Actualizar inventario en Excel", icono: "sheet", horas: 4 },
      { tarea: "Enviar confirmaciones de envío", icono: "package", horas: 3 },
      { tarea: "Responder reclamos", icono: "chat", horas: 3 },
      { tarea: "Publicar catálogo en redes", icono: "megaphone", horas: 3 },
    ],
  },
  {
    id: "agencia",
    label: "Agencia / Servicios",
    icono: "briefcase",
    mensajes: [
      "¿Cuándo me envían la cotización?",
      "¿Ya está el reporte?",
      "¿Podemos agendar una llamada?",
      "¿Cuál es el estado del proyecto?",
      "¿Me confirman la reunión?",
    ],
    tareas: [
      { tarea: "Armar cotizaciones a mano", icono: "sheet", horas: 6 },
      { tarea: "Dar seguimiento a propuestas", icono: "chat", horas: 4 },
      { tarea: "Consolidar reportes de clientes", icono: "doc", horas: 5 },
      { tarea: "Agendar reuniones por correo", icono: "calendar", horas: 3 },
      { tarea: "Facturar manualmente", icono: "card", horas: 3 },
    ],
  },
  {
    id: "otro",
    label: "Otro",
    icono: "spark",
    mensajes: [
      "¿Están disponibles?",
      "¿Cuánto cuesta?",
      "¿Cuándo puedo pasar?",
      "¿Tienen para hoy?",
      "¿Me confirman?",
    ],
    tareas: [
      { tarea: "Responder mensajes repetitivos", icono: "chat", horas: 6 },
      { tarea: "Mover datos entre hojas de cálculo", icono: "sheet", horas: 4 },
      { tarea: "Agendar citas o reuniones", icono: "calendar", horas: 4 },
      { tarea: "Dar seguimiento a clientes", icono: "star", horas: 4 },
      { tarea: "Armar reportes al final del mes", icono: "doc", horas: 3 },
    ],
  },
];

export const CASOS = [
  { antes: "Responder WhatsApp uno por uno", despues: "Respuestas al instante, 24/7" },
  { antes: "Pasar datos de un Excel a otro", despues: "La información fluye sola entre tus sistemas" },
  { antes: "Perseguir clientes para cobrar", despues: "Recordatorios que se envían solos" },
  { antes: "Agendar citas por teléfono", despues: "Tu calendario se llena sin que lo toques" },
  { antes: "Reportes de fin de mes a mano", despues: "El reporte llega a tu correo, listo" },
  { antes: "Publicar en redes todos los días", despues: "Tu contenido sale puntual, siempre" },
];
