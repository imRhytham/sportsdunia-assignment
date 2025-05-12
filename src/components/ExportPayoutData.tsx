import { Button, Menu } from "@mantine/core";
import {
	IconDownload,
	IconFileSpreadsheet,
	IconFileText,
	IconTable,
} from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useAppSelector } from "@/store/hooks";

// Add type declaration for jsPDF with autoTable
declare module "jspdf" {
	interface jsPDF {
		autoTable: (options: {
			head?: string[][];
			body?: string[][];
			theme?: string;
			styles?: object;
			margin?: { top: number; right: number; bottom: number; left: number };
		}) => jsPDF;
	}
}

interface PayoutData {
	author: string;
	articleCount: number;
	ratePerArticle: number;
	totalPayout: number;
}

const ExportPayoutData = () => {
	const { rates } = useAppSelector((state) => state.payout);
	const { filteredArticles } = useAppSelector((state) => state.news);

	const getPayoutData = (): PayoutData[] => {
		const authorStats = filteredArticles.reduce(
			(acc: { [key: string]: PayoutData }, article) => {
				if (!article.creator) return acc;

				article.creator.forEach((author) => {
					const rate = rates.find((r) => r.author === author)?.rate || 0;

					if (!acc[author]) {
						acc[author] = {
							author,
							articleCount: 1,
							ratePerArticle: rate,
							totalPayout: rate,
						};
					} else {
						acc[author].articleCount += 1;
						acc[author].totalPayout += rate;
					}
				});

				return acc;
			},
			{}
		);

		return Object.values(authorStats);
	};

	const exportToCSV = () => {
		const data = getPayoutData();
		const headers = ["Author", "Articles", "Rate per Article", "Total Payout"];
		const csvData = data.map((item) => [
			item.author,
			item.articleCount,
			item.ratePerArticle,
			item.totalPayout,
		]);

		const csvContent = [
			headers.join(","),
			...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "payout-data.csv";
		link.click();
	};

	const exportToExcel = () => {
		const data = getPayoutData();
		const worksheet = XLSX.utils.json_to_sheet(
			data.map((item) => ({
				Author: item.author,
				Articles: item.articleCount,
				"Rate per Article": item.ratePerArticle,
				"Total Payout": item.totalPayout,
			}))
		);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Payout Data");
		XLSX.writeFile(workbook, "payout-data.xlsx");
	};

	const exportToPDF = () => {
		const data = getPayoutData();
		const doc = new jsPDF();
		const headers = [
			["Author", "Articles", "Rate per Article", "Total Payout"],
		];
		const pdfData = data.map((item) => [
			item.author,
			item.articleCount.toString(),
			item.ratePerArticle.toString(),
			item.totalPayout.toString(),
		]);

		autoTable(doc, {
			head: headers,
			body: pdfData,
			startY: 20,
			theme: "grid",
			styles: { fontSize: 8 },
			headStyles: { fillColor: [41, 128, 185] },
		});

		doc.save("payout-data.pdf");
	};

	return (
		<Menu shadow="md" width={200}>
			<Menu.Target>
				<Button leftSection={<IconDownload size={16} />} variant="light">
					Export Payout Data
				</Button>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item
					leftSection={<IconFileText size={16} />}
					onClick={exportToCSV}
				>
					Export as CSV
				</Menu.Item>
				<Menu.Item
					leftSection={<IconFileSpreadsheet size={16} />}
					onClick={exportToExcel}
				>
					Export as Excel
				</Menu.Item>
				<Menu.Item leftSection={<IconTable size={16} />} onClick={exportToPDF}>
					Export as PDF
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export default ExportPayoutData;
