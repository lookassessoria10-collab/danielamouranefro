// Confere, sem login, se cada vídeo do catálogo pode ser reproduzido publicamente
// pelo player incorporado do Google Drive (/file/d/ID/preview).
// Uso: npm run check:drive
//
//   200 → público (o player funciona para qualquer visitante)
//   401/403 → privado: compartilhe como "Qualquer pessoa com o link · Leitor"
//   404 → ID inexistente ou arquivo removido
import { videos } from "../src/data/videos.ts";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

async function check(video) {
  try {
    const res = await fetch(`https://drive.google.com/file/d/${video.driveId}/preview`, {
      headers: { "user-agent": UA, "accept-language": "pt-BR" },
      redirect: "follow",
    });
    const html = res.status === 200 ? await res.text() : "";
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/ - Google Drive$/, "") ?? "";
    const state =
      res.status === 200 ? "público" : res.status === 401 || res.status === 403 ? "PRIVADO" : res.status === 404 ? "NÃO ENCONTRADO" : `HTTP ${res.status}`;
    return { video, status: res.status, state, title };
  } catch (error) {
    return { video, status: 0, state: `ERRO DE REDE (${error.message})`, title: "" };
  }
}

const results = [];
for (let i = 0; i < videos.length; i += 6) {
  results.push(...(await Promise.all(videos.slice(i, i + 6).map(check))));
}
results.sort((a, b) => a.video.number - b.video.number);

for (const r of results) {
  const n = String(r.video.number).padStart(2, "0");
  console.log(`${n}  ${r.state.padEnd(15)} ${r.video.title.padEnd(28)} ${r.title || r.video.fileName}`);
}

const ok = results.filter((r) => r.status === 200).length;
const privateCount = results.filter((r) => r.status === 401 || r.status === 403).length;
console.log(`\n${ok} de ${results.length} vídeos com reprodução pública.`);
if (privateCount) {
  console.log(
    `${privateCount} arquivo(s) pedem login. No Google Drive, clique com o botão direito na pasta principal ` +
      `→ Compartilhar → Acesso geral: "Qualquer pessoa com o link" → Leitor.`,
  );
}
process.exit(ok === results.length ? 0 : 1);
