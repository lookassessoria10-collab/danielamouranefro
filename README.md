# Nefroflix

Plataforma de vídeos educativos sobre saúde renal com a **Dra. Daniela Moura Landim**, médica nefrologista.
*Suas perguntas encontram respostas em vídeo.*

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · Lucide · Manrope · pronto para a Vercel.
Todas as páginas são geradas de forma estática; não há banco de dados, contas nem chaves de API.

---

## Vídeos no Google Drive

Pasta principal (**DANIELA REELS**), compartilhada como "Qualquer pessoa com o link · Leitor":
https://drive.google.com/drive/folders/1NfB18ZpqgeVDqVukuIqoB4_chC35sCey

Situação conferida em 16/10/2026, sem login:

- `npm run check:drive` → **27 de 27 vídeos com reprodução pública**.
- Os 27 vídeos das 5 subpastas batem um a um com o catálogo (ID e nome do arquivo); nenhum vídeo fora do catálogo.
- Os arquivos respondem como MP4 sem autenticação.

Arquivos novos herdam o compartilhamento da pasta. Se algum dia o player pedir login, confira o
compartilhamento da pasta e rode `npm run check:drive`. Em contas Google Workspace com compartilhamento
externo bloqueado, o administrador libera em
*Admin → Apps → Google Workspace → Drive e Documentos → Configurações de compartilhamento*.

Nada é movido, renomeado ou duplicado: o site só usa os IDs dos arquivos.

---

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (também verifica TypeScript) |
| `npm run lint` | ESLint |
| `npm run check:catalog` | Valida o catálogo: IDs únicos, relações, coleções, trilha e destaques |
| `npm run check:drive` | Testa, sem login, se cada vídeo toca publicamente no Drive |
| `node scripts/fetch-frames.mjs` | Baixa do Drive um quadro real de cada vídeo para as capas (`public/frames`) |
| `npm run sync:media` | Atualiza as rotas de vídeo do `vercel.json` a partir do catálogo (rode ao cadastrar vídeos) |
| `node scripts/brand-assets.mjs` | Gera as versões do logotipo, as peças da abertura e os ícones a partir do arquivo oficial |

## Publicar na Vercel

**Pelo GitHub (recomendado):** crie um repositório novo só para o Nefroflix, envie este projeto e,
na Vercel, clique em *Add New → Project → Import*. A Vercel detecta o Next.js sozinha; não é preciso
mudar nenhuma configuração de build.

**Pela linha de comando:**

```bash
npx vercel
```

Variável de ambiente opcional (Project → Settings → Environment Variables):

| Variável | Exemplo | Para quê |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://nefroflix.com.br` | Links de compartilhamento, sitemap e SEO. Sem ela, usa o domínio de produção da Vercel. |

---

## Como o conteúdo está organizado

Todo o conteúdo fica em `src/data/` — os componentes visuais não guardam títulos, IDs nem relações.

| Arquivo | Conteúdo |
| --- | --- |
| `videos.ts` | Os 27 vídeos: ID interno, ID do Drive, nome original do arquivo, título, categoria, tags, palavras-chave, pergunta, resumo, coleções, série, destaque e relacionados |
| `taxonomy.ts` | As 5 categorias (as pastas do Drive), as 6 coleções e o quadro *Cafezinho com a Nefro* |
| `profiles.ts` | Perfis Paciente, Residente e Curioso: destaques, ordem dos módulos e pesos das sugestões |
| `discovery.ts` | Trilha "Por onde começar?": assuntos, perguntas e vídeos de cada resultado |
| `site.ts` | Nome, especialidade, registro profissional, Instagram, contato e aviso legal |

### Cadastrar um vídeo novo

1. Suba o vídeo no Drive (já compartilhado como "Qualquer pessoa com o link").
2. Copie o ID do link (`drive.google.com/file/d/`**`ESTE_TRECHO`**`/view`).
3. Em `src/data/videos.ts`, copie um bloco `video({...})`, crie um `id` novo (ex.: `"v28"`) e preencha os campos.
4. Rode `node scripts/fetch-frames.mjs` para baixar o quadro da capa e ajuste `cover.faceY`
   (altura do rosto no quadro, em %). Se o quadro tiver texto por cima ou estiver desfocado, use
   `cover: { style: "type", photo: "retrato" }` — capa tipográfica com uma foto real da Dra. Daniela.
5. Rode `npm run sync:media`, `npm run check:catalog` e `npm run check:drive`.

O vídeo aparece automaticamente na categoria, na busca, nas coleções e nas sugestões.

### O que ainda precisa ser preenchido pela equipe

- **Resumos (`summary`)**: estão todos como `null` de propósito. Nenhuma descrição é exibida até
  alguém assistir ao vídeo e escrever um texto validado.
- **Duração**: medida tocando cada vídeo no próprio player (19/10/2026). **Data de publicação** fica `null`
  até haver o dado real. O site não mostra estimativas.
- **Instagram, contato e registro (CRM/RQE)** em `src/data/site.ts`: os botões só aparecem quando preenchidos.
- **Títulos e perguntas**: adaptados dos nomes dos arquivos, sem afirmar o conteúdo. Vale revisar
  depois de assistir, principalmente *Albumina*, *Sinais no rosto*, *Eletroestimulação* e *Projeto verão*.

---

## Identidade visual

- **Tokens** centralizados em `src/app/globals.css` (`@theme`): grafite quente `#171311`, superfícies
  `#231D1A` e `#302722`, texto `#F3EEE8`/`#CFC5BB`, laranja `#E86A00`, marrom `#5A2B1B`, cinza quente
  `#8A8179` e os claros `#E7E5DF`/`#F6F2EC`. Sem azul, roxo ou índigo.
- **Tipografia:** Manrope (sem serifa), com o utilitário `text-display` para títulos de impacto.
- **Logotipo oficial:** `src/assets/brand/nefroflix-logo-original.webp`. A versão para fundo escuro só troca a
  cor do "Nefro" marrom por creme; o símbolo é usado do jeito que veio.
- **Abertura:** as três formas do símbolo (rins e play) e a palavra são recortadas do arquivo oficial e
  animadas com CSS (≈2,6 s). Toca uma vez por sessão (`sessionStorage`), pode ser pulada com clique ou tecla,
  não aparece com "reduzir movimento" e não atrasa o carregamento nem o redirecionamento de perfil.
- **Capas dos vídeos:** quadros reais de cada vídeo (`public/frames`), recortados para 16:9 ou 3:4 pela
  altura do rosto. Os vídeos 02 e 04 usam capa tipográfica, porque o quadro tem texto por cima ou fica escuro.
- **Fotografias:** cinco fotos reais em `src/assets/daniela`, com enquadramento para desktop e celular em
  `src/lib/photos.ts`. Só recorte, enquadramento e gradientes — nenhuma alteração de feições.

## Decisões e limites conhecidos

- **Player:** `<video>` nativo do navegador, sem autoplay, na proporção original 9:16 e com a capa do
  catálogo. O arquivo continua hospedado no Google Drive e chega pelo próprio domínio em
  `/media/<id>.mp4` (rotas geradas a partir do catálogo em `vercel.json` — `npm run sync:media` — e repetidas em
  `next.config.ts` para o servidor local; nenhum outro arquivo passa por ali). Motivo: o player incorporado do Drive (`/file/d/ID/preview`) mostra dois conjuntos de
  controles no iPhone e no Android, e o Drive recusa pedidos de vídeo feitos diretamente por outro site.
- **Plano B automático:** se o arquivo não carregar (erro, cota do Drive, rede), o site troca sozinho para o
  player incorporado do Drive. Abaixo do player há sempre o link "Abrir no Google Drive".
- **Tráfego:** cada reprodução passa pela Vercel (os arquivos têm de 3 a 5 MB). O plano gratuito inclui
  100 GB/mês — algo como 20 mil reproduções completas. Acompanhe em Vercel → Usage.
- **Aviso de acesso:** o site testa a miniatura pública de cada vídeo; se ela não carrega, mostra um
  aviso orientando a abrir no Drive. Isso não bloqueia o player.
- **Tempo assistido:** o player do Drive não informa progresso, então não há barras de progresso.
  O site registra apenas os vídeos abertos ("Continuar assistindo", sem retomar do ponto em que parou)
  e a marcação manual "Assistido".
- **Perfis, Minha lista e histórico** ficam no `localStorage` do navegador: sem conta, sem servidor,
  e não sincronizam entre aparelhos.
- **Cache Components** está desligado no `next.config.ts`: com ele, uma página de vídeo deixada para trás
  ficaria só escondida e o áudio do Drive poderia continuar tocando.
- **Fotografias:** apenas recorte e enquadramento das fotos reais (`scripts/crop-photos.mjs`), sem retoque de feições.

### Próximos passos sugeridos

- Painel administrativo ou importação automática de metadados com a API do Google Drive.
- Imagens de compartilhamento (Open Graph) por vídeo; hoje todas as páginas usam a imagem geral da marca.
- Se o volume de acessos crescer, o Drive pode limitar reproduções de arquivos muito acessados;
  nesse caso vale avaliar YouTube não listado ou Vimeo usando o mesmo catálogo.
