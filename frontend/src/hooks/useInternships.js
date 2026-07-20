import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listInternships } from "../api/internships";

export function useInternships(filters = {}) {
  const { token } = useAuth();
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    listInternships(filters, token)
      .then((data) => {
        if (!cancelled) setInternships(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(filters), token]);

  return { internships, isLoading, error };
}
