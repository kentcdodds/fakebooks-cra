import { Outlet, useOutletContext } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LabelText } from "components";
import { InvoiceListItem } from "types";

function useSalesContext() {
  return useOutletContext() as { invoiceListItems: Array<InvoiceListItem> };
}

export default function InvoicesRoute() {
  const salesContext = useSalesContext();
  const { invoiceListItems } = salesContext;
  const overdueAmount = invoiceListItems.reduce(
    (sum, li) => sum + (li.dueStatus === "overdue" ? li.total : 0),
    0
  );
  const dueSoonAmount = invoiceListItems.reduce(
    (sum, li) => sum + (li.dueStatus === "due" ? li.total : 0),
    0
  );
  const hundo = dueSoonAmount + overdueAmount;
  const dueSoonPercent = Math.floor((dueSoonAmount / hundo) * 100);
  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <InvoicesInfo label="Overdue" amount={overdueAmount} />
        <div className="flex h-4 flex-1 overflow-hidden rounded-full">
          <div className="flex-1 bg-yellow-brand" />
          <div
            className="bg-green-brand"
            style={{ width: `${dueSoonPercent}%` }}
          />
        </div>
        <InvoicesInfo label="Due Soon" amount={dueSoonAmount} right />
      </div>
      <div className="h-4" />
      <LabelText>Invoice List</LabelText>
      <div className="h-2" />
      <InvoiceList>
        <Outlet context={salesContext} />
      </InvoiceList>
    </div>
  );
}

function InvoicesInfo({
  label,
  amount,
  right,
}: {
  label: string;
  amount: number;
  right?: boolean;
}) {
  return (
    <div className={right ? "text-right" : ""}>
      <LabelText>{label}</LabelText>
      <div className="text-[length:18px] text-black">
        ${amount.toLocaleString()}
      </div>
    </div>
  );
}

function InvoiceList({ children }: { children: React.ReactNode }) {
  const { invoiceListItems } = useSalesContext();
  return (
    <div className="flex rounded-lg border border-gray-100">
      <div className="w-1/2 border-r border-gray-100">
        {invoiceListItems.map((invoice, index) => (
          <NavLink
            key={index}
            to={invoice.id}
            className={({ isActive }) =>
              "block border-b border-gray-50 py-3 px-4 hover:bg-gray-50" +
              " " +
              (isActive ? "bg-gray-50" : "")
            }
          >
            <div className="flex justify-between text-[length:14px] font-bold leading-6">
              <div>{invoice.name}</div>
              <div>${invoice.total.toLocaleString()}</div>
            </div>
            <div className="flex justify-between text-[length:12px] font-medium leading-4 text-gray-400">
              <div>{invoice.number}</div>
              <div
                className={
                  "uppercase" +
                  " " +
                  (invoice.dueStatus === "paid"
                    ? "text-green-brand"
                    : invoice.dueStatus === "overdue"
                    ? "text-red-brand"
                    : "")
                }
              >
                {invoice.dueDisplay}
              </div>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="w-1/2">{children}</div>
    </div>
  );
}
