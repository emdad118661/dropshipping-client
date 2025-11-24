import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Badge,
} from "flowbite-react";
import HeadSubhead from "../CommonComponents/HeadSubhead";

const API = import.meta.env.VITE_API_URL;
const getId = (o) => o?._id?.$oid || o?._id; // handle ObjectId/$oid

export default function Orders() {
  const [me, setMe] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load current user (role)
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API}/auth/me`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setMe(data?.user || null);
        } else setMe(null);
      } catch {
        setMe(null);
      } finally {
        setLoadingUser(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const allowed = me?.role === "admin" || me?.role === "superadmin";

  // Load orders
  useEffect(() => {
    if (!allowed) return;
    const controller = new AbortController();
    setLoading(true);
    setErr("");
    fetch(`${API}/orders`, { credentials: "include", signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setOrders)
      .catch((e) => {
        console.error(e);
        setErr("Failed to load orders");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [allowed]);

  // Actions
  const markReceived = async (id) => {
    try {
      const res = await fetch(`${API}/orders/${id}/received`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (getId(o) === id ? data.order : o)));
    } catch (e) {
      console.error(e);
      alert("Failed to mark as received");
    }
  };

  const removeOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setOrders((prev) => prev.filter((o) => getId(o) !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  };

  // ========== CSV EXPORT (NEW) ==========
  const buildCSV = (list) => {
    // wrap & escape value for CSV
    const q = (x) => {
      if (x === null || x === undefined) return '""';
      const s = String(x).replace(/"/g, '""');
      return `"${s}"`;
    };
    const headers = [
      "Order ID",
      "Created At",
      "Product",
      "Color",
      "Size",
      "Category",
      "Qty",
      "Unit Price",
      "Amount",
      "Currency",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Address",
      "Payment Method",
      "Payment Status",
      "Status",
    ];

    const rows = list.map((o) => {
      const id = getId(o) || o.orderId || "";
      const createdAt = o.createdAt ? new Date(o.createdAt).toLocaleString() : "";
      const name = o.product?.name ?? "";
      const color = o.product?.selected?.color ?? "";
      const size = o.product?.selected?.size ?? "";
      const category = o.product?.category ?? o.category ?? "";
      const qty = o.product?.qty ?? 1;
      const unitPrice = o.product?.price ?? "";
      const amount = o.amount?.subtotal ?? (o.product?.price || 0) * qty;
      const currency = o.amount?.currency ?? "BDT";
      const custName = o.customer?.name ?? "";
      const custEmail = o.customer?.email ?? "";
      const custPhone = o.customer?.phone ?? "";
      const address = o.customer?.address ?? "";
      const method = o.payment?.method ?? "";
      const payStatus = o.payment?.status ?? "";
      const status = o.status ?? "";

      const line = [
        id,
        createdAt,
        name,
        color,
        size,
        category,
        qty,
        unitPrice,
        amount,
        currency,
        custName,
        custEmail,
        custPhone,
        address,
        method,
        payStatus,
        status,
      ].map(q);
      return line.join(",");
    });

    // BOM for Excel + CRLF line endings
    return "\uFEFF" + [headers.map(q).join(","), ...rows].join("\r\n");
  };

  const handleExportCSV = () => {
    try {
      const csv = buildCSV(orders);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Export failed");
    }
  };
  // ========== CSV EXPORT END ==========

  const currency = (n, cur = "BDT") =>
    `${cur === "BDT" ? "৳" : cur + " "}${Number(n || 0).toLocaleString()}`;

  if (loadingUser) {
    return (
      <div className="mx-auto mt-10 max-w-7xl px-5 md:px-0">
        <HeadSubhead title="Orders So Far" subtitle="" />
        <div className="mt-10 text-center text-gray-500">Checking permission…</div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="mx-auto mt-10 max-w-7xl px-5 md:px-0">
        <HeadSubhead title="Orders So Far" subtitle="" />
        <div className="mt-10 text-center text-red-600">
          You are not authorized to view this page.
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeadSubhead title="Orders So Far" subtitle="" />
      <div className="mx-auto mt-10 w-full px-5 md:px-0">
        {/* Export button */}
        <div className="flex items-end justify-between gap-4">
          <Button color="light" onClick={handleExportCSV} disabled={loading || !orders.length}>
            Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table className="mt-10" hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Product</TableHeadCell>
                <TableHeadCell>Color</TableHeadCell>
                <TableHeadCell>Size</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Qty</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
                <TableHeadCell>Customer</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Phone</TableHeadCell>
                <TableHeadCell>Address</TableHeadCell>
                <TableHeadCell>Payment</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Actions</span>
                </TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center text-gray-500">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : err ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center text-red-600">
                    {err}
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center text-gray-500">
                    No orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => {
                  const id = getId(o);
                  const name = o.product?.name || "-";
                  const color = o.product?.selected?.color || "-";
                  const size = o.product?.selected?.size || "-";
                  const category = o.product?.category || o.category || "-";
                  const qty = o.product?.qty ?? 1;
                  const amount = o.amount?.subtotal ?? (o.product?.price || 0) * qty;

                  const status = o.status || "PLACED";
                  const received = status === "DELIVERED";

                  const custName = o.customer?.name || "-";
                  const custEmail = o.customer?.email || "-";
                  const custPhone = o.customer?.phone || "-";
                  const custAddress = o.customer?.address || "-";

                  const method = (o.payment?.method || "N/A").toUpperCase();
                  const payStatus = (o.payment?.status || "UNPAID").toUpperCase();

                  return (
                    <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {name}
                      </TableCell>
                      <TableCell>{color}</TableCell>
                      <TableCell>{size}</TableCell>
                      <TableCell>{category}</TableCell>
                      <TableCell>{qty}</TableCell>
                      <TableCell>{currency(amount, o.amount?.currency || "BDT")}</TableCell>

                      <TableCell className="whitespace-nowrap">{custName}</TableCell>
                      <TableCell className="max-w-xs break-all">
                        {custEmail !== "-" ? (
                          <a className="text-blue-600 hover:underline" href={`mailto:${custEmail}`}>
                            {custEmail}
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{custPhone}</TableCell>
                      <TableCell className="max-w-xs whitespace-pre-wrap break-words" title={custAddress}>
                        {custAddress}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge color={method === "COD" ? "gray" : "purple"}>{method}</Badge>
                          <span className="text-xs text-gray-500">({payStatus})</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {received ? (
                          <Badge color="success">received by customer</Badge>
                        ) : (
                          <Badge color="warning">{status.toLowerCase()}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="space-x-2">
                        {!received && (
                          <Button size="xs" color="success" onClick={() => markReceived(id)}>
                            Received
                          </Button>
                        )}
                        {me?.role === "superadmin" && (
                          <Button size="xs" color="failure" onClick={() => removeOrder(id)}>
                            Delete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}