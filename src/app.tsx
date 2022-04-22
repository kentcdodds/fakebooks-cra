import * as React from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { Spinner } from "utils";

const Index = React.lazy(() => import("./routes/index"));
const Dashboard = React.lazy(() => import("./routes/dashboard"));
const Accounts = React.lazy(() => import("./routes/accounts"));
const Expenses = React.lazy(() => import("./routes/expenses"));
const Reports = React.lazy(() => import("./routes/reports"));
const Sales = React.lazy(() => import("./routes/sales"));
const SalesIndex = React.lazy(() => import("./routes/sales/index"));
const Subscriptions = React.lazy(() => import("./routes/sales/subscriptions"));
const Customers = React.lazy(() => import("./routes/sales/customers"));
const Deposits = React.lazy(() => import("./routes/sales/deposits"));
const Invoices = React.lazy(() => import("./routes/sales/invoices"));
const InvoicesIndex = React.lazy(() => import("./routes/sales/invoices/index"));
const Invoice = React.lazy(() => import("./routes/sales/invoices/$invoiceId"));

const Spinnit = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense fallback={<Spinner className="p-32" />}>
    {children}
  </React.Suspense>
);

const SmallSpinnit = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense fallback={<Spinner className="p-8 h-[6rem]" />}>
    {children}
  </React.Suspense>
);

export default function App() {
  return (
    <Fakebooks>
      <Spinnit>
        <Routes>
          <Route>
            <Route
              path="dashboard"
              element={
                <Spinnit>
                  <Dashboard />
                </Spinnit>
              }
            />
            <Route
              path="accounts"
              element={
                <Spinnit>
                  <Accounts />
                </Spinnit>
              }
            />
            <Route
              path="expenses"
              element={
                <Spinnit>
                  <Expenses />
                </Spinnit>
              }
            />
            <Route
              path="reports"
              element={
                <Spinnit>
                  <Reports />
                </Spinnit>
              }
            />
            <Route
              index
              element={
                <Spinnit>
                  <Index />
                </Spinnit>
              }
            />
            <Route
              path="sales"
              element={
                <Spinnit>
                  <Sales />
                </Spinnit>
              }
            >
              <Route
                path="subscriptions"
                element={
                  <Spinnit>
                    <Subscriptions />
                  </Spinnit>
                }
              />
              <Route
                path="customers"
                element={
                  <Spinnit>
                    <Customers />
                  </Spinnit>
                }
              />
              <Route
                path="deposits"
                element={
                  <Spinnit>
                    <Deposits />
                  </Spinnit>
                }
              />
              <Route
                path="invoices"
                element={
                  <SmallSpinnit>
                    <Invoices />
                  </SmallSpinnit>
                }
              >
                <Route
                  path=":invoiceId"
                  element={
                    <SmallSpinnit>
                      <Invoice />
                    </SmallSpinnit>
                  }
                />
                <Route
                  index
                  element={
                    <SmallSpinnit>
                      <InvoicesIndex />
                    </SmallSpinnit>
                  }
                />
              </Route>
              <Route
                index
                element={
                  <Spinnit>
                    <SalesIndex />
                  </Spinnit>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Spinnit>
    </Fakebooks>
  );
}

function Fakebooks({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full rounded-lg bg-white text-gray-600">
      <div className="border-r border-gray-100 bg-gray-50">
        <div className="p-4">
          <Link to="." className="flex items-center text-[color:#23BF1F]">
            <FakebooksLogo className="relative top-[1px] h-[18px] w-[18px]" />
            <div className="w-1" />
            <div className="font-display text-d-p-sm">Fakebooks</div>
          </Link>
          <div className="h-7" />
          <div className="flex flex-col font-bold text-gray-800">
            <NavItem to="dashboard">Dashboard</NavItem>
            <NavItem to="accounts">Accounts</NavItem>
            <NavItem to="sales">Sales</NavItem>
            <NavItem to="expenses">Expenses</NavItem>
            <NavItem to="reports">Reports</NavItem>
            <a
              href="https://github.com/kentcdodds/fakebooks-cra"
              className="my-1 py-1 px-2 pr-16 text-[length:14px]"
            >
              GitHub ↗️
            </a>
          </div>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function NavItem({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `my-1 py-1 px-2 pr-16 text-[length:14px] ${
          isActive ? "rounded-md bg-gray-100" : ""
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function FakebooksLogo({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="#23BF1F"
        fillRule="evenodd"
        d="M12 3a9 9 0 000 18h4.5c1.398 0 2.097 0 2.648-.228a3 3 0 001.624-1.624C21 18.597 21 17.898 21 16.5V12a9 9 0 00-9-9zm-4 8a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm3 4a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
