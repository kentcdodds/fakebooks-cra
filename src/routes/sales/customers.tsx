import * as React from "react";
import { useAsync } from "utils";

type LoaderData = { experiments: Record<string, boolean> };

export default function CustomersRouteLoader() {
  const { run, status, error, data } = useAsync<LoaderData>();
  React.useEffect(() => {
    run(
      fetch(`${process.env.REACT_APP_API_URL}v1/experiments`).then((r) =>
        r.json()
      )
    );
  }, [run]);
  switch (status) {
    case "idle":
    case "pending": {
      return <img src="/loading.gif" alt="" />;
    }
    case "rejected": {
      throw error;
    }
    case "resolved": {
      if (!data?.experiments.customers) {
        return <div>Not found 404</div>;
      }
      return <CustomersRoute />;
    }
  }
}

function CustomersRoute() {
  return <div>We love our customers. Because money.</div>;
}
