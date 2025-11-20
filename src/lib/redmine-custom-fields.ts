/**
 * Redmine Custom Fields Configuration
 * Auto-generated from Redmine API
 * Last updated: 2025-11-21 00:49:51
 */

// ==================== Custom Fields ====================
export const CUSTOM_FIELDS = {
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
  PERSON_IN_CHARGE: {
    id: 13,
    name: '対応者(Person in-charge)',
    fieldFormat: 'user',
    multiple: false,
  },
  FIXED_MODULE: {
    id: 26,
    name: '修正モジュール（Fixed module）',
    fieldFormat: 'list',
    multiple: true,
  },
  CHANGED_CONTENT: {
    id: 10,
    name: 'ソースコード修正箇所（Changed content）',
    fieldFormat: 'text',
    multiple: false,
  },
  EST_FE: { id: 89, name: '予FE', fieldFormat: 'float', multiple: false },
  ACT_FE: { id: 93, name: '実FE', fieldFormat: 'float', multiple: false },
  EST_BE: { id: 88, name: '予BE', fieldFormat: 'float', multiple: false },
  ACT_BE: { id: 92, name: '実BE', fieldFormat: 'float', multiple: false },
  EST_IOS: { id: 91, name: '予iOS', fieldFormat: 'float', multiple: false },
  ACT_IOS: { id: 94, name: '実iOS', fieldFormat: 'float', multiple: false },
  EST_ANDROID: { id: 90, name: '予Android', fieldFormat: 'float', multiple: false },
  ACT_ANDROID: { id: 95, name: '実Android', fieldFormat: 'float', multiple: false },
  EST_TE: { id: 98, name: '予Te', fieldFormat: 'float', multiple: false },
  ACT_TE: { id: 99, name: '実Te', fieldFormat: 'float', multiple: false },
  STEPS_TO_REPRO: { id: 6, name: '再現手順(Steps to repro)', fieldFormat: 'text', multiple: false },
  EXPECTED_RESULT: { id: 15, name: '期待結果(Expected result)', fieldFormat: 'text', multiple: false },
  RESULT: { id: 36, name: '結果(Result)', fieldFormat: 'text', multiple: false },
  ENVIRONMENT: { id: 7, name: '発生環境(Environment)', fieldFormat: 'list', multiple: true },
  CAUSE_CLASSIFICATION: { id: 4, name: '原因分類(Cause classification)', fieldFormat: 'list', multiple: false },
  CAUSE_EXPLANATION: { id: 8, name: '原因説明(Cause explanation)', fieldFormat: 'text', multiple: false },
  FIX_PLAN: { id: 9, name: '対処計画(Fix plan)', fieldFormat: 'text', multiple: false },
  OS_BROWSER: { id: 52, name: 'OS/Browser', fieldFormat: 'list', multiple: true },
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

// 修正モジュール（Fixed module）
export const FIXED_MODULE_OPTIONS = [
  { value: 'N/A', label: 'N/A' },
  { value: 'android-drjoy', label: 'android-drjoy' },
  { value: 'android-prjoy', label: 'android-prjoy' },
  { value: 'broadcast-starter', label: 'broadcast-starter' },
  { value: 'common-data-starter', label: 'common-data-starter' },
  { value: 'configuration', label: 'configuration' },
  { value: 'google-cloud-functions', label: 'google-cloud-functions' },
  { value: 'ios-drjoy', label: 'ios-drjoy' },
  { value: 'ios-prjoy', label: 'ios-prjoy' },
  { value: 'ios-reception', label: 'ios-reception' },
  { value: 'protobuf', label: 'protobuf' },
  { value: 'service-ai', label: 'service-ai' },
  { value: 'service-admin', label: 'service-admin' },
  { value: 'service-admin-front', label: 'service-admin-front' },
  { value: 'service-attendance', label: 'service-attendance' },
  { value: 'service-attendance-front', label: 'service-attendance-front' },
  { value: 'service-attendance-sync', label: 'service-attendance-sync' },
  { value: 'service-banking', label: 'service-banking' },
  { value: 'service-banking-front', label: 'service-banking-front' },
  { value: 'service-batch', label: 'service-batch' },
  { value: 'service-chatbot', label: 'service-chatbot' },
  { value: 'service-checking-logs', label: 'service-checking-logs' },
  { value: 'service-calendar', label: 'service-calendar' },
  { value: 'service-cdn-front', label: 'service-cdn-front' },
  { value: 'service-certificate', label: 'service-certificate' },
  { value: 'service-cms', label: 'service-cms' },
  { value: 'service-config', label: 'service-config' },
  { value: 'service-distribution-function', label: 'service-distribution-function' },
  { value: 'service-drug-search', label: 'service-drug-search' },
  { value: 'service-elastic', label: 'service-elastic' },
  { value: 'service-external-calendar', label: 'service-external-calendar' },
  { value: 'service-fcm', label: 'service-fcm' },
  { value: 'service-framework', label: 'service-framework' },
  { value: 'service-functions', label: 'service-functions' },
  { value: 'service-group', label: 'service-group' },
  { value: 'service-iot', label: 'service-iot' },
  { value: 'service-master', label: 'service-master' },
  { value: 'service-materialized-view', label: 'service-materialized-view' },
  { value: 'service-meeting', label: 'service-meeting' },
  { value: 'service-mobile-front', label: 'service-mobile-front' },
  { value: 'service-monitor', label: 'service-monitor' },
  { value: 'service-mqtt-device', label: 'service-mqtt-device' },
  { value: 'service-notification', label: 'service-notification' },
  { value: 'service-oauth2-server', label: 'service-oauth2-server' },
  { value: 'service-oidc-server', label: 'service-oidc-server' },
  { value: 'service-payment', label: 'service-payment' },
  { value: 'service-payment-webhook', label: 'service-payment-webhook' },
  { value: 'service-pharmacy', label: 'service-pharmacy' },
  { value: 'service-presentation', label: 'service-presentation' },
  { value: 'service-publisher', label: 'service-publisher' },
  { value: 'service-reaction-reporting', label: 'service-reaction-reporting' },
  { value: 'service-reaction-search', label: 'service-reaction-search' },
  { value: 'service-reception-front', label: 'service-reception-front' },
  { value: 'service-recovery', label: 'service-recovery' },
  { value: 'service-registration', label: 'service-registration' },
  { value: 'service-rtc', label: 'service-rtc' },
  { value: 'service-rtm', label: 'service-rtm' },
  { value: 'service-sendgrid', label: 'service-sendgrid' },
  { value: 'service-sendgrid-webhook', label: 'service-sendgrid-webhook' },
  { value: 'service-shift', label: 'service-shift' },
  { value: 'service-side-menu', label: 'service-side-menu' },
  { value: 'service-storage-front', label: 'service-storage-front' },
  { value: 'service-sso-front', label: 'service-sso-front' },
  { value: 'service-subscriber', label: 'service-subscriber' },
  { value: 'service-targets', label: 'service-targets' },
  { value: 'service-web-front', label: 'service-web-front' },
  { value: 'service-web-lecture', label: 'service-web-lecture' },
  { value: 'service-web-meeting', label: 'service-web-meeting' },
  { value: 'service-hospital-alliance', label: 'service-hospital-alliance' },
  { value: 'service-school', label: 'service-school' },
  { value: 'service-school-front', label: 'service-school-front' },
  { value: 'service-sns-front', label: 'service-sns-front' },
  { value: 'service-telcom', label: 'service-telcom' },
  { value: 'service-fax', label: 'service-fax' },
  { value: 'service-fax-ocr', label: 'service-fax-ocr' },
  { value: 'web-admin', label: 'web-admin' },
  { value: 'web-at-clock', label: 'web-at-clock' },
  { value: 'web-chatbot', label: 'web-chatbot' },
  { value: 'web-drjoy', label: 'web-drjoy' },
  { value: 'web-joypass', label: 'web-joypass' },
  { value: 'web-school', label: 'web-school' },
  { value: 'service-sns', label: 'service-sns' },
  { value: 'web-reserve', label: 'web-reserve' },
  { value: 'service-reserve-front', label: 'service-reserve-front' },
  { value: 'service-reserve', label: 'service-reserve' },
  { value: 'service-wellness-front', label: 'service-wellness-front' },
  { value: 'service-wellness', label: 'service-wellness' },
  { value: 'service-jobs', label: 'service-jobs' },
  { value: 'looker-bigquery', label: 'looker-bigquery' },
  { value: 'service-smart-visitation', label: 'service-smart-visitation' },
  { value: 'android-smart-visitation', label: 'android-smart-visitation' },
  { value: 'service-smart-visitation-front', label: 'service-smart-visitation-front' },
  { value: 'service-ai-assistant', label: 'service-ai-assistant' },
  { value: 'service-ai-ssml', label: 'service-ai-ssml' },
  { value: 'service-twilio-webhook', label: 'service-twilio-webhook' },
  { value: 'service-ai-scenario', label: 'service-ai-scenario' },
  { value: 'service-ai-tune', label: 'service-ai-tune' },
] as const;

// 発生環境(Environment)
export const ENVIRONMENT_OPTIONS = [
  { value: 'Fruits', label: 'Fruits' },
  { value: 'Staging', label: 'Staging' },
  { value: 'Production', label: 'Production' },
] as const;

// 原因分類(Cause classification)
export const CAUSE_CLASSIFICATION_OPTIONS = [
  { value: 'B-2:実装バグ (開発) Implementation bug (Development)', label: 'B-2:実装バグ (開発) Implementation bug (Development)' },
  { value: 'A-1:仕様漏れ (仕様) Missing spec (Spec)', label: 'A-1:仕様漏れ (仕様) Missing spec (Spec)' },
] as const;

// OS/Browser
export const OS_BROWSER_OPTIONS = [
  { value: 'Browser-Chrome', label: 'Browser-Chrome' },
  { value: 'Browser-Safari', label: 'Browser-Safari' },
  { value: 'iOS', label: 'iOS' },
  { value: 'Android', label: 'Android' },
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

export type CustomFieldValue = string | string[] | number | boolean | null | undefined;
