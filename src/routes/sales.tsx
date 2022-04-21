import * as React from "react";
import { NavLink, Outlet, useMatch } from "react-router-dom";
import { InvoiceListItem } from "types";
import { Spinner, useAsync } from "../utils";

type LoaderData = {
  invoiceListItems: Array<InvoiceListItem>;
  experiments: Record<string, boolean>;
};

const linkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? "font-bold text-black" : "";

export default function SalesRouteLoader() {
  const { run, status, error, data } = useAsync<LoaderData>();
  React.useEffect(() => {
    run(
      Promise.all([
        fetch("http://localhost:3000/api/v1/invoice").then((r) => r.json()),
        fetch("http://localhost:3000/api/v1/experiments").then((r) => r.json()),
      ]).then(([invoice, experiments]) => {
        return {
          ...invoice,
          ...experiments,
        };
      })
    );
  }, [run]);
  switch (status) {
    case "idle":
    case "pending": {
      return (
        <div className="relative h-full p-10">
          <div className="font-display text-d-h3 text-black">Sales</div>
          <div className="h-6" />
          <div className="flex gap-4 border-b border-gray-100 pb-4 text-[length:14px] font-medium text-gray-400">
            <div className="w-1/3 bg-gray-300 rounded animate-pulse">
              &nbsp;
            </div>
            <div className="w-1/3 bg-gray-300 rounded animate-pulse">
              &nbsp;
            </div>
            <div className="w-1/3 bg-gray-300 rounded animate-pulse">
              &nbsp;
            </div>
          </div>
          <div className="h-4" />
          <div className="h-[6rem]">
            <Spinner className="p-8" />
          </div>
        </div>
      );
    }
    case "rejected": {
      throw error;
    }
    case "resolved": {
      if (!data) {
        throw new Error("The API forgot to give us something...");
      }
      return <SalesRoute data={data} />;
    }
  }
}

function SalesRoute({ data }: { data: LoaderData }) {
  const indexMatches = Boolean(useMatch("/sales"));
  const invoiceMatches = Boolean(useMatch("/sales/invoices"));
  const firstInvoiceId = data.invoiceListItems?.[0].id;
  return (
    <div className="relative h-full p-10">
      <div className="font-display text-d-h3 text-black">Sales</div>
      <div className="h-6" />
      <div className="flex gap-4 border-b border-gray-100 pb-4 text-[length:14px] font-medium text-gray-400">
        <NavLink to="." className={linkClassName({ isActive: indexMatches })}>
          Overview
        </NavLink>
        <NavLink to="subscriptions" className={linkClassName}>
          Subscriptions
        </NavLink>
        <NavLink
          to={firstInvoiceId ? `invoices/${firstInvoiceId}` : "invoices"}
          className={linkClassName({ isActive: invoiceMatches })}
        >
          Invoices
        </NavLink>
        {data.experiments.customers ? (
          <NavLink to="customers" className={linkClassName}>
            Customers
          </NavLink>
        ) : null}
        <NavLink to="deposits" className={linkClassName}>
          Deposits
        </NavLink>
      </div>
      <div className="h-4" />
      <Outlet context={data} />
    </div>
  );
}
