# Flash Cards Condução PT

Web app simples, mobile-first, para estudar conteúdos do exame de condução através de flashcards.

## Estado atual

Versão inicial funcional com:

- Página inicial com grupos de estudo.
- Flashcards com pergunta e resposta.
- Botões `Acertei`, `Errei` e `Difícil`.
- Progresso guardado no navegador com `localStorage`.
- Modo aleatório.
- Revisão de cartões errados.
- Revisão de cartões difíceis.
- Botão para reiniciar progresso.
- Design responsivo em tons verdes.

## Estrutura

```text
index.html      Estrutura da página
style.css       Estilos visuais
script.js       Lógica da aplicação
flashcards.js   Dados dos grupos e cartões
```

## Como editar os flashcards

Os cartões ficam no ficheiro `flashcards.js`.

Cada cartão segue este formato:

```js
{
  id: "g1-001",
  pergunta: "O regulamento aplica-se a que viaturas?",
  resposta: "A todas as viaturas e máquinas da Junta e às que estejam à sua guarda."
}
```

Importante: cada `id` deve ser único, porque é usado para guardar o progresso.

## Próximas melhorias previstas

- Inserir os 120 flashcards completos.
- Criar modo exame com 30 perguntas aleatórias.
- Adicionar resultado final no modo exame.
- Ativar GitHub Pages para usar a app por link no telemóvel.
