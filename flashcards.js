// Dados iniciais da app.
// Para acrescentar cartões, basta adicionar objetos { id, pergunta, resposta } dentro do grupo pretendido.

const FLASHCARD_GROUPS = [
  {
    id: "grupo1",
    title: "Grupo 1 — Conceitos fundamentais",
    description: "Âmbito, tipos de veículos, autorização e princípios gerais.",
    cards: [
      {
        id: "g1-001",
        pergunta: "O regulamento aplica-se a que viaturas?",
        resposta: "A todas as viaturas e máquinas da Junta e às que estejam à sua guarda."
      },
      {
        id: "g1-002",
        pergunta: "Como se classificam os veículos no regulamento?",
        resposta: "Ciclomotores, ligeiros, pesados e máquinas/tratores."
      },
      {
        id: "g1-003",
        pergunta: "O que caracteriza um veículo ligeiro?",
        resposta: "Peso bruto até 3500 kg e lotação até 9 lugares, incluindo o condutor."
      },
      {
        id: "g1-004",
        pergunta: "É necessária carta profissional para autocondução?",
        resposta: "Não. É necessária carta válida para a categoria do veículo."
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
        pergunta: "Quem paga as coimas por infrações ao Código da Estrada?",
        resposta: "O condutor."
      },
      {
        id: "g2-002",
        pergunta: "O que deve verificar o condutor antes de iniciar a condução?",
        resposta: "Óleo, água e pressão dos pneus."
      },
      {
        id: "g2-003",
        pergunta: "Que documento deve ser preenchido após a utilização da viatura?",
        resposta: "O Boletim de Serviço."
      },
      {
        id: "g2-004",
        pergunta: "Quem assegura a existência dos seguros das viaturas?",
        resposta: "O setor administrativo da Junta de Freguesia."
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
        pergunta: "O condutor pode abandonar uma viatura imobilizada?",
        resposta: "Não, deve manter-se junto da viatura até à sua remoção, se tiver condições."
      },
      {
        id: "g3-002",
        pergunta: "Qual o primeiro procedimento documental em caso de acidente?",
        resposta: "Preencher a Declaração Amigável de Acidente Automóvel."
      },
      {
        id: "g3-003",
        pergunta: "Quando é obrigatória a intervenção policial num acidente?",
        resposta: "Quando há recusa de declaração, falta de documentos, fuga, suspeita de álcool/drogas, danos corporais ou danos graves."
      },
      {
        id: "g3-004",
        pergunta: "Usar a viatura para fins particulares constitui infração?",
        resposta: "Sim, constitui infração disciplinar."
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
        pergunta: "Qual a antecedência mínima para pedir uma viatura?",
        resposta: "Pelo menos uma semana."
      },
      {
        id: "g4-002",
        pergunta: "Após quantos minutos de atraso pode ser cancelada a cedência?",
        resposta: "Após 30 minutos sem comparência nem justificação."
      },
      {
        id: "g4-003",
        pergunta: "Quem paga combustível, portagens e estacionamento?",
        resposta: "A entidade requisitante."
      },
      {
        id: "g4-004",
        pergunta: "A Junta pode cancelar uma cedência já autorizada?",
        resposta: "Sim, em situações de força maior, avaria, necessidade urgente ou iniciativa de grande relevo."
      }
    ]
  }
];
