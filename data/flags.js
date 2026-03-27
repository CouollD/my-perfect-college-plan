// ═══════════════════════════════════════════════════
// flags.js — フラグ管理
// ═══════════════════════════════════════════════════
// 依存: gamestate.js (GameState)
// 一度起きたイベントをGameStateのflagsに記録する

const Flags = {

  get _flags() {
    return GameState._data?.flags || [];
  },

  /** フラグを立てる */
  trigger(eventId) {
    if(!GameState._data) return;
    if(!GameState._data.flags) GameState._data.flags = [];
    if(!this._flags.includes(eventId)) {
      GameState._data.flags.push(eventId);
      GameState.save();
    }
  },

  /** フラグが立っているか */
  has(eventId) {
    return this._flags.includes(eventId);
  },

  /** 複数フラグがすべて立っているか（AND条件） */
  check(conditions) {
    return conditions.every(c => this.has(c));
  },

  /** 複数フラグのいずれかが立っているか（OR条件） */
  any(conditions) {
    return conditions.some(c => this.has(c));
  },

  /** フラグ一覧 */
  list() {
    return [...this._flags];
  },
};

// ── 定義済みフラグID ──────────────────────────────
// イベントフラグの命名規則: 'カテゴリ_対象_詳細'
const FLAG = {
  // 女性との接触
  MET_SHIOIRI:     'met_110',   // しおりに初めて会った
  CONTACT_GOTTEN:  'contact_any', // 誰かと連絡先交換した

  // 友達イベント
  FRIEND_FALLOUT:  'friend_fallout', // 友達と気まずくなった
  FRIEND_BESTIE:   'friend_bestie',  // 親友フラグ

  // 合コンイベント
  FIRST_GOUKON:    'goukon_first',   // 初回合コン完了
  GOUKON_10:       'goukon_10',      // 合コン10回達成
  NIJIKAI_SUCCESS: 'nijikai_ok',     // 二次会成功した

  // 学年イベント
  YEAR2_START:     'year2_start',
  YEAR3_START:     'year3_start',
  YEAR4_START:     'year4_start',

  // エンディング関連
  SHUKATSOU_DONE:  'shukatsu_done',  // 就活完了

  // チュートリアル
  TUTORIAL_DONE:   'tutorial_done',  // チュートリアル完了
};
