export const site = {
  name: "Lateral Zinkin",
  legalName: "Lateral Zinkin, S.L.N.E.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lateralzinkin.vercel.app",
  email: "lateral@lateralzinkin.com",
  phone: "+34 636 544 929",
  phoneHref: "tel:+34636544929",
  whatsapp: "https://wa.me/34636544929",
  address: "Calle Manuel Cortina, 11 · 28010 Madrid",
  instagram: "https://www.instagram.com/lateralzinkin/",
  linkedin: "https://www.linkedin.com/in/nacholatorretambo/",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
  substackUrl: process.env.NEXT_PUBLIC_SUBSTACK_URL || "https://lateralzinkin.substack.com",
  founded: 2007,
  // Sube la foto a public/img/nacho.jpg y pon aquí "/img/nacho.jpg"
  founderPhoto: "",
  // Vídeos de las historias laterales (MP4 en public/video/). Si están vacíos se usan las fotos.
  // Codificar con un fotograma clave en cada frame para que el scroll sea fluido:
  // ffmpeg -i in.mp4 -vf scale=1600:-2,format=gray -g 1 -an -movflags +faststart out.mp4
  lateralVideos: { fosbury: "", cruyff: "", hendrix: "" } as Record<string, string>,
};

// Clientes reales publicados en lateralzinkin.com
export const clients = [
  "Editorial Planeta",
  "Lonely Planet",
  "Museo Thyssen-Bornemisza",
  "Sociedad Geográfica Española",
  "Escuela de Escritores",
  "Turismo Castilla-La Mancha",
  "Viajes Nieva",
  "Viena Capellanes",
  "Bennet & Rey",
  "Valentín Gamazo Abogados",
  "Camacho & Aparicio",
  "LC Rodrigo Abogados",
  "FTr Consultants",
  "Sergat",
  "ComeMai",
  "El Club de la Pizza",
  "Fundación María Wolff",
  "ElPeriódicoDeTuDía",
  "Promedios",
  "Studiainitalia",
  "María Moro Interiorismo",
  "Arquitectura Negra",
];
