import { Issue } from '@/types/redmine';

// Real data from Redmine API - Task #202198
export const TASK_202198: Issue = {
    id: 202198,
    project: { id: 37, name: "ベトナム（VN）" },
    tracker: { id: 7, name: "Task" },
    status: { id: 5, name: "Closed", is_closed: true },
    priority: { id: 2, name: "Normal" },
    author: { id: 411, name: "pgtest@drjoy.vn Tool" },
    assigned_to: { id: 520, name: "tam.truong Te" },
    fixed_version: { id: 220, name: "250822" },
    parent: { id: 202193 },
    subject: "[BugFruit]JP_AT0104_福島県立医科大学病院_手当申請機能の開発 | Bệnh viện Fukushima_Phát triển chức năng request phụ cấp",
    description: "",
    start_date: null,
    due_date: null,
    done_ratio: 100,
    is_private: false,
    estimated_hours: null,
    total_estimated_hours: 184.0,
    spent_hours: 0.0,
    total_spent_hours: 180.25,
    custom_fields: [
        { id: 37, name: "機能区分(Feature)", multiple: true, value: ["N/A"] },
        { id: 97, name: "分類(Category)", value: "01_ビーコン事業部" },
        { id: 86, name: "担当チーム (Assigned team)", value: "DEV05：チュンハイ" },
        { id: 101, name: "受入担当者（Acceptance person）", value: "" },
        { id: 125, name: "ストーリーポイント(Story point)", value: "" }
    ],
    created_on: "2025-06-30T06:12:13Z",
    updated_on: "2025-10-27T03:03:04Z",
    closed_on: "2025-08-11T04:17:52Z"
};

// Real data from Redmine API - Bug #205772
export const BUG_205772: Issue = {
    id: 205772,
    project: { id: 37, name: "ベトナム（VN）" },
    tracker: { id: 1, name: "Bug" },
    status: { id: 5, name: "Closed", is_closed: true },
    priority: { id: 2, name: "Normal" },
    author: { id: 520, name: "tam.truong Te" },
    assigned_to: { id: 537, name: "dao.tran Ja" },
    fixed_version: { id: 220, name: "250822" },
    parent: { id: 202198 },
    subject: "[BugFruit] AT0104, AT0105 Lỗi sort sai danh sách category",
    description: "!clipboard-202507221615-mnvng.png!\r\n",
    start_date: "2025-07-23",
    due_date: "2025-07-23",
    done_ratio: 100,
    is_private: false,
    estimated_hours: 8.0,
    total_estimated_hours: 8.0,
    spent_hours: 8.0,
    total_spent_hours: 8.0,
    custom_fields: [
        { id: 105, name: "重要度", value: "" },
        { id: 37, name: "機能区分(Feature)", multiple: true, value: ["AT: 勤務管理"] },
        { id: 97, name: "分類(Category)", value: "01_ビーコン事業部" },
        { id: 86, name: "担当チーム (Assigned team)", value: "DEV05：チュンハイ" },
        { id: 101, name: "受入担当者（Acceptance person）", value: "" },
        // Additional custom fields...
    ],
    created_on: "2025-07-22T09:15:24Z",
    updated_on: "2025-10-27T03:03:04Z",
    closed_on: "2025-07-23T09:05:58Z"
};

// Real data from Redmine API - Dev #181930
export const DEV_181930: Issue = {
    id: 181930,
    project: { id: 37, name: "ベトナム（VN）" },
    tracker: { id: 12, name: "Dev" },
    status: { id: 12, name: "Released", is_closed: true },
    priority: { id: 3, name: "High" },
    author: { id: 257, name: "片桐 katagiri" },
    assigned_to: { id: 607, name: "hang.pham Com" },
    fixed_version: { id: 220, name: "250822" },
    subject: "JP_AT0104_福島県立医科大学病院_手当申請機能の開発 |Tạo chức năng nhân viên gửi yêu cầu phụ cấp cho Bệnh viện Đại học Y khoa tỉnh Fukushima",
    description: `[有償開発]
手当申請機能の開発

[開発内容]
就業規則・給与規定にある特殊勤務手当をDr.JOY勤務管理に手当機能として追加し
給与連携などに集計...`,
    start_date: "2025-01-29",
    due_date: "2025-08-22",
    done_ratio: 100,
    is_private: false,
    estimated_hours: null,
    total_estimated_hours: 1942.0,
    spent_hours: 8.0,
    total_spent_hours: 1993.75,
    custom_fields: [
        { id: 37, name: "機能区分(Feature)", multiple: true, value: ["AT: 勤務管理"] },
        { id: 97, name: "分類(Category)", value: "01_ビーコン事業部" },
        { id: 86, name: "担当チーム (Assigned team)", value: "DEV05：チュンハイ" },
        { id: 125, name: "ストーリーポイント(Story point)", value: "20" },
        // More custom fields...
    ],
    created_on: "2025-01-29T08:39:18Z",
    updated_on: "2025-11-20T07:24:53Z",
    closed_on: "2025-09-11T03:29:04Z"
};
