import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Shift existing slides at orderIndex >= 1 upward (reverse order to avoid unique constraint)
await conn.query("UPDATE slides SET orderIndex=4 WHERE moduleId=3 AND orderIndex=3");
await conn.query("UPDATE slides SET orderIndex=3 WHERE moduleId=3 AND orderIndex=2");
await conn.query("UPDATE slides SET orderIndex=2 WHERE moduleId=3 AND orderIndex=1");

const games = [
  { name: "Macaco da Fortuna", url: "https://www.estrelabet.bet.br/gameplay/macaco-da-fortuna-jogoglobal", img: "/manus-storage/jogoeb-macacodafortuna-fp_4f9adb4d.webp" },
  { name: "Velho do Raio Sortudo", url: "https://www.estrelabet.bet.br/gameplay/velho-do-raio-sortudo-jogoglobal", img: "/manus-storage/jogoeb-velhodoraiosortudo-fp_f1ed6f70.webp" },
  { name: "Panda da Fortuna", url: "https://www.estrelabet.bet.br/gameplay/panda-da-fortuna-jogoglobal", img: "/manus-storage/jogoeb-pandadafortuna-fp_49b06f19.webp" },
  { name: "Stelar", url: "https://www.estrelabet.bet.br/gameplay/stelar-jogoglobal", img: "/manus-storage/jogostelar-pr_4f51182f.webp" },
  { name: "Aviaozinho", url: "https://www.estrelabet.bet.br/gameplay/aviaozinho-jogoglobal", img: "/manus-storage/jogoaviaozinho-fp_1b0a41e1.webp" },
  { name: "Doce Bonanza", url: "https://www.estrelabet.bet.br/gameplay/doce-bonanza-jogoglobal", img: "/manus-storage/jogoeb-docebonanza-fp_86be0478.webp" },
  { name: "Moto Grau", url: "https://www.estrelabet.bet.br/gameplay/motograu-jogoglobal", img: "/manus-storage/jogomotograu-pr_0500a52d.webp" },
  { name: "Star Mines", url: "https://www.estrelabet.bet.br/gameplay/star-mines-jogoglobal", img: "/manus-storage/jogostar-mines_ad6908fa.webp" },
  { name: "FlyOvni", url: "https://www.estrelabet.bet.br/gameplay/flyovni-jogoglobal", img: "/manus-storage/jogoflyovni-pr_874e117f.webp" },
  { name: "Double Stars", url: "https://www.estrelabet.bet.br/gameplay/double-stars-jogoglobal", img: "/manus-storage/jogodouble-stars-pr_9549724c.webp" },
];

const content = JSON.stringify({ games });
const speech = "Esses sao os jogos que so voce encontra aqui na Stellar Gaming! Desenvolvidos exclusivamente pra nossa plataforma. Clique em qualquer um pra experimentar! 🎮";

await conn.query(
  "INSERT INTO slides (moduleId, title, layout, content, betinhaSpeech, orderIndex) VALUES (3, ?, ?, ?, ?, 1)",
  ["Jogos Exclusivos 🎮", "exclusive-games", content, speech]
);

console.log("Slide inserido com sucesso!");
const [rows] = await conn.query("SELECT id, title, orderIndex FROM slides WHERE moduleId=3 ORDER BY orderIndex");
console.log(JSON.stringify(rows, null, 2));
await conn.end();
