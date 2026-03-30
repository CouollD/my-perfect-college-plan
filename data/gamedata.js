// ═══════════════════════════════════════════════════
// gamedata.js — 大学生活攻略録 データ定義
// ═══════════════════════════════════════════════════

// ── 共通定数 ──────────────────────────────────────
const PARAM_KEYS   = ['comm','visu','head','tact','air','mental','sake'];
const PARAM_LABELS = { comm:'コミュ力', visu:'ビジュ', head:'頭', tact:'手際', air:'空気読み', mental:'メンタル', sake:'酒の強さ' };
const GRADE        = v => v>=81?'◎◎':v>=61?'◎':v>=41?'○':v>=21?'△':'×';
const GRADE_CLASS  = v => v>=81?'grade-ss':v>=61?'grade-s':v>=41?'grade-a':v>=21?'grade-b':'grade-x';
const MONEY_MAP    = { home:40000, alone_send:30000, alone_nosend:15000 };

// 好みのタイプ選択肢（タイプを聞くコマンドで使用）
const PARTNER_TYPES = ['知的系', 'ノリ系', '体育会系', '穏やか系', '面白い系', 'しっかり系', 'ワル系', '草食系'];

const ENV_LABELS = {
  circle: { none:'サークルなし', culture:'文化系サークル', sports:'体育会系サークル' },
  living: { home:'実家', alone_send:'一人暮らし(仕送りあり)', alone_nosend:'一人暮らし(仕送りなし)' },
  part:   { none:'バイトなし', izakaya:'居酒屋バイト', cafe:'カフェバイト', juku:'塾バイト' },
};

// ── キャラクター共通スキーマ ───────────────────────
// 男女全員が同じフィールドを持つ。女性側にない概念はnullで入れる。
// id, name, type, params, maxParams, traits
// circle, living, part, locked
// group, tag, weak, limit, note
// hint_default, hint_friend

// ── 男性キャラクター（10人 + 紹介解放4人）──────────────────────
const CHARACTERS = [
  {
    id:1, name:'藤原 けんた', type:'体育会・盛り上げ番長',
    params:    { comm:88, visu:65, head:35, tact:60, air:20, mental:70, sake:85 },
    maxParams: { comm:90, visu:68, head:48, tact:64, air:20, mental:72, sake:85 },
    traits:['暴走しやすい'],
    circle:'sports', living:'alone_send', part:'izakaya', hometown:'地方', zemi:'社会',
    locked:false, group:'circle', tag:'サークル',
    weak:'空気読み', limit:null,
    note:'盛り上げ最強。でも自分も目立つ。',
    hint_default:'いつもムードメーカー。場を仕切るのが好き。',
    hint_friend:'飲み会になると誰かに入れ込む。止めるのが大変。',
    likes:['ノリ系','体育会系'],
    introduces:[{id:3, minIntimacy:30, reason:'居酒屋とサークルで一緒の奴'}],
  },
  {
    id:2, name:'中島 りょう', type:'無口・イケメン枠',
    params:    { comm:15, visu:92, head:55, tact:40, air:58, mental:65, sake:45 },
    maxParams: { comm:32, visu:94, head:66, tact:50, air:68, mental:70, sake:45 },
    traits:['静観しやすい'],
    circle:'culture', living:'home', part:'none', hometown:'関東', zemi:'文学',
    locked:false, group:'circle', tag:'サークル',
    weak:'コミュ力', limit:'2ヶ月1回',
    note:'イケメン枠。無口だが存在感がある。',
    hint_default:'見た目で得してる。あまり喋らない。',
    hint_friend:'ほぼ喋らないけど女子がよく見てる。',
    likes:['穏やか系','知的系'],
    introduces:[{id:4, minIntimacy:30, reason:'文化系サークルの仲間'}],
  },
  {
    id:3, name:'上田 ともや', type:'ノリ担当・酒豪',
    params:    { comm:82, visu:55, head:18, tact:45, air:62, mental:85, sake:90 },
    maxParams: { comm:88, visu:58, head:19, tact:52, air:72, mental:88, sake:90 },
    traits:['惚れっぽい','暴走しやすい'],
    circle:'sports', living:'alone_send', part:'izakaya', hometown:'関西', zemi:'経済',
    locked:false, group:'circle', tag:'サークル',
    weak:'頭', limit:null,
    note:'ノリ担当。知的系の話題は完全に沈む。',
    hint_default:'テンション高め。酒が入るとさらに元気になる。',
    hint_friend:'すぐ誰かを好きになる。惚れっぽいのが玉に瑕。',
    likes:['ノリ系','草食系'],
    introduces:[{id:11, minIntimacy:30, reason:'居酒屋とサークルで仲いい奴'}],
  },
  {
    id:4, name:'松本 けいた', type:'縁の下の力持ち',
    params:    { comm:55, visu:38, head:58, tact:70, air:84, mental:52, sake:30 },
    maxParams: { comm:72, visu:50, head:66, tact:82, air:86, mental:65, sake:30 },
    traits:['譲れる'],
    circle:'culture', living:'alone_nosend', part:'cafe', hometown:'関東', zemi:'社会',
    locked:false, group:'circle', tag:'サークル',
    weak:null, limit:null,
    note:'縁の下の力持ち。自分が映えたいときに最適。',
    hint_default:'目立たないけど場が安定する。',
    hint_friend:'自分より相手を立てるタイプ。使い勝手がいい。',
    likes:['しっかり系','穏やか系'],
    introduces:[{id:10, minIntimacy:30, reason:'カフェバイトの同僚'}],
  },
  {
    id:5, name:'佐藤 ひろき', type:'学歴厨・メンタル豆腐',
    params:    { comm:40, visu:38, head:90, tact:65, air:36, mental:18, sake:15 },
    maxParams: { comm:55, visu:44, head:95, tact:72, air:48, mental:28, sake:15 },
    traits:['学歴厨'],
    circle:'none', living:'home', part:'juku', hometown:'関東', zemi:'経済',
    locked:false, discoverable:true, group:'class', tag:'ゼミ',
    weak:'メンタル', limit:'テスト期間不可',
    note:'失敗すると立て直せずそのまま沈む。',
    hint_default:'頭はいいが空気が読めない。',
    hint_friend:'学歴の話を始めると止まらない。場を選ぶ必要あり。',
    likes:['知的系','しっかり系'],
    introduces:[{id:7, minIntimacy:30, reason:'塾バイトで一緒の奴'}],
  },
  {
    id:6, name:'田中 まさと', type:'段取り番長・不愛想',
    params:    { comm:32, visu:15, head:65, tact:88, air:70, mental:62, sake:35 },
    maxParams: { comm:46, visu:19, head:70, tact:92, air:80, mental:66, sake:35 },
    traits:['静観しやすい'],
    circle:'none', living:'alone_nosend', part:'izakaya', hometown:'地方', zemi:'経済',
    locked:false, group:'class', tag:'ゼミ',
    weak:'ビジュ', limit:null,
    note:'段取りは完璧。第一印象は最悪。',
    hint_default:'見た目損してるが仕事は確実。',
    hint_friend:'飲み会の手配は任せると100点。ただし愛想がない。',
    likes:['しっかり系','穏やか系'],
    introduces:[
      {id:5, minIntimacy:30, reason:'同じゼミの奴、頭はいい'},
      {id:2, minIntimacy:60, reason:'授業で顔見知りになった奴'},
    ],
  },
  {
    id:7, name:'木村 しょうた', type:'論理派・空気読まない',
    params:    { comm:40, visu:62, head:85, tact:58, air:18, mental:55, sake:55 },
    maxParams: { comm:50, visu:68, head:92, tact:64, air:25, mental:58, sake:55 },
    traits:['学歴厨'],
    circle:'culture', living:'home', part:'juku', hometown:'地方', zemi:'文学',
    locked:false, discoverable:true, group:'class', tag:'ゼミ',
    weak:'空気読み', limit:'月1まで',
    note:'論理的すぎて雰囲気ぶち壊しリスクあり。',
    hint_default:'話は面白いが雰囲気をぶち壊すことがある。',
    hint_friend:'知的系の子には刺さる。ギャル系は無理。',
    likes:['知的系','面白い系'],
    introduces:[],
  },
  {
    id:8, name:'岡田 だいすけ', type:'平均値・水増し要員',
    params:    { comm:55, visu:52, head:58, tact:54, air:60, mental:65, sake:60 },
    maxParams: { comm:60, visu:56, head:62, tact:58, air:64, mental:68, sake:60 },
    traits:['静観しやすい'],
    circle:'none', living:'alone_send', part:'cafe', hometown:'関西', zemi:'社会',
    locked:false, discoverable:true, group:'class', tag:'ゼミ',
    weak:null, limit:null,
    note:'全部平均。誰の邪魔もしない水増し要員。',
    hint_default:'無難。良くも悪くも普通。',
    hint_friend:'特徴がないのが特徴。でも使いやすい。',
    likes:['ノリ系','穏やか系'],
    introduces:[],
  },
  {
    id:9, name:'渡辺 ゆうた', type:'体育会・手際上手',
    params:    { comm:82, visu:60, head:18, tact:78, air:65, mental:70, sake:88 },
    maxParams: { comm:86, visu:64, head:20, tact:84, air:70, mental:74, sake:88 },
    traits:['暴走しやすい'],
    circle:'sports', living:'alone_nosend', part:'izakaya', hometown:'地方', zemi:'社会',
    locked:false, group:'part', tag:'バイト',
    weak:'頭', limit:'繁忙期不可',
    note:'年末年始・GW前後は呼べない。',
    hint_default:'体育会系。テキパキ動く。',
    hint_friend:'繁忙期は音信不通になる。それ以外は頼れる。',
    likes:['体育会系','面白い系'],
    introduces:[{id:14, minIntimacy:30, reason:'昔からの仲間、ちょっとわけあって疎遠だった'}],
  },
  {
    id:10, name:'林 なおき', type:'イケメン・段取り音痴',
    params:    { comm:35, visu:86, head:40, tact:14, air:36, mental:60, sake:65 },
    maxParams: { comm:46, visu:90, head:48, tact:24, air:50, mental:64, sake:65 },
    traits:['惚れっぽい'],
    circle:'culture', living:'home', part:'cafe', hometown:'関西', zemi:'文学',
    locked:false, group:'part', tag:'バイト',
    weak:'手際', limit:'月2回',
    note:'遅刻・段取り崩しリスクあり。',
    hint_default:'顔は良い。でも抜けてる。',
    hint_friend:'すぐ好きになる。集中しすぎると他を放置する。',
    likes:['ノリ系','草食系'],
    introduces:[{id:12, minIntimacy:30, reason:'カフェバイトの同僚'}],
  },
  {
    id:11, name:'小林 みつる', type:'酒豪・盛り上げ職人',
    params:    { comm:78, visu:68, head:28, tact:16, air:62, mental:80, sake:92 },
    maxParams: { comm:84, visu:72, head:38, tact:22, air:68, mental:86, sake:92 },
    traits:['惚れっぽい','暴走しやすい'],
    circle:'sports', living:'alone_nosend', part:'izakaya', hometown:'関東', zemi:'社会',
    locked:false, group:'part', tag:'バイト',
    weak:'手際', limit:'ドタキャン10%',
    note:'来たときの盛り上げ力は随一。',
    hint_default:'来れば最強。来ないことがある。',
    hint_friend:'好きな子ができると一直線。止めるのが難しい。',
    likes:['ノリ系','体育会系'],
    introduces:[{id:8, minIntimacy:30, reason:'バイト先で顔見知りになった奴'}],
  },
  {
    id:12, name:'石田 こうへい', type:'観察眼・無口',
    params:    { comm:15, visu:45, head:60, tact:82, air:88, mental:65, sake:28 },
    maxParams: { comm:20, visu:50, head:65, tact:88, air:92, mental:70, sake:28 },
    traits:['静観しやすい'],
    circle:'none', living:'home', part:'cafe', hometown:'関東', zemi:'文学',
    locked:false, group:'part', tag:'バイト',
    weak:'コミュ力', limit:null,
    note:'ほぼ喋らないが場が崩れない。',
    hint_default:'ほぼ喋らない。でもよく見てる。',
    hint_friend:'観察力が異常。場の状況を一番把握してる。',
    likes:['穏やか系','草食系'],
    introduces:[{id:8, minIntimacy:30, reason:'カフェバイトで一緒になった奴'}],
  },
  {
    id:13, name:'橋本 たける', type:'幼馴染・空気読みの化物',
    params:    { comm:68, visu:58, head:62, tact:20, air:82, mental:90, sake:75 },
    maxParams: { comm:74, visu:62, head:68, tact:28, air:90, mental:92, sake:75 },
    traits:['譲れる'],
    circle:'sports', living:'home', part:'none', hometown:'関西', zemi:'経済',
    locked:false, group:'old', tag:'幼馴染',
    weak:'手際', limit:'学期2回',
    note:'2ヶ月誘わないと疎遠フラグが立つ。',
    hint_default:'昔からの付き合い。気を使わなくていい。',
    hint_friend:'場の空気を読んで引くのが上手い。使い方を知れば最強。',
    likes:['穏やか系','しっかり系'],
    introduces:[
      {id:14, minIntimacy:30, reason:'昔からの親友、最近ちょっと疎遠になってた'},
      {id:1,  minIntimacy:40, reason:'体育会つながりで知ってる奴'},
    ],
  },
  {
    id:14, name:'有村 そうた', type:'万能・久々の再会',
    params:    { comm:72, visu:74, head:70, tact:68, air:80, mental:82, sake:70 },
    maxParams: { comm:86, visu:84, head:82, tact:82, air:90, mental:92, sake:70 },
    traits:['譲れる'],
    circle:'culture', living:'alone_send', part:'juku', hometown:'関西', zemi:'文学',
    locked:false, discoverable:true, group:'old', tag:'幼馴染',
    weak:null, limit:null,
    note:'たけるの紹介で再会できる。万能型。',
    hint_default:'幼馴染。しばらく連絡が途絶えていた。',
    hint_friend:'昔から何でもできる人だった。久々に会ったら頼れる男になってた。',
    likes:['穏やか系','知的系'],
    introduces:[{id:9, minIntimacy:30, reason:'体育会つながりの後輩'}],
  },
];

// ── 女性キャラクター（10人）──────────────────────
const HEROINES = [
  {
    id:101, name:'瀬川 あおい', type:'清楚・図書委員',
    params:    { comm:45, visu:72, head:80, tact:55, air:78, mental:60, sake:30 },
    maxParams: { comm:55, visu:75, head:85, tact:60, air:82, mental:65, sake:30 },
    traits:['静観しやすい'],
    circle:'culture', living:'home', part:'juku', hometown:'関西', zemi:'文学',
    locked:false, group:'heroine', tag:'相手',
    weak:'コミュ力', limit:null,
    note:'知的な話が好き。頭系コマンドが刺さる。',
    hint_default:'読書が好きそう。静かな場所を好む印象。',
    hint_friend:'知り合い曰く、頭のいい人と話すのが好きらしい。',
    likes:['知的系','穏やか系'],
    result_lines:{
      contact:'「……また、話しましょう」（少し赤くなって目を逸らした）',
      good:'「今日、楽しかったです。また機会があれば」',
      normal:'静かに微笑んで帰っていった',
      cold:'少し退屈そうにしていた気がする',
    },
  },
  {
    id:102, name:'橘 ゆな', type:'ギャル・陽キャ',
    params:    { comm:88, visu:80, head:35, tact:50, air:55, mental:75, sake:82 },
    maxParams: { comm:92, visu:84, head:40, tact:55, air:60, mental:80, sake:82 },
    traits:['暴走しやすい'],
    circle:'sports', living:'alone_send', part:'cafe', hometown:'関西', zemi:'経済',
    locked:false, group:'heroine', tag:'相手',
    weak:'頭', limit:null,
    note:'ノリとビジュ系コマンドが刺さる。知的系は逆効果。',
    hint_default:'テンション高め。ノリで動くタイプ。',
    hint_friend:'合コン慣れしてる。イケメンに弱いって噂。',
    likes:['ノリ系','体育会系'],
    result_lines:{
      contact:'「えーやば！番号交換しよ！？」（テンション爆上がり）',
      good:'「今日のメンツ普通に楽しかったわ！また誘ってよ〜」',
      normal:'「まあ悪くなかったかな」（すでに別の話題に移っていた）',
      cold:'友達と盛り上がっていて、こちらはほぼ眼中になかった',
    },
  },
  {
    id:103, name:'星野 めい', type:'電波・不思議ちゃん',
    params:    { comm:60, visu:68, head:70, tact:40, air:45, mental:65, sake:38 },
    maxParams: { comm:68, visu:72, head:78, tact:48, air:52, mental:70, sake:38 },
    traits:['惚れっぽい'],
    circle:'culture', living:'alone_nosend', part:'none', hometown:'地方', zemi:'社会',
    locked:false, group:'heroine', tag:'相手',
    weak:'手際', limit:null,
    note:'オカルト・哲学系の話題でのみ本領発揮。',
    hint_default:'独特の世界観がある。普通の話題では反応が薄い。',
    hint_friend:'オカルトとか哲学とかが好きらしい。刺さる人には刺さる。',
    likes:['知的系','面白い系'],
    result_lines:{
      contact:'「……君とはまた話したいな。宇宙の話、途中だったし」',
      good:'「なんか、今日の空気は悪くなかったよ。不思議と」',
      normal:'楽しんでいたようだが、どこか遠い目をしていた',
      cold:'終始マイペースで、こちらへの関心は薄かった',
    },
  },
  {
    id:104, name:'村田 さやか', type:'体育会・姉御',
    params:    { comm:78, visu:62, head:50, tact:65, air:70, mental:88, sake:90 },
    maxParams: { comm:84, visu:68, head:58, tact:72, air:78, mental:92, sake:90 },
    traits:['暴走しやすい'],
    circle:'sports', living:'alone_nosend', part:'izakaya', hometown:'地方', zemi:'経済',
    locked:false, group:'heroine', tag:'相手',
    weak:'頭', limit:null,
    note:'さっぱり系コマンドが刺さる。二次会に一番乗り気。',
    hint_default:'さっぱりした性格。裏表がない。',
    hint_friend:'酒が強い。二次会に一番乗り気になるタイプ。',
    likes:['体育会系','しっかり系'],
    result_lines:{
      contact:'「アンタ、結構やるじゃん。連絡くれよ」',
      good:'「今日は楽しかった！まあまあ合格点あげる」',
      normal:'「悪い人じゃないとは思うけど」（さらっと流された）',
      cold:'「なんか頼りなさそう」という雰囲気で見られていた',
    },
  },
  {
    id:105, name:'木下 りな', type:'真面目・優等生',
    params:    { comm:50, visu:65, head:88, tact:60, air:62, mental:55, sake:25 },
    maxParams: { comm:58, visu:70, head:92, tact:66, air:68, mental:62, sake:25 },
    traits:['静観しやすい'],
    circle:'none', living:'home', part:'juku', hometown:'関東', zemi:'経済',
    locked:false, group:'heroine', tag:'相手',
    weak:'メンタル', limit:null,
    note:'頭系・真面目系コマンドが刺さる。',
    hint_default:'成績優秀らしい。真面目な話が好きそう。',
    hint_friend:'塾でバイトしてるって聞いた。頭いい人と話すのが好きみたい。',
    likes:['知的系','しっかり系'],
    result_lines:{
      contact:'「……良かったら、連絡先交換しませんか」（丁寧に差し出した）',
      good:'「今日は楽しかったです。ちゃんとした方ですね」',
      normal:'礼儀正しく挨拶して帰っていった',
      cold:'終始、少し距離を置かれていた気がする',
    },
  },
  {
    id:106, name:'田所 みほ', type:'バイト仲間・世話焼き',
    params:    { comm:72, visu:60, head:55, tact:80, air:82, mental:70, sake:55 },
    maxParams: { comm:80, visu:66, head:62, tact:88, air:88, mental:78, sake:55 },
    traits:['譲れる'],
    circle:'none', living:'alone_nosend', part:'izakaya', hometown:'関東', zemi:'社会',
    locked:false, group:'heroine', tag:'相手',
    weak:'ビジュ', limit:null,
    note:'空気読み系コマンドが刺さる。頼られると強い。',
    hint_default:'気が利く。場の空気を読むのが上手い。',
    hint_friend:'バイト先でめちゃくちゃ頼られてるらしい。',
    likes:['しっかり系','穏やか系'],
    result_lines:{
      contact:'「もう、しょうがないなあ。連絡していいよ」（笑いながら）',
      good:'「今日ちゃんと楽しめた？よかった〜」',
      normal:'「また機会があったらね」（柔らかい笑顔で）',
      cold:'周りのことを気にしていて、こちらとはあまり話せなかった',
    },
  },
  {
    id:107, name:'上原 なつき', type:'バイト仲間・ドライ',
    params:    { comm:40, visu:70, head:65, tact:58, air:55, mental:60, sake:48 },
    maxParams: { comm:52, visu:76, head:72, tact:64, air:62, mental:68, sake:48 },
    traits:['静観しやすい'],
    circle:'none', living:'alone_send', part:'cafe', hometown:'関西', zemi:'文学',
    locked:false, group:'heroine', tag:'相手',
    weak:'コミュ力', limit:null,
    note:'最初は壁がある。深く話すコマンドが刺さる。',
    hint_default:'愛想はないけど本音で話してくれる感じ。',
    hint_friend:'最初は冷たく見えるけど、仲良くなると違うらしい。',
    likes:['穏やか系','草食系'],
    result_lines:{
      contact:'「……まあ、悪くなかったよ。連絡して」（ドライだけど本音）',
      good:'「今日、思ってたより居心地よかった」',
      normal:'「うん、楽しかった」（淡々と）',
      cold:'終始、我関せずな雰囲気だった',
    },
  },
  {
    id:108, name:'有坂 エミリ', type:'帰国子女・おしゃれ',
    params:    { comm:65, visu:90, head:72, tact:60, air:68, mental:58, sake:42 },
    maxParams: { comm:72, visu:94, head:78, tact:68, air:76, mental:66, sake:42 },
    traits:['惚れっぽい'],
    circle:'culture', living:'home', part:'none', hometown:'関東', zemi:'文学',
    locked:false, group:'heroine', tag:'相手',
    weak:'メンタル', limit:null,
    note:'知的・センス系コマンドが刺さる。',
    hint_default:'センスが高い。ちょっと高嶺の花感がある。',
    hint_friend:'海外にいたらしい。普通の話題だと物足りなそう。',
    likes:['知的系','ノリ系'],
    result_lines:{
      contact:'「連絡先、ちょうだい！今夜すごく楽しかった！」',
      good:'「あなた面白いね。また話したいかも」',
      normal:'「まあ今夜はそれなりに楽しかった」',
      cold:'おしゃれな雰囲気に少し圧倒されていた',
    },
  },
  {
    id:109, name:'佐々木 ことり', type:'量産型・ふわふわ',
    params:    { comm:68, visu:72, head:52, tact:58, air:60, mental:65, sake:58 },
    maxParams: { comm:76, visu:78, head:60, tact:64, air:68, mental:72, sake:58 },
    traits:['惚れっぽい'],
    circle:'sports', living:'home', part:'cafe', hometown:'地方', zemi:'社会',
    locked:false, group:'heroine', tag:'相手',
    weak:null, limit:null,
    note:'一見わかりやすそうで実は読めない。',
    hint_default:'一見ふわふわしてるけど…なんか読めない。',
    hint_friend:'空気読み高い人だと「あれ？」ってなるらしい。',
    likes:['ノリ系','面白い系'],
    result_lines:{
      contact:'「えー！交換しよ交換しよー！」（ぴょんと飛びついてきた）',
      good:'「今日楽しかったー！またやろうよ〜」',
      normal:'「楽しかったです〜！」（誰にでも言ってそうな笑顔で）',
      cold:'ずっと友達と話していた',
    },
  },
  {
    id:110, name:'藤堂 しおり', type:'先輩・ミステリアス',
    params:    { comm:70, visu:82, head:78, tact:72, air:85, mental:80, sake:65 },
    maxParams: { comm:80, visu:88, head:86, tact:82, air:92, mental:90, sake:65 },
    traits:['静観しやすい'],
    circle:'culture', living:'alone_send', part:'juku', hometown:'関西', zemi:'文学',
    locked:true, group:'heroine', tag:'相手',
    weak:null, limit:'2年後半に解放',
    note:'簡単には心を開かない。全体的に高水準。',
    hint_default:'2年後半以降に出会える先輩。',
    hint_friend:'色々あった人らしい。簡単には心を開かない。',
    likes:['穏やか系','ワル系'],
    result_lines:{
      contact:'「……珍しいこともあるもんだね。連絡して」（少し意外そうに）',
      good:'「今夜は…面白かった。少しだけね」',
      normal:'「まあ、悪い夜じゃなかった」（煙に巻かれた感）',
      cold:'つかみどころのない笑顔のまま、本音は最後まで見えなかった',
    },
  },
];

// ── コマンド定義 ──────────────────────────────────
const COMMANDS = {
  ore_ga_iku:    { name:'ここは俺が行く',        unlock:'default',   param:'comm',   risk:false },
  mada_ugokuna:  { name:'まだ動くな',             unlock:'default',   param:'air',    risk:false },
  motto_kikase:  { name:'もっと聞かせてよ',       unlock:'head_50',   param:'head',   risk:true  },
  shizen_ido:    { name:'自然に移動成功…？',      unlock:'air_55',    param:'air',    risk:true  },
  ore_ni_kiku:   { name:'俺に質問するな',         unlock:'mental_65', param:'mental', risk:true  },
  mada_owara:    { name:'まだ終わらせない',       unlock:'count_3',   param:'air',    risk:true  },
  bango_oshiete: { name:'番号、教えてもらえる？', unlock:'count_5',   param:null,     risk:true  },
  onaji_houkou:  { name:'同じ方向っぽくない？',   unlock:'final',     param:'mental', risk:false },
  receive:       { name:'レシーブは任せた！',     unlock:'friend_40', param:null,     risk:false },
  warikonde:     { name:'頼む、割り込んでくれ',   unlock:'friend_55', param:'air',    risk:false },
  kuroko:        { name:'今日は黒子に徹する',     unlock:'friend_50', param:null,     risk:false },
};

// 友達固有コマンド
const FRIEND_COMMANDS = {
  1:  { name:'あいつならやってくれる',     unlock:50, cost:10, effect:'boost_all',     risk:'self_fade' },
  2:  { name:'黙って存在しろ',             unlock:40, cost:8,  effect:'boost_visu',    risk:null },
  4:  { name:'フォロ方と呼ばせてください', unlock:55, cost:10, effect:'recover',       risk:null },
  5:  { name:'発動！人間ラジオ',           unlock:45, cost:8,  effect:'topic',         risk:'backfire_gyaru' },
  6:  { name:'よっ、段取り隊長',           unlock:50, cost:8,  effect:'boost_nijikai', risk:null },
  12: { name:'俺のデータによると…',       unlock:60, cost:5,  effect:'hint',          risk:null },
  13: { name:'空気を読め',                 unlock:70, cost:12, effect:'auto_cutin',    risk:null },
};

// ── セーブ・ロード ────────────────────────────────
const SAVE_KEY = 'goukon_config';

function saveConfig(config) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(config));
}

function loadConfig() {
  const raw = localStorage.getItem(SAVE_KEY);
  return raw ? JSON.parse(raw) : null;
}

/** 居住・サークル・バイトからプレイヤーパラメータを自動導出 */
function derivePlayerParams(living, circle, part) {
  const p = { comm:50, visu:50, head:50, tact:50, air:50, mental:50, sake:50 };

  // 居住補正
  if(living === 'home')         { p.mental+=10; p.head+=5; }
  if(living === 'alone_send')   { p.visu+=10;   p.comm+=5; }
  if(living === 'alone_nosend') { p.tact+=15; p.comm+=10; }

  // サークル補正
  if(circle === 'sports')  { p.comm+=15; p.mental+=10; }
  if(circle === 'culture') { p.head+=15; p.air+=5; }

  // バイト補正
  if(part === 'izakaya') { p.comm+=15; p.sake+=20; }
  if(part === 'cafe')    { p.visu+=10; p.air+=10; }
  if(part === 'juku')    { p.head+=15; }

  // 上限100
  Object.keys(p).forEach(k => { p[k] = Math.min(100, p[k]); });
  return p;
}

function createNewConfig(living, circle, part) {
  return {
    living, circle, part,
    goukonCount: 0,
  };
}

// ── シナジー計算 ──────────────────────────────────
function calcSynergy(partyIds, heroineIds, playerConfig) {
  if(!playerConfig) return { synergies:[], bonuses:{ airBonus:0, cmdBonus:0, heartBonus:{}, nijikaiBonus:0 } };

  const synergies = [];
  const bonuses   = { airBonus:0, cmdBonus:0, heartBonus:{}, nijikaiBonus:0 };

  // 自分 + 友達全員の環境
  const allMen = [
    { circle: playerConfig.circle, living: playerConfig.living, part: playerConfig.part },
    ...partyIds.map(id => CHARACTERS.find(c => c.id === id)).filter(Boolean),
  ];

  // カウント
  const countCircle = {};
  const countPart   = {};
  let   countAlone  = 0;

  allMen.forEach(m => {
    if(m.circle) countCircle[m.circle] = (countCircle[m.circle]||0) + 1;
    if(m.part)   countPart[m.part]     = (countPart[m.part]||0)     + 1;
    if(m.living && m.living !== 'home') countAlone++;
  });

  // パーティシナジー
  if((countCircle.sports||0) >= 2) {
    bonuses.airBonus += 10; bonuses.cmdBonus += 0.2;
    synergies.push({ type:'party', icon:'💪', label:'体育会シナジー', desc:'場の空気+10・コミュ系コマンド効果+20%' });
  }
  if((countCircle.culture||0) >= 2) {
    bonuses.cmdBonus += 0.2;
    synergies.push({ type:'party', icon:'📚', label:'文化系シナジー', desc:'知的系コマンド効果+20%' });
  }
  if((countPart.izakaya||0) >= 2) {
    synergies.push({ type:'party', icon:'🍺', label:'居酒屋仲間シナジー', desc:'「いつものノリで」コマンド解放', unlockCmd:'izakaya_team' });
  }
  if((countPart.juku||0) >= 2) {
    bonuses.cmdBonus += 0.15;
    synergies.push({ type:'party', icon:'🎓', label:'塾仲間シナジー', desc:'知的トーク効果+15%' });
  }
  if(countAlone >= 2) {
    bonuses.nijikaiBonus += 20;
    synergies.push({ type:'party', icon:'🏠', label:'一人暮らしシナジー', desc:'二次会成功率+20%' });
  }

  // 相手女性との相性シナジー
  heroineIds.forEach(hid => {
    const h = HEROINES.find(x => x.id === hid);
    if(!h) return;
    const hn = h.name.split(' ')[1];

    const sameCircle = allMen.some(m => m.circle === h.circle && h.circle !== 'none');
    const samePart   = allMen.some(m => m.part   === h.part   && h.part   !== 'none');
    const sameLiving = allMen.some(m => m.living === h.living);

    if(sameCircle) {
      bonuses.heartBonus[hid] = (bonuses.heartBonus[hid]||0) + 10;
      synergies.push({ type:'heroine', icon:'🎯', heroineId:hid, label:`${hn}との共通サークル`, desc:`${hn}への初期好感度+10・話しかけ効果↑` });
    }
    if(samePart) {
      bonuses.heartBonus[hid] = (bonuses.heartBonus[hid]||0) + 8;
      synergies.push({ type:'heroine', icon:'💼', heroineId:hid, label:`${hn}との共通バイト`, desc:`${hn}への話しかけリスクなし・好感度+8` });
    }
    if(sameLiving) {
      bonuses.heartBonus[hid] = (bonuses.heartBonus[hid]||0) + 5;
      synergies.push({ type:'heroine', icon:'🏡', heroineId:hid, label:`${hn}との共通住まい`, desc:`${hn}と共感トーク可能・好感度+5` });
    }
  });

  return { synergies, bonuses };
}
