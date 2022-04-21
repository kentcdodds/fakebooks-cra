import * as React from "react";
import { useParams } from "react-router-dom";
import { LabelText } from "components";
import { Invoice } from "types";
import { getInvoiceDue, Spinner, useAsync } from "utils";

type LoaderData = {
  invoice: Invoice;
};

export default function InvoiceRouteLoader() {
  const params = useParams();
  const { run, status, error, data } = useAsync<LoaderData>();
  React.useEffect(() => {
    run(
      fetch(`http://localhost:3000/api/v1/invoice/${params.invoiceId}`).then(
        (r) => r.json()
      )
    );
  }, [run, params.invoiceId]);
  switch (status) {
    case "idle":
    case "pending": {
      return (
        <div className="h-64">
          <Spinner className="p-12" />
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
      return <InvoiceRoute data={data} />;
    }
  }
}

function InvoiceRoute({ data }: { data: LoaderData }) {
  const totalDue = data.invoice.lineItems.reduce(
    (total, item) => total + item.amount,
    0
  );
  const dueDisplay = getInvoiceDue(data.invoice);
  const invoiceDateDisplay = new Date(
    data.invoice.invoiceDate
  ).toLocaleDateString();

  return (
    <div className="relative p-10">
      <div className="text-[length:14px] font-bold leading-6">
        {data.invoice.name}
      </div>
      <div className="text-[length:32px] font-bold leading-[40px]">
        ${totalDue.toLocaleString()}
      </div>
      <LabelText>
        {dueDisplay} • Invoiced {invoiceDateDisplay}
      </LabelText>
      <div className="h-4" />
      {data.invoice.lineItems.map((item) => (
        <LineItem key={item.id} label={item.label} amount={item.amount} />
      ))}
      <LineItem
        bold
        label="Net Total"
        amount={data.invoice.lineItems.reduce((sum, li) => sum + li.amount, 0)}
      />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <div className="absolute inset-0 flex justify-center bg-red-100 pt-4">
      <div className="text-center text-red-brand">
        <div className="text-[14px] font-bold">Oh snap!</div>
        <div className="px-2 text-[12px]">
          There was a problem loading this invoice
        </div>
      </div>
    </div>
  );
}

function LineItem({
  label,
  amount,
  bold,
}: {
  label: string;
  amount: number;
  bold?: boolean;
}) {
  return (
    <div
      className={
        "flex justify-between border-t border-gray-100 py-4 text-[14px] leading-[24px]" +
        " " +
        (bold ? "font-bold" : "")
      }
    >
      <div>{label}</div>
      <div>${amount.toLocaleString()}</div>
    </div>
  );
}
