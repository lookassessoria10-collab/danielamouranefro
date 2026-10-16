# Nefroflix

Plataforma de vídeos educativos sobre saúde renal com a **Dra. Daniela Moura Landim**, médica nefrologista.
*Suas perguntas encontram respostas em vídeo.*

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · Lucide · pronto para a Vercel.
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
4. Rode `npm run check:catalog` e `npm run check:drive`.

O vídeo aparece automaticamente na categoria, na busca, nas coleções e nas sugestões.

### O que ainda precisa ser preenchido pela equipe

- **Resumos (`summary`)**: estão todos como `null` de propósito. Nenhuma descrição é exibida até
  alguém assistir ao vídeo e escrever um texto validado.
- **Duração e data de publicação**: ficam `null` até haver o dado real. O site não mostra estimativas.
- **Instagram, contato e registro (CRM/RQE)** em `src/data/site.ts`: os botões só aparecem quando preenchidos.
- **Títulos e perguntas**: adaptados dos nomes dos arquivos, sem afirmar o conteúdo. Vale revisar
  depois de assistir, principalmente *Albumina*, *Sinais no rosto*, *Eletroestimulação* e *Projeto verão*.

---

## Decisões e limites conhecidos

- **Player:** `drive.google.com/file/d/ID/preview` em iframe, a mesma lógica do Instituto Landim,
  sem autoplay e na proporção original 9:16 (as 27 miniaturas do Drive confirmam vídeos verticais).
  Abaixo do player há sempre o link "Abrir no Google Drive" como alternativa.
- **Aviso de acesso:** o site testa a miniatura pública de cada vídeo; se ela não carrega, mostra um
  aviso orientando a abrir no Drive. Isso não bloqueia o player.
- **Tempo assistido:** o player do Drive não informa progresso, então não há barras de progresso.
  O site registra apenas os vídeos abertos ("Vistos recentemente") e a marcação manual "Assistido".
- **Perfis, Minha lista e histórico** ficam no `localStorage` do navegador: sem conta, sem servidor,
  e não sincronizam entre aparelhos.
- **Cache Components** está desligado no `next.config.ts`: com ele, uma página de vídeo deixada para trás
  ficaria só escondida e o áudio do Drive poderia continuar tocando.
- **Fotografias:** apenas recorte e enquadramento das fotos reais (`scripts/crop-photos.mjs`), sem retoque de feições.

### Próximos passos sugeridos

- Painel administrativo ou importação automática de metadados com a API do Google Drive.
- Imagens de compartilhamento (Open Graph) por vídeo para WhatsApp e Instagram.
- Se o volume de acessos crescer, o Drive pode limitar reproduções de arquivos muito acessados;
  nesse caso vale avaliar YouTube não listado ou Vimeo usando o mesmo catálogo.
