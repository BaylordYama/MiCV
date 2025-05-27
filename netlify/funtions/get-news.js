// netlify/functions/get-news.js

const realNewsData = [
  {
    "id": "tech-news-xataka-001",
    "headline": "NVIDIA presenta chip para IA más económico para China ante restricciones de EEUU",
    "image": "https://placehold.co/800x450/1a1a1a/33ccff?text=NVIDIA+Chip+China",
    "sourceName": "Xataka",
    "datePublished": "2024-05-27", 
    "summary": "NVIDIA adapta su estrategia para el mercado chino con un chip de IA más accesible, respondiendo a las restricciones de EEUU sobre semiconductores de alta gama.",
    "originalUrl": "https://www.xataka.com/empresas-y-economia/nvidia-lista-para-inundar-mercado-chino-su-arma-chip-para-ia-mucho-barato-que-su-h20-prohibido-eeuu" 
  },
  {
    "id": "tech-news-infobae-001",
    "headline": "OpenAI actualiza Operator con modelo o3 para investigaciones en Internet",
    "image": "https://placehold.co/800x450/1a1a1a/33ccff?text=OpenAI+Operator",
    "sourceName": "Infobae Tecnología",
    "datePublished": "2024-05-24", 
    "summary": "OpenAI integra su nuevo modelo de razonamiento, o3, en su agente Operator para optimizar tareas complejas en programación, ciencia y potenciar investigaciones online.",
    "originalUrl": "https://www.infobae.com/tecno/2024/05/24/openai-actualiza-operator-con-el-modelo-de-razonamiento-o3-para-emprender-investigaciones-exhaustivas-en-internet/"
  },
  {
    "id": "tech-news-elpais-001",
    "headline": "IA recrea los rostros de esclavizados en Brasil del siglo XIX",
    "image": "https://placehold.co/800x450/1a1a1a/33ccff?text=IA+Rostros+Brasil",
    "sourceName": "El País (Tecnología)",
    "datePublished": "2024-05-26", 
    "summary": "Exposición en São Paulo usa IA para reconstruir rostros de personas esclavizadas, basándose en descripciones históricas de un abogado abolicionista.",
    "originalUrl": "https://elpais.com/america-futura/2024-05-26/la-inteligencia-artificial-recrea-los-rostros-de-esclavizados-en-brasil-gracias-a-las-descripciones-de-un-abolicionista.html"
  },
  {
    "id": "tech-news-bbc-001",
    "headline": "Chatbots como terapeutas: riesgos y beneficios de la psicología con IA",
    "image": "https://placehold.co/800x450/1a1a1a/33ccff?text=IA+Psicologia",
    "sourceName": "BBC News Mundo",
    "datePublished": "2024-05-27", 
    "summary": "Análisis del uso de chatbots de IA como apoyo terapéutico, explorando beneficios para la salud mental, riesgos inherentes y consideraciones éticas.",
    "originalUrl": "https://www.bbc.com/mundo/articles/c4n17qdy8jlo" 
  },
  {
    "id": "tech-news-mit-001",
    "headline": "MIT anuncia iniciativa para nueva manufactura impulsada por IA",
    "image": "https://placehold.co/800x450/1a1a1a/33ccff?text=MIT+IA+Manufactura",
    "sourceName": "MIT News",
    "datePublished": "2024-05-27",
    "summary": "El MIT lanza una iniciativa a nivel de instituto para impulsar la industria y crear empleos mediante la innovación en sectores vitales de manufactura, con un fuerte componente de IA.",
    "originalUrl": "https://news.mit.edu/2024/mit-announces-initiative-new-manufacturing-0527"
  }
];

exports.handler = async function(event, context) {
  await new Promise(resolve => setTimeout(resolve, 300)); 

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", 
    },
    body: JSON.stringify(realNewsData),
  };
};
