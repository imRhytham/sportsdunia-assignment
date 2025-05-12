import { Button, Menu } from "@mantine/core";
import {
	IconDownload,
	IconFileSpreadsheet,
	IconFileText,
	IconTable,
} from "@tabler/icons-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Article {
	title: string;
	description: string;
	creator?: string[];
	source_name: string;
	category?: string[];
	pubDate: string;
	sentiment?: string;
}

interface ExportDataProps {
	data: Article[];
	filename?: string;
}

const ExportData = ({ data, filename = "export" }: ExportDataProps) => {
	const exportToCSV = () => {
		const headers = [
			"Title",
			"Description",
			"Author",
			"Source",
			"Category",
			"Published Date",
			"Sentiment",
		];
		const csvData = data.map((article) => [
			article.title,
			article.description,
			article.creator?.join(", ") || "",
			article.source_name,
			article.category?.join(", ") || "",
			article.pubDate,
			article.sentiment || "",
		]);

		const csvContent = [
			headers.join(","),
			...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `${filename}.csv`;
		link.click();
	};

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			data.map((article) => ({
				Title: article.title,
				Description: article.description,
				Author: article.creator?.join(", ") || "",
				Source: article.source_name,
				Category: article.category?.join(", ") || "",
				"Published Date": article.pubDate,
				Sentiment: article.sentiment || "",
			}))
		);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "News Data");
		XLSX.writeFile(workbook, `${filename}.xlsx`);
	};

	const exportToPDF = () => {
		const doc = new jsPDF();
		const headers = [
			["Title", "Author", "Source", "Category", "Published Date", "Sentiment"],
		];
		const pdfData = data.map((article) => [
			article.title,
			article.creator?.join(", ") || "",
			article.source_name,
			article.category?.join(", ") || "",
			article.pubDate,
			article.sentiment || "",
		]);

		(doc as any).autoTable({
			head: headers,
			body: pdfData,
			startY: 20,
			theme: "grid",
			styles: { fontSize: 8 },
			headStyles: { fillColor: [41, 128, 185] },
		});

		doc.save(`${filename}.pdf`);
	};

	return (
		<Menu shadow="md" width={200}>
			<Menu.Target>
				<Button leftSection={<IconDownload size={16} />} variant="light">
					Export Data
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

export default ExportData;
