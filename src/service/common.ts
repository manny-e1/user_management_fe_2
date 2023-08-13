import { API_URL } from "@/lib/config";

export async function getPendingCounts(type: string) {
	const res = await fetch(`${API_URL}/common/pending`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({type: type})
	});

	const result : {error: Error} | {count: number} = await res.json();
	return result;
}