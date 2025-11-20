/**
 * Redmine Custom Fields Configuration
 * Auto-generated from Redmine API
 * Last updated: 2025-11-21 00:35:27
 */

// ==================== Custom Fields ====================
export const CUSTOM_FIELDS = {
  FUNC_CODE: {
    id: 1,
    name: 'Func Code',
    fieldFormat: 'string',
    multiple: false,
  },
  TEST_PLAN: {
    id: 14,
    name: 'テスト計画(Test plan)',
    fieldFormat: 'text',
    multiple: false,
  },
  FEATURE: {
    id: 37,
    name: '機能区分(Feature)',
    fieldFormat: 'list',
    multiple: true,
  },
  GIT_REPOSITORY: {
    id: 40,
    name: 'ENV: Gitリポジトリ',
    fieldFormat: 'string',
    multiple: false,
  },
  ISSUE_TYPE: {
    id: 50,
    name: 'Issue Type',
    fieldFormat: 'list',
    multiple: false,
  },
  FUNCTION_TYPE: {
    id: 60,
    name: '機能種別（Funcrion Type）',
    fieldFormat: 'list',
    multiple: false,
  },
  NOTE: {
    id: 67,
    name: 'Note',
    fieldFormat: 'list',
    multiple: false,
  },
  MANAGED_TICKET: {
    id: 85,
    name: '管理対象のチケットである',
    fieldFormat: 'bool',
    multiple: false,
  },
  TEAM: {
    id: 86,
    name: '担当チーム (Assigned team)',
    fieldFormat: 'list',
    multiple: false,
  },
  SIMPLE_TASK: {
    id: 96,
    name: '簡単なチケット・simple task',
    fieldFormat: 'list',
    multiple: false,
  },
  CATEGORY: {
    id: 97,
    name: '分類(Category)',
    fieldFormat: 'list',
    multiple: false,
  },
  SCOPE_OF_IMPACT: {
    id: 100,
    name: '影響範囲(Scope of impact)',
    fieldFormat: 'text',
    multiple: false,
  },
  ACCEPTANCE_PERSON: {
    id: 101,
    name: '受入担当者（Acceptance person）',
    fieldFormat: 'user',
    multiple: false,
  },
  INVESTIGATION_FILE: {
    id: 102,
    name: '調査ファイル (Investigation File)',
    fieldFormat: 'link',
    multiple: false,
  },
  BUG_REPORT_LINK: {
    id: 103,
    name: 'バグ報告リンク (Report bug)',
    fieldFormat: 'link',
    multiple: false,
  },
  TESTCASE_FILE: {
    id: 104,
    name: '試験事例ファイル （Testcase File）',
    fieldFormat: 'link',
    multiple: false,
  },
  SEVERITY: {
    id: 105,
    name: '重要度',
    fieldFormat: 'list',
    multiple: false,
  },
  OCCURRENCE_TIME: {
    id: 106,
    name: '発生日時(Occurrence time)',
    fieldFormat: 'string',
    multiple: false,
  },
  RECOVERY_DATE: {
    id: 109,
    name: 'リカバリー期日(Recovery date)',
    fieldFormat: 'date',
    multiple: false,
  },
  RECOVERY_COMPLETED: {
    id: 110,
    name: 'リカバリー完了(Recovery completed)',
    fieldFormat: 'bool',
    multiple: false,
  },
  PROVISIONAL_HANDLING_CONTENT: {
    id: 111,
    name: '暫定対応内容(PHC)',
    fieldFormat: 'text',
    multiple: false,
  },
  WORKAROUND: {
    id: 112,
    name: '運用回避方法(Workaround)',
    fieldFormat: 'text',
    multiple: false,
  },
  RECOVERY_CONTENT: {
    id: 113,
    name: 'リカバリー内容(Recovery content)',
    fieldFormat: 'text',
    multiple: false,
  },
  PROVISIONAL_HANDLING_DATE: {
    id: 114,
    name: '暫定対応予定日(PHD)',
    fieldFormat: 'date',
    multiple: false,
  },
  PROVISIONAL_HANDLING_COMPLETED_DATE: {
    id: 115,
    name: '暫定対応完了日(PHCD)',
    fieldFormat: 'date',
    multiple: false,
  },
  PROVISIONAL_HANDLING_IS_COMPLETED: {
    id: 116,
    name: '暫定対応完了(PHIC)',
    fieldFormat: 'bool',
    multiple: false,
  },
  PERMANENT_SOLUTION_CONTENT: {
    id: 117,
    name: '恒久対応内容(PSC)',
    fieldFormat: 'text',
    multiple: false,
  },
  PERMANENT_SOLUTION_PLANNED_DATE: {
    id: 118,
    name: '恒久対応予定日(PSPD)',
    fieldFormat: 'date',
    multiple: false,
  },
  PERMANENT_SOLUTION_COMPLETED_DATE: {
    id: 119,
    name: '恒久対応完了日(PSCD)',
    fieldFormat: 'date',
    multiple: false,
  },
  EMERGENCY_RELEASE: {
    id: 120,
    name: '緊急リリースフラグ(Emergency release)',
    fieldFormat: 'bool',
    multiple: false,
  },
  PAID_FUNCTION: {
    id: 121,
    name: '有償／無償(Paid function)',
    fieldFormat: 'bool',
    multiple: false,
  },
  REVIEWER: {
    id: 122,
    name: 'レビュー者(Reviewer)',
    fieldFormat: 'user',
    multiple: false,
  },
  PREVENTION_MEASURES: {
    id: 123,
    name: '再発防止策(Prevention measures)',
    fieldFormat: 'text',
    multiple: false,
  },
  SPEC_TICKET_FILE: {
    id: 124,
    name: 'チケット仕様書ファイル（Spec Ticket file）',
    fieldFormat: 'link',
    multiple: false,
  },
  STORY_POINT: {
    id: 125,
    name: 'ストーリーポイント(Story point)',
    fieldFormat: 'float',
    multiple: false,
  },
  ESTIMATE_REQUEST: {
    id: 126,
    name: '見積依頼',
    fieldFormat: 'bool',
    multiple: false,
  },
  ORIGINAL_TICKET: {
    id: 127,
    name: '発生元チケット',
    fieldFormat: 'string',
    multiple: false,
  },
  FILE_SPEC_STUDY: {
    id: 128,
    name: '仕様検討ファイル (FileSpecStudy)',
    fieldFormat: 'link',
    multiple: false,
  },
  PROD_RELEASE: {
    id: 131,
    name: 'Prod Release (本番反映)',
    fieldFormat: 'bool',
    multiple: false,
  },
} as const;

// ==================== Custom Field Options ====================

// 機能区分(Feature)
export const FEATURE_OPTIONS = [
  { value: 'AM: 社内システム', label: 'AM: 社内システム' },
  { value: 'AP: モバイルアプリ', label: 'AP: モバイルアプリ' },
  { value: 'AT: 勤務管理', label: 'AT: 勤務管理' },
  { value: 'BA: 共通', label: 'BA: 共通' },
  { value: 'BI：ビジネスインテリジェンス', label: 'BI：ビジネスインテリジェンス' },
  { value: 'CA: カレンダー', label: 'CA: カレンダー' },
  { value: 'CB: チャットボット', label: 'CB: チャットボット' },
  { value: 'CH: チャット', label: 'CH: チャット' },
  { value: 'CM: CMS', label: 'CM: CMS' },
  { value: 'DF: 安全性情報配信', label: 'DF: 安全性情報配信' },
  { value: 'DH: DPC分析', label: 'DH: DPC分析' },
  { value: 'DS: 薬剤検索', label: 'DS: 薬剤検索' },
  { value: 'EN: システム環境', label: 'EN: システム環境' },
  { value: 'GL: 診療ガイドライン', label: 'GL: 診療ガイドライン' },
  { value: 'GR: グループ', label: 'GR: グループ' },
  { value: 'HA: AI電話/予約', label: 'HA: AI電話/予約' },
  { value: 'RV: 患者予約', label: 'RV: 患者予約' },
  { value: 'ID: インサイトデータ', label: 'ID: インサイトデータ' },
  { value: 'MA: マスター', label: 'MA: マスター' },
  { value: 'ME: 面会・評価', label: 'ME: 面会・評価' },
  { value: 'MI: 移行', label: 'MI: 移行' },
  { value: 'OF: 公式サイト', label: 'OF: 公式サイト' },
  { value: 'OI: OpenID', label: 'OI: OpenID' },
  { value: 'OM: お見舞い', label: 'OM: お見舞い' },
  { value: 'PH: 薬薬連携', label: 'PH: 薬薬連携' },
  { value: 'PN: 本日の製薬ニュース', label: 'PN: 本日の製薬ニュース' },
  { value: 'PR: 製品説明会', label: 'PR: 製品説明会' },
  { value: 'PY: 決済', label: 'PY: 決済' },
  { value: 'QR: QRコード招待', label: 'QR: QRコード招待' },
  { value: 'RE: 登録', label: 'RE: 登録' },
  { value: 'RR: 副作用報告', label: 'RR: 副作用報告' },
  { value: 'RS: 副作用検索', label: 'RS: 副作用検索' },
  { value: 'SC: スコア計算', label: 'SC: スコア計算' },
  { value: 'SH: シフト', label: 'SH: シフト' },
  { value: 'SM: スマート面会', label: 'SM: スマート面会' },
  { value: 'SN:　スマート入院', label: 'SN:　スマート入院' },
  { value: 'TD: ターゲット医師', label: 'TD: ターゲット医師' },
  { value: 'WL：講演会', label: 'WL：講演会' },
  { value: 'WM: Web面談', label: 'WM: Web面談' },
  { value: 'SC: 出席管理', label: 'SC: 出席管理' },
  { value: 'N/A', label: 'N/A' },
] as const;

// Issue Type
export const ISSUE_TYPE_OPTIONS = [
  { value: '機能不全（Functionality）', label: '機能不全（Functionality）' },
  { value: '仕様不備（Spec issue）', label: '仕様不備（Spec issue）' },
  { value: '文書不備（Documentation）', label: '文書不備（Documentation）' },
  { value: '表示崩れ（UI）', label: '表示崩れ（UI）' },
  { value: 'ユーザビリティ（UX）', label: 'ユーザビリティ（UX）' },
  { value: '性能問題（Performance）', label: '性能問題（Performance）' },
  { value: 'セキュリティ（Security）', label: 'セキュリティ（Security）' },
  { value: '環境問題（Configuration)', label: '環境問題（Configuration)' },
  { value: '相互運用（Interoperability）', label: '相互運用（Interoperability）' },
  { value: '改善（Improvement）', label: '改善（Improvement）' },
] as const;

// 機能種別（Funcrion Type）
export const FUNCTION_TYPE_OPTIONS = [
  { value: '共通(common)', label: '共通(common)' },
  { value: 'ログイン(login)', label: 'ログイン(login)' },
  { value: '面会(meeting)', label: '面会(meeting)' },
  { value: 'プロフィール編集(edit prfile)', label: 'プロフィール編集(edit prfile)' },
  { value: 'チャット(chat)', label: 'チャット(chat)' },
  { value: 'カレンダー(calender)', label: 'カレンダー(calender)' },
  { value: '院内グループ(inside groupe)', label: '院内グループ(inside groupe)' },
  { value: '院外グループ(outside groupe)', label: '院外グループ(outside groupe)' },
  { value: '仲介機能(mediation)', label: '仲介機能(mediation)' },
  { value: '登録(regist)', label: '登録(regist)' },
  { value: '入退館(reception)', label: '入退館(reception)' },
  { value: '社内システム（管理者機能）(Administoration)', label: '社内システム（管理者機能）(Administoration)' },
  { value: 'モバイルアプリ(mobile app)', label: 'モバイルアプリ(mobile app)' },
  { value: 'システム環境(system enviromet)', label: 'システム環境(system enviromet)' },
  { value: '薬薬連携(hosptial&pharmacy network)', label: '薬薬連携(hosptial&pharmacy network)' },
  { value: 'Web面談(web meeting)', label: 'Web面談(web meeting)' },
  { value: 'シフト(shift)', label: 'シフト(shift)' },
  { value: '勤怠管理(attendance)', label: '勤怠管理(attendance)' },
  { value: '副作用報告(reaction report)', label: '副作用報告(reaction report)' },
  { value: '安全性情報(drug safty informastion)', label: '安全性情報(drug safty informastion)' },
  { value: '公式サイト(homepage)', label: '公式サイト(homepage)' },
] as const;

// Note
export const NOTE_OPTIONS = [
  { value: 'CEO', label: 'CEO' },
  { value: 'JP Engineer', label: 'JP Engineer' },
  { value: 'QA', label: 'QA' },
  { value: 'CS', label: 'CS' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Designer', label: 'Designer' },
  { value: 'BrSE', label: 'BrSE' },
  { value: 'Comtor', label: 'Comtor' },
  { value: 'iOS', label: 'iOS' },
  { value: 'Android', label: 'Android' },
  { value: 'Java', label: 'Java' },
  { value: 'Type Script', label: 'Type Script' },
  { value: 'HTML/CSS', label: 'HTML/CSS' },
  { value: 'Tester', label: 'Tester' },
] as const;

// 担当チーム (Assigned team)
export const TEAM_OPTIONS = [
  { value: '未選択', label: '未選択' },
  { value: 'DEV01：ゴク', label: 'DEV01：ゴク' },
  { value: 'DEV02：チャン', label: 'DEV02：チャン' },
  { value: 'DEV03：ハオ', label: 'DEV03：ハオ' },
  { value: 'DEV05：タム', label: 'DEV05：タム' },
  { value: 'DEV06：カット', label: 'DEV06：カット' },
  { value: 'DEV07：イエン', label: 'DEV07：イエン' },
  { value: 'DEV08：ヒロ', label: 'DEV08：ヒロ' },
  { value: 'DEV09：タイン', label: 'DEV09：タイン' },
  { value: 'DEV10：ルエン', label: 'DEV10：ルエン' },
  { value: 'DEV11：ジュン', label: 'DEV11：ジュン' },
  { value: 'DEV12：ジュン', label: 'DEV12：ジュン' },
  { value: 'DEV13：インフラ保守', label: 'DEV13：インフラ保守' },
  { value: 'DEV：共通', label: 'DEV：共通' },
  { value: 'JPチーム', label: 'JPチーム' },
] as const;

// 簡単なチケット・simple task
export const SIMPLE_TASK_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'Undefined', label: 'Undefined' },
] as const;

// 分類(Category)
export const CATEGORY_OPTIONS = [
  { value: '00_全社または間接部門', label: '00_全社または間接部門' },
  { value: '01_労務支援事業部', label: '01_労務支援事業部' },
  { value: '02_AI電話事業部', label: '02_AI電話事業部' },
  { value: '03_医薬連携事業部', label: '03_医薬連携事業部' },
  { value: '04_KDDI事業部', label: '04_KDDI事業部' },
  { value: '05_病棟支援事業部', label: '05_病棟支援事業部' },
] as const;

// 重要度
export const SEVERITY_OPTIONS = [
  { value: '1 文言、レイアウトなど、ユーザーの業務に影響しない', label: '1 文言、レイアウトなど、ユーザーの業務に影響しない' },
  { value: '2 特別なケース、少数のユーザーに影響する、データ更新などで解決出来る', label: '2 特別なケース、少数のユーザーに影響する、データ更新などで解決出来る' },
  { value: '3 数十ユーザーの業務に影響する', label: '3 数十ユーザーの業務に影響する' },
  { value: '4 数病院・企業のユーザー業務に影響する', label: '4 数病院・企業のユーザー業務に影響する' },
  { value: '5 システム停止、あるいは全ユーザーの業務に影響する"', label: '5 システム停止、あるいは全ユーザーの業務に影響する"' },
] as const;

// ==================== Type Definitions ====================
export type CustomFieldId = typeof CUSTOM_FIELDS[keyof typeof CUSTOM_FIELDS]['id'];
export type CustomFieldFormat = 'list' | 'string' | 'text' | 'date' | 'bool' | 'user' | 'link' | 'float';

export interface CustomFieldDefinition {
  id: number;
  name: string;
  fieldFormat: CustomFieldFormat;
  multiple: boolean;
}

export interface CustomFieldOption {
  value: string;
  label: string;
}
