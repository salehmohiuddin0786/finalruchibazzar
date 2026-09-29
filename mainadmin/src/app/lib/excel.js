"use client";

const humanizeKey = (key) =>
  String(key || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const flattenValue = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(flattenValue).join(", ");
  if (typeof value === "object") {
    const preferredFields = ["name", "fullName", "ownerName", "title", "email", "phone", "mobile", "city", "state", "status"];
    const readableValues = preferredFields
      .map((key) => value[key])
      .filter((item) => item !== null && item !== undefined && item !== "");

    if (readableValues.length > 0) return readableValues.map(flattenValue).join(" | ");

    return Object.entries(value)
      .filter(([key, item]) => key !== "password" && key !== "raw" && item !== null && item !== undefined && item !== "")
      .map(([key, item]) => `${humanizeKey(key)}: ${flattenValue(item)}`)
      .join(" | ");
  }
  return String(value);
};

const escapeCell = (value) =>
  flattenValue(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const safeFileName = (value) =>
  String(value || "report")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "report";

const isExportableKey = (key) => key && key !== "actions" && key !== "raw" && key !== "password";

export const exportRowsToExcel = ({ filename = "report", sheetName = "Report", rows = [], columns = [] }) => {
  const keySet = new Set(columns.map((column) => column.key).filter(isExportableKey));

  rows.forEach((row) => {
    Object.keys(row?.raw || {}).forEach((key) => {
      if (isExportableKey(key)) keySet.add(key);
    });
    Object.keys(row || {}).forEach((key) => {
      if (isExportableKey(key)) keySet.add(key);
    });
  });

  const keys = Array.from(keySet);

  const headers = keys.map((key) => columns.find((column) => column.key === key)?.label || humanizeKey(key));
  const bodyRows = rows.map((row) => keys.map((key) => row?.[key] ?? row?.raw?.[key]));
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    table { border-collapse: collapse; font-family: Arial, sans-serif; }
    th { background: #f1f5f9; font-weight: 700; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; mso-number-format: "\\@"; }
  </style>
</head>
<body>
  <table>
    <thead><tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join("")}</tr></thead>
    <tbody>
      ${bodyRows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeCell(cell)}</td>`).join("")}</tr>`)
        .join("")}
    </tbody>
  </table>
</body>
</html>`;

  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeFileName(filename)}.xls`;
  link.click();
  URL.revokeObjectURL(url);
};
