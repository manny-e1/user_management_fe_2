"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
// import Modal from '@/components/Modal';
import Section from "@/components/Section";
import TransactionTable from "@/components/tanstack-table/TransactionLimitTable";
import { usePwdValidityQuery } from "@/hooks/useCheckPwdValidityQuery";
import { usePermission } from "@/hooks/usePermission";
import { TxnLimit, getTxnLogs } from "@/service/transaction-limit";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { formatCurrency, removeComma, validateNumberInput } from '@/helper';
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import moment from "moment";
import { SortingState } from "@tanstack/react-table";

export default function TransactionLimitPage() {
  const user = usePermission();
  const router = useRouter();
  usePwdValidityQuery(user?.id);
  const txnLogsQry = useQuery({
    queryKey: ["transaction-limit"],
    queryFn: getTxnLogs,
    refetchOnWindowFocus: false,
  });

  const handleExport = (sorting?: SortingState) => {
    const rows: any[] = [];
    const sortField = sorting?.length ? sorting[0].id : "";
    const sortDesc =
      (sorting?.length ? sorting[0].desc : false) == false ? 1 : -1;
    const topColumnNames: any[] = [
      undefined,
      undefined,
      "Current Trx Limit (RM)",
      undefined,
      undefined,
      undefined,
      "New Trx Limit (RM)",
      undefined,
      "",
    ];
    const bottomColumnNames: any[] = [
      "No.#",
      "Submit Date & Time",
      "RIB",
      "RMB",
      "CIB",
      "CMB",
      "RIB",
      "RMB",
      "CIB",
      "CMB",
      "Status",
    ];

    let data: TxnLimit[] = [];
    if (txnLogsQry.data && "txnLogs" in txnLogsQry.data) {
      data = txnLogsQry.data.txnLogs.sort((a: TxnLimit, b: TxnLimit) => {
        if (sortField === "cRIB") return (a.nRMB - b.nRMB) * sortDesc;
        else if (sortField === "cRMB") return (a.cRMB - b.cRMB) * sortDesc;
        else if (sortField === "cCIB") return (a.cCIB - b.cCIB) * sortDesc;
        else if (sortField === "cCMB") return (a.cCMB - b.cCMB) * sortDesc;
        else if (sortField === "nRIB") return (a.nRIB - b.nRIB) * sortDesc;
        else if (sortField === "nRMB") return (a.nRMB - b.nRMB) * sortDesc;
        else if (sortField === "nCIB") return (a.nCIB - b.nCIB) * sortDesc;
        else if (sortField === "nCMB") return (a.nCMB - b.nCMB) * sortDesc;
        else if (sortField === "createdAt")
          return Number(a.createdAt > b.createdAt) * sortDesc;
        else if (sortField === "status") {
          const statusA =
            a.status == 0 ? "Pending" : a.status == 1 ? "Approved" : "Rejected";
          const statusB =
            b.status == 0 ? "Pending" : b.status == 1 ? "Approved" : "Rejected";
          return statusA.localeCompare(statusB) * sortDesc;
        } else return 1;
      });
    }

    //console.log(sortField, sortDesc, sorting);

    data.forEach((row) => {
      const rowData: any = [];
      rowData.push(row.tid);
      rowData.push(moment(row.createdAt).format("YYYY-MM-DD hh:mm A"));
      rowData.push(formatCurrency(Number(row.cRIB)));
      rowData.push(formatCurrency(Number(row.cRMB)));
      rowData.push(formatCurrency(Number(row.cCIB)));
      rowData.push(formatCurrency(Number(row.cCMB)));
      rowData.push(formatCurrency(Number(row.nRIB)));
      rowData.push(formatCurrency(Number(row.nRMB)));
      rowData.push(formatCurrency(Number(row.nCIB)));
      rowData.push(formatCurrency(Number(row.nCMB)));
      rowData.push(
        row.status == 0 ? "Pending" : row.status == 1 ? "Approved" : "Rejected"
      );
      rows.push(rowData);
    });

    const newData = [topColumnNames, bottomColumnNames, ...rows];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(newData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, ws, "MySheet");
    XLSX.writeFile(wb, "transaction limit.xlsx");
  };

  if (txnLogsQry.data && "error" in txnLogsQry.data) {
    return <p>{txnLogsQry.data.error}</p>;
  }

  const txnLogs =
    txnLogsQry.data?.txnLogs.map((item: TxnLimit, index: number) => {
      return {
        ...item,
        createdAt: moment(item.createdAt).format("YYYY-MM-DD hh:mm A"),
      };
    }) ?? [];

  const breadCrumbs = [{ name: "MANAGEMENT" }, { name: "Transaction Limit" }];
  return (
    <div className="p-4 text-[#495057] no-scrollbar">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="OBW Transaction Limit Maintenance"
        innerTitle="Transaction Limit"
      >
        <TransactionTable
          data={!txnLogs || txnLogsQry.isFetching ? [] : txnLogs}
          hide={user?.role === "manager 1"}
          onClick={handleExport}
        />
        <hr className="my-3" />
        <div className="mt-5 text-sm leading-[2.0]">
          <fieldset className="rounded xs:w-full border p-1 sm:w-2/4 md:w-1/4">
            <legend className="text-sm-start fs-4 float-none w-auto px-3 hover:cursor-pointer">
              Legend:
            </legend>
            <table>
              <tbody>
                <tr>
                  <td className="pl-1">RIB</td>
                  <td>: Retail Internet Banking</td>
                </tr>
                <tr>
                  <td className="pl-1">RMB</td>
                  <td>: Retail Mobile Banking</td>
                </tr>
                <tr>
                  <td className="pl-1">CIB</td>
                  <td>: Corporate Internet Banking</td>
                </tr>
                <tr>
                  <td className="pl-1">CMB</td>
                  <td>: Corporate Mobile Banking</td>
                </tr>
                <tr>
                  <td className="pl-1">Trx</td>
                  <td>: Transaction</td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>
      </Section>
    </div>
  );
}
