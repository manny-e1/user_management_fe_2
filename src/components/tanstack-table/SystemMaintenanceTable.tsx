"use client"
import Link from "next/link";
import Table from "./Table"
import { SysMaintenance, completeMntLogs } from '../../service/system-maintenance';
import { maintenanceListingColumns } from "@/lib/maintenance-listing-columns";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { usePermission } from "@/hooks/usePermission";
import Swal from 'sweetalert2'
import { API_URL } from "@/lib/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Actions = ({mnt} : {mnt: SysMaintenance}) => {
	const { id } = mnt;
	const user = usePermission();
	const channelStatus = mnt.iRakyatStatus + mnt.iBizRakyatStatus;

	const queryClient = useQueryClient();

	const completeMut = useMutation({
		mutationFn: completeMntLogs,
		onSuccess: async (data) => {
			if ('error' in data) {
				await Swal.fire({
					title: 'Error!',
					text: data.error,
					icon: 'error',
				});
				return;
			}
			queryClient.invalidateQueries({queryKey: ['system-maintenance']});
			await Swal.fire({
				title: 'Success!',
				text: "You\'ve successfully approved the system maintenance schedule.",
				icon: 'success',
			});
		}
	})

	const handleDeleteClick = async () => {
		await Swal.fire({
			title: 'Confirmation',
			text: "Are you sure you want to delete?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => {
			if (result.isConfirmed) {
				const resp = await fetch(`${API_URL}/maintenance/${id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({id: id})
				});

				queryClient.invalidateQueries({queryKey: ['system-maintenance']});
			}
		});
	}
	
	const handleCompleteRakyat = async () => {
		await Swal.fire({
			title: 'Confirmation',
			text: "Are you sure you want to mark as completed?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		}).then((result) => {
			if (result.isConfirmed) {
				completeMut.mutate({
					id: id,
					channel: 'rakyat'
				});
			}
		});
	}

	const handleCompleteBizRakyat = async () => {
		await Swal.fire({
			title: 'Confirmation',
			text: "Are you sure you want to mark as completed?",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel'
		}).then((result) => {
			if (result.isConfirmed) {
				completeMut.mutate({
					id: id,
					channel: 'bizRakyat'
				});
			}
		});
	}

	return (
		<div className="flex items-center gap-2">
			<Link
				href={`/portal/system-maintenance/view-detail/${id}`}
				className="text-blue-500"
			>
				View
			</Link>
			{
				(user?.role == 'normal user 2' && (channelStatus.indexOf('C') == -1 || (channelStatus.indexOf('C') != -1 && mnt.approvalStatus === 'Pending'))) &&
				 <>
					<Link
						href={`/portal/system-maintenance/edit/${id}`}
						className="text-blue-500"
					>
						Edit
					</Link>
					<span
						onClick={handleDeleteClick}
						className="text-blue-500 cursor-pointer"
					>
						Delete
					</span>
				 </>
			}
			{
				user?.role === 'normal user 2' && 
				<div className="flex flex-col gap-1">
					{
						mnt.iRakyatYN && mnt.iRakyatStatus == 'A' && (mnt.approvalStatus == 'Approved' || (mnt.approvalStatus == 'Pending' && mnt.submissionStatus == 'Marked')) && 
						<div className="flex items-center select-none hover:text-[#1cbb8c] cursor-pointer" onClick={handleCompleteRakyat}>
							<FiCheckCircle className="inline-block me-1" />i-Rakyat
						</div>
					}
					{
						mnt.iRakyatYN && mnt.iRakyatStatus == 'C' && mnt.approvalStatus == 'Pending' && 
						<div className="flex items-center select-none text-[#1cbb8c]">
							<FiCheckCircle className="inline-block me-1" />i-Rakyat
						</div>
					}
					{
						mnt.iBizRakyatYN && mnt.iBizRakyatStatus == 'A' && (mnt.approvalStatus == 'Approved' || (mnt.approvalStatus == 'Pending' && mnt.submissionStatus == 'Marked')) && 
						<div className="flex items-center select-none hover:text-[#1cbb8c] cursor-pointer" onClick={handleCompleteBizRakyat}>
							<FiCheckCircle className="inline-block me-1" />i-BizRakyat
						</div>
					}
					{
						mnt.iBizRakyatYN && mnt.iBizRakyatStatus == 'C' && mnt.approvalStatus == 'Pending' && 
						<div className="flex items-center select-none text-[#1cbb8c]">
							<FiCheckCircle className="inline-block me-1" />i-BizRakyat
						</div>
					}
				</div>
			}
		</div>
	)
}

const CheckBox = ({mnt}: {mnt: SysMaintenance}) => {
	return (
		<div className="p-1">
			{
				!(mnt.approvalStatus == 'Rejected' || mnt.approvalStatus == 'Approved') && <input
					type="checkbox"
					className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-sm border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10 focus:ring-0"
					id={mnt.id}
				/>
			}
		</div>
	)
}

const Channel = ({mnt}: {mnt:SysMaintenance}) => {
	return (
		<div className="flex flex-col gap-1">
			{
				mnt.iRakyatYN ? (
					<div className="flex justify-between items-center">
						<span className="flex items-center">
							<FiCircle size={10} className="inline me-1" />i-Rakyat
						</span>
						{
							((mnt.iRakyatStatus != '' &&
							mnt.approvalStatus != 'Pending' &&
							mnt.approvalStatus != 'Rejected') ||
							(mnt.submissionStatus == 'Marked')) &&
							<span className={`${mnt.iRakyatStatus == 'C' ? "bg-gray-100 text-gray-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-400 border border-gray-500" : "bg-red-100 text-red-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-red-400 border border-red-400"}`}>
								{
									mnt.iRakyatStatus == 'A' ? (
										<>Active</>
									) : (<>Complete</>)
								}
							</span>
						}
					</div>
				) : (<></>)
			}
			{
				mnt.iBizRakyatYN ? (
					<div className="flex justify-between items-center">
						<span className="flex items-center">
							<FiCircle size={10} className="inline me-1" />i-BizRakyat
						</span>
						{
							((mnt.iBizRakyatStatus != '' &&
							mnt.approvalStatus != 'Pending' &&
							mnt.approvalStatus != 'Rejected') ||
							(mnt.submissionStatus == 'Marked')) && <span className={`${mnt.iBizRakyatStatus == 'C' ? "bg-gray-100 text-gray-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-400 border border-gray-500" : "bg-red-100 text-red-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-red-400 border border-red-400"}`}>
								{
									mnt.iBizRakyatStatus == 'A' ? (
										<>Active</>
									) : (<>Complete</>)
								}
							</span>
						}
					</div>
				) : (<></>)
			}
		</div>
	)
}

const checkboxes = (mnt: SysMaintenance) => <CheckBox mnt={mnt} />
const channel = (mnt: SysMaintenance) => <Channel mnt={mnt} />
const actions = (mnt: SysMaintenance) => <Actions mnt={mnt} />

export default function SystemMaintenanceTable(
	{
		data,
		hide,
		onClick
	} : {
		data: SysMaintenance[],
		hide: boolean,
		onClick: () => void
	}
) {
	return (
		<Table
			data={data}
			hide={hide}
			onClick={onClick}
			columns={maintenanceListingColumns(checkboxes, channel, actions)}
			route="/portal/system-maintenance/request"
		/>
	)
}