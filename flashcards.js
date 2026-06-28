// Dados iniciais da app.
// Para acrescentar perguntas, adicione objetos com:
// { id, categoria, pergunta, opcoes, respostaCorreta, explicacao }
// dentro do grupo pretendido.

const FLASHCARD_GROUPS = [
  {
    id: "grupo1",
    title: "Grupo 1 — Conceitos fundamentais",
    description: "Âmbito, tipos de veículos, autorização e princípios gerais.",
    cards: [
      {
        id: "g1-001",
        categoria: "Conceitos fundamentais",
        pergunta: "O regulamento aplica-se a que viaturas?",
        opcoes: [
          "Apenas às viaturas ligeiras da Junta",
          "A todas as viaturas e máquinas da Junta e às que estejam à sua guarda",
          "Apenas às viaturas usadas em serviço externo",
          "Apenas às viaturas pesadas"
        ],
        respostaCorreta: "A todas as viaturas e máquinas da Junta e às que estejam à sua guarda",
        explicacao: "O âmbito inclui todas as viaturas e máquinas da Junta, incluindo as que estejam à sua guarda."
      },
      {
        id: "g1-002",
        categoria: "Conceitos fundamentais",
        pergunta: "O que caracteriza um veículo ligeiro?",
        opcoes: [
          "Peso bruto até 3500 kg e lotação até 9 lugares, incluindo o condutor",
          "Peso bruto superior a 3500 kg",
          "Qualquer veículo com caixa aberta",
          "Veículo usado apenas para transporte de mercadorias"
        ],
        respostaCorreta: "Peso bruto até 3500 kg e lotação até 9 lugares, incluindo o condutor",
        explicacao: "Um veículo ligeiro tem peso bruto até 3500 kg e lotação até 9 lugares, contando com o condutor."
      }
    ]
  },
  {
    id: "grupo2",
    title: "Grupo 2 — Responsabilidades e boletim",
    description: "Deveres do condutor, setor administrativo e Boletim de Serviço.",
    cards: [
      {
        id: "g2-001",
        categoria: "Responsabilidades",
        pergunta: "Quem paga as coimas por infrações ao Código da Estrada?",
        opcoes: [
          "A Junta de Freguesia",
          "O setor administrativo",
          "O condutor",
          "A entidade requisitante"
        ],
        respostaCorreta: "O condutor",
        explicacao: "As coimas por infrações ao Código da Estrada são da responsabilidade do condutor."
      },
      {
        id: "g2-002",
        categoria: "Boletim de Serviço",
        pergunta: "Que documento deve ser preenchido após a utilização da viatura?",
        opcoes: [
          "Declaração amigável",
          "Boletim de Serviço",
          "Requisição de cedência",
          "Guia de transporte"
        ],
        respostaCorreta: "Boletim de Serviço",
        explicacao: "Após a utilização da viatura deve ser preenchido o Boletim de Serviço."
      }
    ]
  },
  {
    id: "grupo3",
    title: "Grupo 3 — Avarias, acidentes e infrações",
    description: "Procedimentos em avaria/acidente, furto e infrações disciplinares.",
    cards: [
      {
        id: "g3-001",
        categoria: "Acidentes",
        pergunta: "Qual o primeiro procedimento documental em caso de acidente?",
        opcoes: [
          "Preencher a Declaração Amigável de Acidente Automóvel",
          "Abandonar a viatura e informar depois",
          "Pedir uma nova viatura sem registo",
          "Preencher apenas o Boletim de Serviço"
        ],
        respostaCorreta: "Preencher a Declaração Amigável de Acidente Automóvel",
        explicacao: "Em caso de acidente, o primeiro procedimento documental é preencher a declaração amigável."
      },
      {
        id: "g3-002",
        categoria: "Infrações",
        pergunta: "Usar a viatura para fins particulares constitui infração?",
        opcoes: [
          "Não, desde que seja fora do horário de serviço",
          "Sim, constitui infração disciplinar",
          "Só constitui infração se houver acidente",
          "Não, se o combustível for pago pelo condutor"
        ],
        respostaCorreta: "Sim, constitui infração disciplinar",
        explicacao: "A utilização da viatura para fins particulares não autorizados constitui infração disciplinar."
      }
    ]
  },
  {
    id: "grupo4",
    title: "Grupo 4 — Cedência a entidades externas",
    description: "Pedidos, prioridades, utilização, encargos e penalizações.",
    cards: [
      {
        id: "g4-001",
        categoria: "Cedência",
        pergunta: "Qual a antecedência mínima para pedir uma viatura?",
        opcoes: [
          "24 horas",
          "Pelo menos uma semana",
          "No próprio dia",
          "Um mês"
        ],
        respostaCorreta: "Pelo menos uma semana",
        explicacao: "O pedido de viatura deve ser feito com pelo menos uma semana de antecedência."
      },
      {
        id: "g4-002",
        categoria: "Encargos",
        pergunta: "Quem paga combustível, portagens e estacionamento numa cedência?",
        opcoes: [
          "A Junta de Freguesia",
          "O condutor",
          "A entidade requisitante",
          "O setor administrativo"
        ],
        respostaCorreta: "A entidade requisitante",
        explicacao: "Os encargos como combustível, portagens e estacionamento cabem à entidade requisitante."
      }
    ]
  }
];
