/**
 * "Por onde começar?" — trilha de descoberta por perguntas.
 *
 * A trilha NÃO diagnostica nem coleta dados clínicos. Ela só identifica o
 * assunto de interesse e aponta vídeos reais do catálogo. Cada `selection`
 * lista IDs internos: o primeiro é o vídeo principal do assunto escolhido.
 */

export type DiscoveryTopic = {
  id: string;
  label: string;
  /** Vídeos sugeridos (2 a 3). O primeiro é o vídeo do próprio assunto. */
  selection: string[];
};

export type DiscoveryPath = {
  id: string;
  label: string;
  icon: "signal" | "cup" | "pill" | "shield";
  prompt: string;
  topics: DiscoveryTopic[];
};

export const discoveryIntro = {
  title: "Por onde começar?",
  text: "Não sabe qual vídeo assistir primeiro? Conte o que você quer entender.",
};

export const discoveryPaths: DiscoveryPath[] = [
  {
    id: "sinais",
    label: "Quero entender um sinal do meu corpo.",
    icon: "signal",
    prompt: "Qual destes assuntos despertou sua curiosidade?",
    topics: [
      { id: "espuma", label: "Espuma na urina", selection: ["v07", "v04", "v20"] },
      { id: "acordar", label: "Acordar à noite para urinar", selection: ["v16", "v14", "v09"] },
      { id: "funcao", label: "Alterações na função renal", selection: ["v19", "v20", "v04"] },
      { id: "rosto", label: "Sinais no rosto", selection: ["v10", "v07", "v20"] },
    ],
  },
  {
    id: "bebidas",
    label: "Tenho dúvidas sobre bebidas e alimentação.",
    icon: "cup",
    prompt: "Sobre qual assunto você quer aprender?",
    topics: [
      { id: "alcalina", label: "Água alcalina", selection: ["v03", "v05", "v06"] },
      { id: "limao", label: "Água com limão", selection: ["v05", "v03", "v01"] },
      { id: "coco", label: "Água de coco", selection: ["v06", "v03", "v01"] },
      { id: "energeticos", label: "Energéticos", selection: ["v24", "v26", "v13"] },
      { id: "cerveja", label: "Cerveja", selection: ["v26", "v13", "v24"] },
      { id: "cha", label: "Chá diurético", selection: ["v15", "v18", "v13"] },
    ],
  },
  {
    id: "medicamentos",
    label: "Quero saber mais sobre medicamentos.",
    icon: "pill",
    prompt: "Qual tema chamou sua atenção?",
    topics: [
      { id: "caneta", label: "Canetas emagrecedoras", selection: ["v17", "v27", "v23"] },
      { id: "emagrecer", label: "Remédios para emagrecer", selection: ["v27", "v17", "v25"] },
      { id: "vitamina", label: "Vitamina D", selection: ["v23", "v18", "v17"] },
      { id: "anti", label: "Chás e anti-inflamatórios", selection: ["v18", "v15", "v23"] },
      { id: "eletro", label: "Eletroestimulação", selection: ["v08", "v17", "v27"] },
    ],
  },
  {
    id: "cuidar",
    label: "Quero cuidar melhor dos meus rins.",
    icon: "shield",
    prompt: "Por onde você quer começar?",
    topics: [
      { id: "checkup", label: "Check-up e exames", selection: ["v20", "v19", "v04"] },
      { id: "agua", label: "Água no dia a dia", selection: ["v01", "v03", "v06"] },
      { id: "sono", label: "Sono e idas ao banheiro", selection: ["v09", "v16", "v14"] },
      { id: "gravidez", label: "Gravidez", selection: ["v21", "v14", "v16"] },
      { id: "estacoes", label: "Inverno e verão", selection: ["v11", "v25", "v01"] },
    ],
  },
];
