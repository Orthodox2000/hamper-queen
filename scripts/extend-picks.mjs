// Validate + extend retail picks to ~108 (from 50) and write scripts/.retail-picks.json
// Candidates curated by hand (brand variety, gift-worthy single packs). Only written
// when every pid exists in the harvest pool with image_url + inStock.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PICKS_FILE = path.join(__dirname, '.retail-picks.json');
const HARVEST_FILE = path.join(__dirname, '.retail-harvest.json');

const existing = JSON.parse(await readFile(PICKS_FILE, 'utf8'));
const pool = JSON.parse(await readFile(HARVEST_FILE, 'utf8'));
const byPid = new Map(pool.map((r) => [String(r.pid), r]));

// New curated candidates: [key, pid]
const NEW_PICKS = [
  // KitKat family
  ['kitkat_4f_38g', 212722],
  ['kitkat_share_snap_57g', 425721],
  ['kitkat_minis_111g', 383615],
  ['kitkat_gift_181g', 701721],
  ['kitkat_delights_50g', 380140],
  // Ferrero premium
  ['ferrero_moments_16pc', 528089],
  ['ferrero_100g_box', 566218],
  ['ferrero_bar_90g', 742604],
  // Galaxy
  ['galaxy_minis_72g', 525781],
  ['galaxy_dark_70_56g', 503768],
  // Milka
  ['milka_oreo_90g', 164002],
  ['milka_alpine_90g', 777406],
  ['milka_hazelnut_95g', 474411],
  ['milka_cowspot_90g', 777409],
  // Bounty & Hershey's
  ['bounty_50g', 19527],
  ['bounty_minis_100g', 3299],
  ['hershey_cnc_90g', 403537],
  ['hershey_creamy_90g', 403538],
  // Kinder
  ['kinder_bueno_43g', 675830],
  ['kinder_creamy_19g', 436984],
  ['kinder_joy_20g', 16779],
  // Parle & Britannia
  ['parle_elaichi_rusk_291g', 46074],
  ['parle_milk_shakti_350g', 488652],
  ['parle_g_royale_360g', 539383],
  ['monaco_classic_371g', 396110],
  ['monaco_cheeslings_2x', 407747],
  ['colossal_5050_maska_114g', 19176],
  ['brit_potazos_71g', 480017],
  ['milkbikis_188g', 11170],
  ['milkbikis_190g', 33402],
  ['little_hearts_79g', 223327],
  ['brit_gobbles_fruit_100g', 336628],
  ['brit_gobbles_fruity_55g', 108085],
  // Dark Fantasy
  ['dark_fantasy_230g', 313249],
  ['dark_fantasy_big_150g', 24700],
  ['dark_fantasy_yumfills_242g', 409925],
  ['dark_fantasy_desserts_100g', 479090],
  // Oreo
  ['oreo_bts_pancake_103g', 791499],
  ['oreo_golden_108g', 753771],
  ['oreo_vanilla_2x125g', 389066],
  // Cadbury extras
  ['cadbury_5star_2pk', 374402],
  ['cadbury_5star_96g', 548961],
  ['cadbury_5star_oreo_87g', 483021],
  ['cadbury_celebrations_119g', 391905],
  ['cadbury_celebrations_prem_163g', 802440],
  ['cadbury_gems_mini_94g', 442668],
  ['cadbury_gems_ball_14g', 108643],
  ['cadbury_perk_mini_115g', 225506],
  ['cadbury_bournville_dark_75g', 424615],
  ['cadbury_bournville_cran_78g', 555],
  ['cadbury_temptations_70g', 156106],
  ['cadbury_chocobakes_167g', 499373],
  // Munch
  ['munch_max_38g', 496297],
  ['munch_nuts_37g', 636149],
  ['munch_brownie_37g', 553063],
  // Amul
  ['amul_dark_35g', 381902],
  ['amul_sugarfree_35g', 382050],
  // Snickers variety packs
  ['snickers_assorted_110g', 678635],
  ['snickers_minis_103g', 503770],
  ['snickers_bestofminis_103g', 513015],
  // Lays
  ['lays_magic_masala_58g', 240092],
  ['lays_magic_masala_75g', 432775],
  ['lays_classic_salted_80g', 432780],
  ['lays_crispz_herb_onion_50g', 223819],
  // Pringles
  ['pringles_peri_2x102g', 377079],
  ['pringles_scorchin_40g', 694053],
  ['pringles_sourcream_40g', 538700],
  ['pringles_scorchin_102g', 694055],
  // Kurkure & Bingo
  ['kurkure_green_chutney_78g', 140943],
  ['kurkure_masala_103g', 436909],
  ['kurkure_puffcorn_3x58g', 375328],
  ['kurkure_chilli_chatka_3x', 428248],
  ['bingo_madangles_106g', 407554],
  // Doritos & other chips
  ['doritos_2x75g', 381269],
  ['uncle_chipps_spicy_53g', 11150],
  ['uncle_chipps_salted_53g', 45377],
  ['uncle_chipps_spicy_80g', 534451],
  ['too_yumm_cream_onion_79g', 536637],
  ['yellowdiamond_salted_75g', 520009],
  ['yellowdiamond_creamonion_75g', 520007],
  ['crax_curls_82g', 524861],
  ['crax_corn_rings_57g', 458322],
  ['cornitos_cheese_balls_52g', 591988],
  ['cornitos_sweet_chili_78g', 521416],
  // Haldiram's
  ['haldiram_bhujia_400g', 19266],
  ['haldiram_lite_mix_150g', 19251],
  ['haldiram_takatak_95g', 482828],
  ['haldiram_snac_lite_82g', 544712],
  // Chupa Chups candy
  ['chupa_sour_crawlers_99g', 559783],
  ['chupa_strawberry_watermelon_80g', 523829],
  ['chupa_lollipop_2x96g', 483012],
];

const pickedPids = new Set(existing.map((p) => String(p.pid)));
const problems = [];

for (const [key, pid] of NEW_PICKS) {
  const rec = byPid.get(String(pid));
  if (!rec) {
    problems.push(`missing in pool: ${key} (${pid})`);
    continue;
  }
  if (!rec.image_url) {
    problems.push(`no image_url: ${key} (${pid})`);
  }
  if (!String(rec.inStock).toLowerCase() === 'true' && rec.inStock !== true) {
    problems.push(`not in stock: ${key} (${pid})`);
  }
  if (pickedPids.has(String(pid))) {
    problems.push(`dup pid already picked: ${key} (${pid})`);
    continue;
  }
  pickedPids.add(String(pid));
}

if (problems.length > 0) {
  console.error('CURATION PROBLEMS:\n' + problems.map((s) => '  - ' + s).join('\n'));
  process.exit(1);
}

const merged = [...existing, ...NEW_PICKS.map(([key, pid]) => ({ key, pid }))];
// de-dupe by key too
const seen = new Set();
const finalPicks = merged.filter((p) => {
  if (seen.has(p.key)) return false;
  seen.add(p.key);
  return true;
});

await writeFile(PICKS_FILE, JSON.stringify(finalPicks, null, 2), 'utf8');
console.log(`OK: wrote ${finalPicks.length} picks (${NEW_PICKS.length} new, ${existing.length} existing).`);