// ═══════════════════════════════════════════════════
// gamestate.js — ゲーム状態管理・ドメインロジック
// ═══════════════════════════════════════════════════
// 依存: gamedata.js (PARAM_KEYS, MONEY_MAP, CHARACTERS, HEROINES)

const SAVE_KEY = 'goukon_config';

// ── GameState ─────────────────────────────────────
const GameState = {

  _data: null,

  // ── 初期化 ──────────────────────────────────────

  /** セーブデータがあればロード、なければnull */
  load() {
    const raw = localStorage.getItem(SAVE_KEY);
    this._data = raw ? JSON.parse(raw) : null;
    return this._data !== null;
  },

  /** 新規ゲーム開始（キャラクリ完了時に呼ぶ） */
  newGame(living, circle, part, selfParams) {
    const actual = {};
    PARAM_KEYS.forEach(k => { actual[k] = Math.floor(Math.random() * 100) + 1; });

    const friendRelation  = {};
    const heroineRelation = {};

    CHARACTERS.forEach(c => {
      friendRelation[c.id] = {
        intimacy: 0,   // 0〜100
        used:     0,   // 今学期の呼び出し回数
      };
    });
    HEROINES.forEach(h => {
      heroineRelation[h.id] = {
        intimacy: 0,      // 親密度：会った回数の積み上げ
        romance:  0,      // 恋愛度：合コンでの好感度の積み上げ
        contact:  false,  // 連絡先を持っているか
        met:      false,  // 出会ったことがあるか
      };
    });

    this._data = {
      // 主人公の環境
      living, circle, part,
      money: MONEY_MAP[living] || 30000,

      // 主人公のパラメータ
      self:   { ...selfParams },
      actual: { ...actual },
      revealedParams: [],

      // 時間
      year:  1,
      month: 4,

      // 合コン統計
      goukonCount: 0,

      // 関係値
      friendRelation,
      heroineRelation,

      // フラグ（flags.jsが管理）
      flags: [],
    };

    this.save();
    return this._data;
  },

  save() {
    if(this._data) localStorage.setItem(SAVE_KEY, JSON.stringify(this._data));
  },

  // ── 基本アクセサ ────────────────────────────────

  get(key)       { return this._data?.[key]; },
  set(key, val)  { if(this._data) { this._data[key] = val; this.save(); } },

  get year()       { return this._data?.year  || 1; },
  get month()      { return this._data?.month || 4; },
  get money()      { return this._data?.money || 0; },
  get goukonCount(){ return this._data?.goukonCount || 0; },
  get self()       { return this._data?.self   || {}; },
  get actual()     { return this._data?.actual || {}; },
  get circle()     { return this._data?.circle || 'none'; },
  get living()     { return this._data?.living || 'home'; },
  get part()       { return this._data?.part   || 'none'; },
  get revealedParams() { return this._data?.revealedParams || []; },

  // ── 時間管理 ────────────────────────────────────

  advanceMonth(n = 1) {
    if(!this._data) return;
    this._data.month += n;
    while(this._data.month > 3 + 12) {  // 4月始まり、翌年3月まで
      this._data.month -= 12;
      this._data.year  += 1;
    }
    // 学期初めに呼び出し回数をリセット
    if(this._data.month === 4 || this._data.month === 10) {
      Object.values(this._data.friendRelation || {}).forEach(r => { r.used = 0; });
    }
    this.save();
  },

  /** 現在の時期テキスト */
  get timeLabel() {
    return `${this.year}年${this.month}月`;
  },

  // ── 友達との関係 ────────────────────────────────

  getFriendRelation(friendId) {
    return this._data?.friendRelation?.[friendId] || { intimacy:0, used:0 };
  },

  addFriendIntimacy(friendId, amount) {
    if(!this._data?.friendRelation) return;
    const r = this._data.friendRelation[friendId];
    if(!r) return;
    r.intimacy = Math.max(0, Math.min(100, (r.intimacy || 0) + amount));
    this.save();
  },

  incrementFriendUsed(friendId) {
    if(!this._data?.friendRelation?.[friendId]) return;
    this._data.friendRelation[friendId].used++;
    this.save();
  },

  /** 友達を今月呼べるか */
  canCallFriend(friendId) {
    const c = CHARACTERS.find(x => x.id === friendId);
    if(!c || c.locked) return false;
    const r   = this.getFriendRelation(friendId);
    const lim = c.limit;
    if(!lim) return true;
    if(lim.includes('テスト期間不可') && (this.month === 1 || this.month === 7)) return false;
    if(lim.includes('繁忙期不可') && (this.month === 12 || this.month === 1 || this.month === 3)) return false;
    if(lim.includes('月1') && r.used >= 1) return false;
    if(lim.includes('月2') && r.used >= 2) return false;
    if(lim.includes('学期2') && r.used >= 2) return false;
    return true;
  },

  // ── 女性との関係 ────────────────────────────────

  getHeroineRelation(heroineId) {
    return this._data?.heroineRelation?.[heroineId] || {
      intimacy: 0, romance: 0, contact: false, met: false,
    };
  },

  /** 合コン終了後に関係値を更新（result.htmlから呼ぶ） */
  updateHeroineAfterGoukon(heroineId, heartGained) {
    if(!this._data?.heroineRelation) return;
    const r = this._data.heroineRelation[heroineId];
    if(!r) return;
    r.met      = true;
    r.intimacy = Math.min(100, (r.intimacy || 0) + Math.floor(heartGained / 10));
    r.romance  = Math.min(100, (r.romance  || 0) + Math.floor(heartGained / 5));
    this.save();
  },

  setContact(heroineId, val = true) {
    if(!this._data?.heroineRelation?.[heroineId]) return;
    this._data.heroineRelation[heroineId].contact = val;
    this.save();
  },

  // ── 合コン管理 ──────────────────────────────────

  /** 合コン開始時に呼ぶ */
  startGoukon(partyIds) {
    if(!this._data) return;
    this._data.goukonCount++;
    this._data.money = Math.max(0, this._data.money - 5000);
    partyIds.forEach(id => this.incrementFriendUsed(id));
    this.save();
  },

  /** 合コン結果をまとめて保存（result.htmlから呼ぶ） */
  finishGoukon(heroineResults) {
    // heroineResults: { heroineId: { heartGained, contact } }
    Object.entries(heroineResults).forEach(([hid, result]) => {
      this.updateHeroineAfterGoukon(parseInt(hid), result.heartGained || 0);
      if(result.contact) this.setContact(parseInt(hid));
    });

    // 合コンごとに1〜2個パラメータを開示
    const unrevealed = PARAM_KEYS.filter(k => !this.revealedParams.includes(k));
    const toReveal   = unrevealed.slice(0, Math.min(2, unrevealed.length));
    toReveal.forEach(k => this._data.revealedParams.push(k));

    this.save();
  },

  // ── お金管理 ────────────────────────────────────

  addMoney(amount) {
    if(!this._data) return;
    this._data.money = Math.max(0, (this._data.money || 0) + amount);
    this.save();
  },

  // ── ユーティリティ ──────────────────────────────

  /** セーブデータの概要テキスト */
  get summary() {
    if(!this._data) return 'データなし';
    return `${this.timeLabel} / 合コン${this.goukonCount}回 / ¥${this.money.toLocaleString()}`;
  },

  /** エンディング判定用スコア計算 */
  calcEndingScore() {
    if(!this._data) return {};

    const topRomance = Math.max(
      ...Object.values(this._data.heroineRelation || {}).map(r => r.romance || 0)
    );
    const friendAvg = (() => {
      const vals = Object.values(this._data.friendRelation || {}).map(r => r.intimacy || 0);
      return vals.length ? vals.reduce((a,b) => a+b, 0) / vals.length : 0;
    })();
    const highFriendCount = Object.values(this._data.friendRelation || {})
      .filter(r => (r.intimacy || 0) >= 70).length;
    const contactCount = Object.values(this._data.heroineRelation || {})
      .filter(r => r.contact).length;

    return {
      topRomance,
      friendAvg,
      highFriendCount,
      contactCount,
      money:       this.money,
      goukonCount: this.goukonCount,
    };
  },

  /** エンディング判定 */
  getEnding() {
    const s = this.calcEndingScore();
    if(s.topRomance >= 80 && s.friendAvg >= 50) return 'perfect';       // 順風満帆
    if(s.topRomance >= 80 && s.friendAvg < 30)  return 'allInLove';     // 全てを捧げた恋
    if(s.topRomance < 40  && s.friendAvg >= 60) return 'friendship';    // 仲間と青春
    if(s.highFriendCount >= 2)                   return 'bestFriend';    // 親友と二人三脚
    if(s.contactCount === 0 && s.money >= 50000) return 'solo';         // ソロ充
    if(s.topRomance < 30  && s.friendAvg < 30)  return 'lonely';       // 孤独な卒業
    return 'normal';
  },
};
