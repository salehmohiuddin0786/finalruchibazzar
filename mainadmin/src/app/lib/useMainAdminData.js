"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "./api";

export function useMainAdminData(path, initialRows = []) {
  const [rows, setRows] = useState(initialRows);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setLoading(true);
      const response = await apiRequest(path);
      setData(response);
      setRows(response.rows || []);
    } catch (err) {
      setError(err.message || "Failed to load data");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { rows, setRows, data, loading, error, refresh: load };
}
