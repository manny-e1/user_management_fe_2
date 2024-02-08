"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Section from "@/components/Section";
import { usePwdValidityQuery } from "@/hooks/useCheckPwdValidityQuery";
import { usePermission } from "@/hooks/usePermission";
import {
  SysMaintenance,
  SysMntInput,
  createMntLog,
  getMntLogs,
} from "@/service/system-maintenance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Swal from "sweetalert2";

export default function RequestMaintenancePage() {
  const user = usePermission();
  const router = useRouter();
  const [rows, setRows] = useState<SysMntInput[]>([]);
  const queryClient = useQueryClient();

  usePwdValidityQuery(user?.id);

  const mntLogsQry = useQuery({
    queryKey: ["system-maintenance"],
    queryFn: getMntLogs,
    refetchOnWindowFocus: false,
  });

  const requestMntMut = useMutation({
    mutationFn: createMntLog,
    onSuccess: (data) => {
      if ("error" in data) {
        Swal.fire({
          title: "Error!",
          text: data.error,
          icon: "error",
        });
        return;
      }
      queryClient.invalidateQueries(["system-maintenance"]);
      Swal.fire({
        title: "Success!",
        text: "You've successfully sent the request for approval.",
        icon: "success",
      }).then(() => {
        router.push("/portal/system-maintenance");
      });
    },
  });

  useEffect(() => {
    if (!rows.length) {
      addMntRow();
    }
  }, []);

  // Add new maintenance row
  const addMntRow = () => {
    setRows([
      ...rows,
      {
        fromDate: "",
        fromTime: "",
        toDate: "",
        toTime: "",
        iRakyat: false,
        iBizRakyat: false,
        minDate: "",
        minTime: "",
      },
    ]);
  };

  const deleteRows = (index: number) => {
    const tmpRows = rows.slice();
    tmpRows.splice(index, 1);
    setRows(tmpRows);
  };

  // Handle Input Data Change
  const handleFromDateChange = (value: string, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as SysMntInput;
    curData.fromDate = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  const handleFromTimeChange = (value: string, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as SysMntInput;
    curData.fromTime = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  const handleToDateChange = (value: string, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as SysMntInput;
    curData.toDate = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  const handleToTimeChange = (value: string, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as SysMntInput;
    curData.toTime = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  const handleIRakyatChange = (value: boolean, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as SysMntInput;
    curData.iRakyat = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  const handleIBizRakyatChange = (value: boolean, index: number) => {
    const tmpRows = rows.slice();
    const curData = tmpRows[index] as SysMntInput;
    curData.iBizRakyat = value;
    tmpRows.splice(index, 1, curData);
    setRows(tmpRows);
  };

  // Handle Save clicked
  const saveMaintenance = async () => {
    const data: {
      startDate: string;
      endDate: string;
      iRakyatYN: boolean;
      iBizRakyatYN: boolean;
      submittedBy: string;
    }[] = [];

    let mntLogs: SysMaintenance[] = [];
    if (mntLogsQry.data && "mntLogs" in mntLogsQry.data)
      mntLogs = mntLogsQry.data?.mntLogs ?? [];

    for (let i = 0; i < rows.length; ++i) {
      const item = rows[i];
      const startDate = new Date(item.fromDate + " " + item.fromTime).toISOString();
      const endDate = new Date(item.toDate + " " + item.toTime).toISOString();
      data.push({
        startDate: startDate,
        endDate: endDate,
        iRakyatYN: item.iRakyat,
        iBizRakyatYN: item.iBizRakyat,
        submittedBy: user?.email ?? "",
      });

      if (item.iRakyat === false && item.iBizRakyat === false) {
        await Swal.fire(
          "Error",
          "You must select at least one channel per maintenance.",
          "error"
        );
        return;
      }

      for (let k = i + 1; k < rows.length; ++ k) {
        const kStartDate = new Date(rows[k].fromDate + " " + rows[k].fromTime).toISOString();
        const kEndDate = new Date(rows[k].toDate + " " + rows[k].toTime).toISOString();
        if (
          ((item.iRakyat && rows[k].iRakyat) || (item.iBizRakyat && rows[k].iBizRakyat)) &&
          ((endDate >= kStartDate && endDate <= kEndDate) ||
          (startDate >= kStartDate && startDate <= kEndDate) ||
          (startDate >= kStartDate && endDate <= kEndDate) ||
          (startDate <= kStartDate && endDate >= kEndDate))
        ) {
          await Swal.fire(
            "Error",
            "System maintenance schedule is overlapping.",
            "error"
          );
          return;
        }
      }

      for (let k = 0; k < mntLogs.length; ++k) {
        if (
          ((item.iRakyat && mntLogs[k].iRakyatYN) || (item.iBizRakyat && mntLogs[k].iBizRakyatYN)) &&
          ((endDate >= mntLogs[k].startDate && endDate <= mntLogs[k].endDate) ||
          (startDate >= mntLogs[k].startDate && startDate <= mntLogs[k].endDate) ||
          (startDate >= mntLogs[k].startDate && endDate <= mntLogs[k].endDate) ||
          (startDate <= mntLogs[k].startDate && endDate >= mntLogs[k].endDate))
        ) {
          await Swal.fire(
            "Error",
            "System maintenance schedule is overlapping.",
            "error"
          );
          return;
        }
      }
    }

    requestMntMut.mutate(data);
  };

  const handleSaveClicked = async () => {
    const tmpRows: SysMntInput[] = [];
    for (let i = 0; i < rows.length; ++i) {
      const item = rows[i];
      const tmpItem = item;

      tmpItem.minTime = "";
      if (item.fromDate != "") {
        tmpItem.minDate = item.fromDate;
      }
      if (item.fromDate == item.toDate) {
        if (item.fromTime != "") item.minTime = item.fromTime;
      }
      tmpRows.push(tmpItem);
    }

    setRows(tmpRows);
  };

  const breadCrumbs = [{ name: "MANAGEMENT" }, { name: "System Maintenance" }];
  return (
    <div className="p-4">
      <BreadCrumbs breadCrumbs={breadCrumbs} />
      <Section
        outerTitle="OBW System Maintenance"
        innerTitle="New Request - System Maintenance"
      >
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            saveMaintenance();
          }}
          method="post"
        >
          <div className="flex justify-end items-center">
            <button
              type="button"
              className="text-blue-600 flex items-center hover:text-blue-400 active:text-blue-700 me-2"
              onClick={() => addMntRow()}
            >
              <FiPlus className="inline-block bg-blue-600 rounded-full text-white me-1" />
              Add New Shedule
            </button>
          </div>
          <table className="">
            <tbody>
              <tr>
                <td className="text-left font-bold pe-2">From Date</td>
                <td className="text-left font-bold px-2">From Time</td>
                <td className="text-left font-bold px-2">To Date</td>
                <td className="text-left font-bold px-2">To Time</td>
                <td className="text-left font-bold px-2" colSpan={2}></td>
                <td className="text-left font-bold px-2"></td>
              </tr>
              {rows.map((item: SysMntInput, index: number) => (
                <Fragment key={index}>
                  <tr>
                    <td className="pe-2">
                      <input
                        type="date"
                        value={item.fromDate}
                        onChange={(e) =>
                          handleFromDateChange(e.target.value, index)
                        }
                        className="form-control datetime-picker-size"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="time"
                        value={item.fromTime}
                        onChange={(e) =>
                          handleFromTimeChange(e.target.value, index)
                        }
                        className="form-control datetime-picker-size"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="date"
                        id={`endDate${index}`}
                        value={item.toDate}
                        onChange={(e) =>
                          handleToDateChange(e.target.value, index)
                        }
                        className="form-control datetime-picker-size"
                        min={item.minDate}
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="time"
                        id={`endTime${index}`}
                        value={item.toTime}
                        className="form-control datetime-picker-size"
                        onChange={(e) =>
                          handleToTimeChange(e.target.value, index)
                        }
                        min={item.minTime}
                        required
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="checkbox"
                        id={`checkbox1-${index}`}
                        checked={item.iRakyat}
                        onChange={(e) =>
                          handleIRakyatChange(e.target.checked, index)
                        }
                        className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 focus:ring-0"
                      />
                      <label
                        htmlFor={`checkbox1-${index}`}
                        className="form-label ms-1 select-none cursor-pointer"
                      >
                        iRakyat
                      </label>
                    </td>
                    <td className="p-2">
                      <input
                        type="checkbox"
                        id={`checkbox2-${index}`}
                        checked={item.iBizRakyat}
                        onChange={(e) =>
                          handleIBizRakyatChange(e.target.checked, index)
                        }
                        className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 focus:ring-0"
                      />
                      <label
                        htmlFor={`checkbox2-${index}`}
                        className="form-label ms-1 select-none cursor-pointer"
                      >
                        i-BizRakyat
                      </label>
                    </td>
                    <td className="ps-2">
                      <button
                        type="button"
                        className={`bg-[#dc3545] active:bg-[#de4060] text-white px-3 py-1 rounded-[4px] flex ${
                          index ? "" : "hidden"
                        }`}
                        onClick={() => deleteRows(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end gap-2 me-2">
            <Link
              href={"/portal/system-maintenance"}
              aria-disabled={requestMntMut.isLoading}
            >
              <button
                type="button"
                className={`bg-[#6c757d] hover:bg-[#5c636a] active:bg-[#565e64] text-white px-3 py-1 rounded-[4px] flex`}
              >
                Cancel
              </button>
            </Link>
            <button
              disabled={requestMntMut.isLoading}
              type="submit"
              className={`bg-[#3b7ddd] hover:bg-[#326abc] active:bg-[#2f64b1] text-white px-3 py-1 rounded-[4px] flex`}
              onClick={handleSaveClicked}
            >
              Save
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}
