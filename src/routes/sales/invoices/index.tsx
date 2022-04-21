import * as React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { InvoiceListItem } from "types";

export default function InvoiceIndex() {
  const salesContext = useOutletContext() as {
    invoiceListItems: Array<InvoiceListItem>;
  };
  const navigate = useNavigate();

  const hasListItems = salesContext.invoiceListItems.length > 0;
  const [firstListItem] = salesContext.invoiceListItems;
  const mounted = React.useRef<Boolean>(false);

  React.useLayoutEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (hasListItems) {
      navigate(firstListItem.id);
    }
  }, [hasListItems, firstListItem, navigate]);

  if (hasListItems) {
    return <div>You shouldn't see this...</div>;
  } else {
    return <div>You don't have any invoices 😭</div>;
  }
}
