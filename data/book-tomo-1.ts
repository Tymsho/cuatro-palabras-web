export interface Chapter {
  id: string
  number?: string
  title: string
  fourWords?: string[]
  pageStart: number
  pageEnd: number
  isFree: boolean
  content: {
    type: 'paragraph' | 'quote' | 'divider' | 'heading' | 'meta'
    text: string
    author?: string
  }[]
}

export interface Book {
  title: string
  tomo: string
  subtitle: string
  author: string
  totalPages: number
  freeUpToPage: number
  freeUpToChapterId: string
  chapters: Chapter[]
}

/**
 * ESTRUCTURA DEL TOMO I
 *
 * NOTA DE SEGURIDAD Y DERECHOS DE AUTOR:
 * En este archivo solo reside el contenido de la muestra gratuita (Portada al Capítulo 1).
 * Los textos íntegros de los Capítulos 2 al 10 y el Epílogo se encuentran protegidos
 * en la base de datos de Supabase y NUNCA se suben al repositorio de Git.
 * Cuando un usuario autenticado y autorizado accede, el servidor consulta Supabase e
 * inyecta dinámicamente el contenido protegido.
 */
export const TOMO_1: Book = {
  title: 'Cuatro Palabras',
  tomo: 'Tomo I',
  subtitle: 'Comprender. Aceptar. Crecer. Avanzar.',
  author: 'Maximiliano Denis Urquiola',
  totalPages: 37,
  freeUpToPage: 8,
  freeUpToChapterId: 'capitulo-1',
  chapters: [
    {
      id: 'portada',
      title: 'Portada',
      pageStart: 1,
      pageEnd: 1,
      isFree: true,
      content: [
        { type: 'meta', text: 'TOMO I' },
        { type: 'heading', text: 'Cuatro Palabras' },
        { type: 'paragraph', text: 'Comprender. Aceptar. Crecer. Avanzar.' },
        { type: 'meta', text: 'Maximiliano Denis Urquiola' },
      ],
    },
    {
      id: 'dedicatoria',
      title: 'Dedicatoria',
      pageStart: 2,
      pageEnd: 2,
      isFree: true,
      content: [
        { type: 'quote', text: 'A quienes sostuvieron esto conmigo.' },
        {
          type: 'paragraph',
          text: 'A mi familia, que estuvo presente incluso en los tramos en los que yo mismo dudaba de tener algo para decir.',
        },
        {
          type: 'paragraph',
          text: 'A mis amigos, que me regalaron ánimo y energía cada vez que esta idea todavía era apenas un borrador de intenciones.',
        },
        {
          type: 'paragraph',
          text: 'Este libro también es de ustedes. Gracias por creer, incluso antes de que hubiera algo tangible en qué creer.',
        },
      ],
    },
    {
      id: 'prologo',
      title: 'Prólogo',
      pageStart: 4,
      pageEnd: 5,
      isFree: true,
      content: [
        {
          type: 'paragraph',
          text: 'Todo empezó con una pregunta simple, casi ingenua: ¿cuántas palabras hacen falta para nombrar aquello que nos atraviesa?',
        },
        {
          type: 'paragraph',
          text: 'La respuesta, con el tiempo, se fue reduciendo. No hacían falta grandes discursos ni explicaciones extensas. A veces alcanzaba con cuatro palabras, puestas una al lado de la otra, para que algo hiciera clic.',
        },
        {
          type: 'paragraph',
          text: 'Cuatro Palabras nació de esa idea. De tomar conceptos que, por separado, parecen no tener demasiado en común, y ponerlos a convivir en un mismo espacio hasta que empiezan a rozarse, a tensionarse, a decir algo que ninguno de los cuatro decía por sí solo.',
        },
        {
          type: 'paragraph',
          text: 'Resiliencia, familia, olvido, perdón. Vida, paz, situaciones, amor. Cada combinación es, en el fondo, una pequeña ecuación filosófica: cuatro variables que, combinadas, producen una pregunta nueva, una contradicción incómoda, o una manera distinta de mirar algo que creíamos ya conocido.',
        },
        {
          type: 'paragraph',
          text: 'No busqué escribir un libro de respuestas. Busqué, más bien, construir un lugar donde ciertas palabras pudieran finalmente encontrarse, y donde esa reunión provocara en el lector lo mismo que provocó en mí mientras escribía: una pausa, una pregunta, un pequeño desacomodo necesario.',
        },
        {
          type: 'paragraph',
          text: 'Este primer tomo reúne diez de esas combinaciones. Diez maneras de mirar aquello que, tarde o temprano, todos terminamos enfrentando:',
        },
        {
          type: 'paragraph',
          text: 'lo que sentimos, lo que hacemos, lo que tememos, lo que buscamos y lo que, todavía, no terminamos de entender del todo.',
        },
        {
          type: 'quote',
          text: 'No hace falta leerlo en orden. No hace falta estar de acuerdo con cada palabra. Alcanza con llegar hasta acá dispuesto a que cuatro palabras, puestas juntas, te corran un poco el lugar desde donde mirás las cosas.',
        },
      ],
    },
    {
      id: 'introduccion',
      title: 'Introducción',
      pageStart: 6,
      pageEnd: 6,
      isFree: true,
      content: [
        {
          type: 'paragraph',
          text: 'Leer Cuatro Palabras no es leer un libro de definiciones.',
        },
        {
          type: 'paragraph',
          text: 'Cada capítulo toma cuatro conceptos que, de forma aislada, podrías explicar sin dificultad. Sabés lo que es el amor. Sabés lo que es el miedo. Sabés, o creés saber, lo que significan la familia, el trabajo, el silencio.',
        },
        {
          type: 'paragraph',
          text: 'Pero acá esas palabras no aparecen solas. Aparecen en grupos de cuatro, obligadas a convivir en el mismo espacio, y es en esa convivencia donde ocurre lo interesante: una tensión que no esperabas, una pregunta que no te habías hecho, una perspectiva que quizás nunca habías considerado.',
        },
        {
          type: 'paragraph',
          text: 'Este libro no pretende decirte qué pensar sobre la resiliencia, el trabajo o el amor. Pretende, simplemente, poner cuatro palabras frente a vos y dejar que sea tu propia lectura la que decida qué hacer con la tensión que generan.',
        },
        {
          type: 'quote',
          text: 'No hay una única forma correcta de leer lo que sigue. Cada capítulo es una invitación a detenerte un momento en cuatro palabras que, juntas, quizás digan algo que todavía no habías terminado de nombrar.',
        },
      ],
    },
    {
      id: 'capitulo-1',
      number: 'Capítulo I',
      title: 'Resiliencia, Familia, Olvido, Perdón',
      fourWords: ['Resiliencia', 'Familia', 'Olvido', 'Perdón'],
      pageStart: 7,
      pageEnd: 8,
      isFree: true,
      content: [
        {
          type: 'paragraph',
          text: 'Desarrollando nuestra conciencia, llega un punto en el que comenzamos a preguntarnos por qué somos lo que somos. Por qué actuamos, sentimos y reaccionamos de determinada manera; por qué, en definitiva, existimos de la forma en que lo hacemos.',
        },
        {
          type: 'paragraph',
          text: 'Entonces surge una pregunta aún más profunda: ¿somos simplemente el resultado de aquello que hemos vivido o, tal vez, somos un conjunto de fragmentos provenientes de quienes estuvieron junto a nosotros?',
        },
        {
          type: 'paragraph',
          text: 'Es delicado analizarlo, puede resultar doloroso comprenderlo y, en ocasiones, perturbador recordarlo. A pesar de ello, estamos destinados a aceptarlo, porque todo aquello forma parte de nosotros. No podemos obligar al olvido o al silencio a realizar ese trabajo por nosotros. Son los hechos y las circunstancias que nos forman.',
        },
        {
          type: 'paragraph',
          text: 'Cada experiencia constituye un aprendizaje para la vida. Una lágrima derramada hoy puede evitar llantos y equivocaciones mañana. El abanico de circunstancias capaces de afectarnos es tan amplio que, incluso, algunas pueden trascender generaciones y alcanzar a quienes ni siquiera estuvieron presentes cuando ocurrieron.',
        },
        {
          type: 'paragraph',
          text: 'Para explicarlo de alguna manera, o intentar encontrarle una lógica, la crianza constituye una de las bases fundamentales de todo esto. Queda en nosotros cómo se desarrolla esa influencia: puede provenir de nuestra propia crianza, pero también de la de nuestros padres, abuelos o de quienes nos rodean.',
        },
        {
          type: 'paragraph',
          text: 'De una u otra forma, terminamos formando parte de esta cadena. Y, como en toda cadena, cada eslabón puede encontrarse en un estado diferente. Algunos pueden estar más oxidados que otros, ya sea por su exposición al tiempo, por las circunstancias que atravesaron o por el cuidado que recibieron.',
        },
        {
          type: 'paragraph',
          text: 'Si aquello que nos rodea termina oxidándonos, queda en nosotros decidir qué hacer con esa marca: encontrar una solución, reparar el daño o, simplemente, formar el principio de una nueva cadena.',
        },
        {
          type: 'paragraph',
          text: 'Pero es imposible dejar que la oxidación desaparezca únicamente a través del olvido. Siempre quedará alguna marca en aquel eslabón. Y esa marca, lejos de ser necesariamente una imperfección, nos otorgará una particularidad: aquella que, en parte, nos determina como seres únicos.',
        },
        {
          type: 'paragraph',
          text: 'La complejidad de los sucesos puede hacer que sus efectos aparezcan años después, ya sea porque fueron difíciles de detectar, porque no supimos comprenderlos en su momento o simplemente porque nunca nos detuvimos a analizarlos.',
        },
        {
          type: 'paragraph',
          text: 'La mejor respuesta ante esa oxidación es la resiliencia: aprender a hacer que cada tormenta, cada exposición y cada efecto que haya provocado una marca en nuestro eslabón se convierta en parte de nuestro aprendizaje.',
        },
        {
          type: 'paragraph',
          text: 'Que aquello que nos dañó nos proporcione el conocimiento necesario para evitar repetir errores cometidos anteriormente, o incluso para reconocer y evitar aquellos errores que otros eslabones cometieron y que podrían terminar oxidándonos.',
        },
        {
          type: 'paragraph',
          text: 'Todo esto llevará tiempo. Reparar un eslabón no es un proceso inmediato, y algunas marcas quizá permanezcan para siempre. Pero quizás ese sea precisamente el sentido de aprender a convivir con ellas: no borrar aquello que fuimos, sino utilizarlo para construir aquello que seremos.',
        },
        {
          type: 'quote',
          text: 'Porque todo este proceso, todo este aprendizaje y toda esta transformación tienen un propósito: evitar oxidar el eslabón siguiente.',
        },
      ],
    },
    // CAPÍTULOS PROTEGIDOS (El contenido de texto reside exclusivamente en la base de datos de Supabase)
    {
      id: 'capitulo-2',
      number: 'Capítulo II',
      title: 'Vida, Paz, Situaciones, Amor',
      fourWords: ['Vida', 'Paz', 'Situaciones', 'Amor'],
      pageStart: 9,
      pageEnd: 11,
      isFree: false,
      content: [],
    },
    {
      id: 'capitulo-3',
      number: 'Capítulo III',
      title: 'Pasado, Presente, Futuro, Nada',
      fourWords: ['Pasado', 'Presente', 'Futuro', 'Nada'],
      pageStart: 12,
      pageEnd: 14,
      isFree: false,
      content: [],
    },
    {
      id: 'capitulo-4',
      number: 'Capítulo IV',
      title: 'Trabajo, Vocación, Cansancio, Propósito',
      fourWords: ['Trabajo', 'Vocación', 'Cansancio', 'Propósito'],
      pageStart: 15,
      pageEnd: 17,
      isFree: false,
      content: [],
    },
    {
      id: 'capitulo-5',
      number: 'Capítulo V',
      title: 'Dinero, Deseo, Miedo, Suficiencia',
      fourWords: ['Dinero', 'Deseo', 'Miedo', 'Suficiencia'],
      pageStart: 18,
      pageEnd: 19,
      isFree: false,
      content: [],
    },
    {
      id: 'capitulo-6',
      number: 'Capítulo VI',
      title: 'Guerra, Enemigo, Silencio, Humanidad',
      fourWords: ['Guerra', 'Enemigo', 'Silencio', 'Humanidad'],
      pageStart: 20,
      pageEnd: 22,
      isFree: false,
      content: [],
    },
    {
      id: 'capitulo-7',
      number: 'Capítulo VII',
      title: 'Emoción, Cuerpo, Silencio, Verdad',
      fourWords: ['Emoción', 'Cuerpo', 'Silencio', 'Verdad'],
      pageStart: 23,
      pageEnd: 25,
      isFree: false,
      content: [],
    },
    {
      id: 'capitulo-8',
      number: 'Capítulo VIII',
      title: 'Ser, Vacío, Sentido, Asombro',
      fourWords: ['Ser', 'Vacío', 'Sentido', 'Asombro'],
      pageStart: 26,
      pageEnd: 27,
      isFree: false,
      content: [],
    },
    {
      id: 'capitulo-9',
      number: 'Capítulo IX',
      title: 'Enfoque, Disciplina, Constancia, Éxito',
      fourWords: ['Enfoque', 'Disciplina', 'Constancia', 'Éxito'],
      pageStart: 29,
      pageEnd: 31,
      isFree: false,
      content: [],
    },
    {
      id: 'capitulo-10',
      number: 'Capítulo X',
      title: 'Atención, Ruido, Elección, Claridad',
      fourWords: ['Atención', 'Ruido', 'Elección', 'Claridad'],
      pageStart: 32,
      pageEnd: 33,
      isFree: false,
      content: [],
    },
    {
      id: 'epilogo',
      title: 'Epílogo',
      pageStart: 35,
      pageEnd: 36,
      isFree: false,
      content: [],
    },
    {
      id: 'fin-tomo-1',
      title: 'Fin del Tomo I',
      pageStart: 37,
      pageEnd: 37,
      isFree: false,
      content: [],
    },
  ],
}
