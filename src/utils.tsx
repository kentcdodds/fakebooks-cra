import * as React from "react";
import { DueStatus, Invoice } from "./types";

type AsyncState<DataType> =
  | {
      status: "idle";
      data?: null;
      error?: null;
      promise?: null;
    }
  | {
      status: "pending";
      data?: null;
      error?: null;
      promise: Promise<DataType>;
    }
  | {
      status: "resolved";
      data: DataType;
      error: null;
      promise: null;
    }
  | {
      status: "rejected";
      data: null;
      error: Error;
      promise: null;
    };

type AsyncAction<DataType> =
  | { type: "reset" }
  | { type: "pending"; promise: Promise<DataType> }
  | { type: "resolved"; data: DataType; promise?: Promise<DataType> }
  | { type: "rejected"; error: Error; promise?: Promise<DataType> };

function asyncReducer<DataType>(
  state: AsyncState<DataType>,
  action: AsyncAction<DataType>
): AsyncState<DataType> {
  switch (action.type) {
    case "pending": {
      return {
        status: "pending",
        data: null,
        error: null,
        promise: action.promise,
      };
    }
    case "resolved": {
      if (action.promise && action.promise !== state.promise) return state;
      return {
        status: "resolved",
        data: action.data,
        error: null,
        promise: null,
      };
    }
    case "rejected": {
      if (action.promise && action.promise !== state.promise) return state;
      return {
        status: "rejected",
        data: null,
        error: action.error,
        promise: null,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function useAsync<DataType>() {
  const [state, dispatch] = React.useReducer<
    React.Reducer<AsyncState<DataType>, AsyncAction<DataType>>
  >(asyncReducer, {
    status: "idle",
    data: null,
    error: null,
  });

  const { data, error, status } = state;

  const run = React.useCallback((promise: Promise<DataType>) => {
    dispatch({ type: "pending", promise });
    promise.then(
      (data) => {
        dispatch({ type: "resolved", data, promise });
      },
      (error) => {
        dispatch({ type: "rejected", error, promise });
      }
    );
  }, []);

  const setData = React.useCallback(
    (data: DataType) => dispatch({ type: "resolved", data }),
    [dispatch]
  );
  const setError = React.useCallback(
    (error: Error) => dispatch({ type: "rejected", error }),
    [dispatch]
  );

  return {
    setData,
    setError,
    error,
    status,
    data,
    run,
  };
}

export const getDueStatus = (invoice: Invoice): DueStatus => {
  const days = Math.ceil(
    (new Date(invoice.dueDate).getTime() - asUTC(new Date()).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return invoice.paid ? "paid" : days < 0 ? "overdue" : "due";
};

export function getInvoiceDue(invoice: Invoice) {
  const days = Math.ceil(
    (new Date(invoice.dueDate).getTime() - asUTC(new Date()).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return invoice.paid
    ? "Paid"
    : days < 0
    ? "Overdue"
    : days === 0
    ? "Due Today"
    : `Due in ${days} Days`;
}

function asUTC(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

type ErrorBoundaryProps = {
  children: React.ReactNode;
  FallbackComponent: React.FunctionComponent<{ error: Error }>;
};
type ErrorBoundaryState = {
  error: null | Error;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    const { error } = this.state;
    if (error) {
      return <this.props.FallbackComponent error={error} />;
    }

    return this.props.children;
  }
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      // this is silly, but it works so there you go...
      className={`${className?.includes(" h-") ? "" : "h-full"} w-full ${
        className ?? ""
      }`}
    >
      <img
        src="/loading.gif"
        className="object-contain object-top w-full h-full"
        alt=""
      />
    </div>
  );
}
