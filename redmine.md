# Redmine API Documentation

This document provides an overview of the Redmine API endpoints.

## Project Controller

### `GET /redmine/project/info`

*   **Summary**: Get project information with optional includes
*   **Description**: Retrieve project information, with the option to include additional details like trackers, issue categories, etc.
*   **Query Parameters**:
    *   `include` (optional): A comma-separated string of additional details to include (e.g., `trackers,issue_categories`).

### `GET /redmine/project/memberships`

*   **Summary**: Get project memberships with pagination
*   **Description**: Retrieve a paginated list of project memberships.
*   **Query Parameters**:
    *   `offset` (optional): The starting offset for pagination.
    *   `limit` (optional): The number of items to return per page.

### `GET /redmine/project/member-list`

*   **Summary**: Get static member list from UserInfo
*   **Description**: Retrieve a static list of members from the UserInfo utility.

### `GET /redmine/project/custom-fields`

*   **Summary**: Get filtered custom fields for trackers (Task, Bug, Dev)
*   **Description**: Retrieve custom fields that are visible and associated with 'Task', 'Bug', or 'Dev' trackers.

### `GET /redmine/project/users`

*   **Summary**: Get users with optional filters
*   **Description**: Retrieve a list of users, with optional filters.
*   **Query Parameters**:
    *   (Refer to `UsersQuerySchema` for available filters)

### `GET /redmine/project/fixed-versions`

*   **Summary**: Get fixed versions filtered by due date (last year onwards)
*   **Description**: Retrieve fixed versions with a due date from the last year onwards.

## Issue Controller

### `GET /redmine/issues/query-by-filters`

*   **Summary**: Get issues by filters
*   **Description**: Retrieve issues based on specified filter criteria.
*   **Query Parameters**:
    *   (Refer to `IssueQuerySchema` for available filters)

### `GET /redmine/issues/sprint-issues`

*   **Summary**: Get sprint issues
*   **Description**: Retrieve issues for a specific sprint (month) and assignee.
*   **Query Parameters**:
    *   `month`: The month of the sprint.
    *   `assignee_id`: The ID of the assignee.

### `GET /redmine/issues/detail/:id`

*   **Summary**: Get issue detail including children
*   **Description**: Retrieve detailed information for a specific issue, including its children.
*   **Parameters**:
    *   `id`: The ID of the issue.

### `GET /redmine/issues/:id`

*   **Summary**: Get a single issue
*   **Description**: Retrieve a single issue by its ID.
*   **Parameters**:
    *   `id`: The ID of the issue.

### `POST /redmine/issues/task`

*   **Summary**: Create a new task
*   **Description**: Create a new task in Redmine.
*   **Request Body**:
    *   (Refer to `CreateTaskRequestSchema` for the request body structure)

### `POST /redmine/issues/dev`

*   **Summary**: Create a new dev issue
*   **Description**: Create a new development issue in Redmine.
*   **Request Body**:
    *   (Refer to `CreateDevRequestSchema` for the request body.

### `POST /redmine/issues/bug`

*   **Summary**: Create a new bug report
*   **Description**: Create a new bug report in Redmine.
*   **Request Body**:
    *   (Refer to `CreateBugRequestSchema` for the request body structure)

### `PUT /redmine/issues/:id`

*   **Summary**: Update an existing issue
*   **Description**: Update an existing issue in Redmine.
*   **Parameters**:
    *   `id`: The ID of the issue to update.
*   **Request Body**:
    *   (Refer to `UpdateIssueRequestSchema` for the request body structure)

### `POST /redmine/issues/update-status-done-ratio`

*   **Summary**: Update status and done ratio for issues
*   **Description**: Automatically update the status and done ratio for a set of issues.

### `POST /redmine/issues/relations`

*   **Summary**: Create an issue relation
*   **Description**: Create a relation between two issues.
*   **Request Body**:
    *   `issueNumber`: The ID of the source issue.
    *   `relatedIssueNumber`: The ID of the target issue.

### `DELETE /redmine/issues/relations/:relationId`

*   **Summary**: Delete an issue relation
*   **Description**: Delete a relation between two issues.
*   **Parameters**:
    *   `relationId`: The ID of the relation to delete.

## Report Controller

### `POST /redmine/report/export-monthly-tickets`

*   **Summary**: Export monthly tickets to a spreadsheet
*   **Description**: Retrieves monthly managed tickets and exports them to a Google Spreadsheet.
*   **Request Body**:
    *   `year` (optional): The year for the report.
    *   `month` (optional): The month for the report.
    *   `isSubjectImprovementEnabled` (optional): Whether to enable subject improvement.
    *   `aiProvider` (optional): The AI provider to use.

### `POST /redmine/report/get-spreadsheet-url`

*   **Summary**: Get the spreadsheet URL
*   **Description**: Retrieves the hardcoded URL and ID of the Google Spreadsheet used for reports.

## Analytics Controller

### `POST /redmine/analytics/check-pcv`

*   **Summary**: Check PCV
*   **Description**: Performs a PCV check based on the provided request body.
*   **Request Body**:
    *   (Refer to `PCVCheckRequestSchema` for the request body structure)

### `POST /redmine/analytics/count-performance-tester`

*   **Summary**: Count tester performance
*   **Description**: Calculates and records the performance of testers.
*   **Request Body**:
    *   `startColumn`: The starting column for the data.
    *   `updateGoogleSheet`: Whether to update the Google Sheet.

### `POST /redmine/analytics/count-performance-developer`

*   **Summary**: Count developer performance
*   **Description**: Calculates and records the performance of developers.
*   **Request Body**:
    *   `startColumn`: The starting column for the data.
    *   `updateGoogleSheet`: Whether to update the Google Sheet.

### `POST /redmine/analytics/count-retrospective`

*   **Summary**: Count retrospective data
*   **Description**: Gathers and processes data for team retrospectives.
*   **Request Body**:
    *   `startRowIndex`: The starting row index for the data.
    *   `updateGoogleSheet`: Whether to update the Google Sheet.

### `POST /redmine/analytics/count-bug-trends`

*   **Summary**: Count bug trends
*   **Description**: Counts and analyzes bug trends for different teams.

### `POST /redmine/analytics/update-bug-trends-issues`

*   **Summary**: Update bug trends issues
*   **Description**: Updates the issues related to bug trends for various teams.

### `GET /redmine/analytics/get-month-issue`

*   **Summary**: Get issues for the current month
*   **Description**: Retrieves issues for the current month based on specified query parameters.
*   **Query Parameters**:
    *   (Refer to `MonthIssueQuerySchema` for available filters)

### `GET /redmine/analytics/analytics-members-spent-time`

*   **Summary**: Analyze members' spent time
*   **Description**: Analyzes the time spent by members on various issues.
*   **Query Parameters**:
    *   (Refer to `MembersSpentTimeQuerySchema` for available filters)

### `GET /redmine/analytics/test`

*   **Summary**: Test endpoint
*   **Description**: A test endpoint to verify service availability.
