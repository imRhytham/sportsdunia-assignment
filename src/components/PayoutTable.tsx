import { useEffect, useState } from "react";
import {
	Table,
	Button,
	Group,
	Text,
	Paper,
	Title,
	Stack,
	NumberInput,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPayoutRate, removePayoutRate } from "@/store/slices/payoutSlice";
import ExportPayoutData from "./ExportPayoutData";
import { fetchNews } from "@/store/slices/newsSlice";

interface AuthorStats {
	author: string;
	articleCount: number;
	totalPayout: number;
}

const PayoutTable = () => {
	const dispatch = useAppDispatch();
	const { authorStats } = useAppSelector((state) => state.news);
	const { rates } = useAppSelector((state) => state.payout);
	const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
	const [newRate, setNewRate] = useState<number>(0);

	console.log(authorStats, rates);

	useEffect(() => {
		dispatch(fetchNews());
	}, [dispatch]);

	// Transform authorStats from Redux store and calculate payouts based on current rates
	const authorStatsList: AuthorStats[] = Object.entries(authorStats).map(
		([author, stats]) => {
			const rate = rates.find((r) => r.author === author)?.rate || 0;
			return {
				author,
				articleCount: stats.count,
				totalPayout: stats.count * rate,
			};
		}
	);

	const handleEditRate = (author: string) => {
		const currentRate = rates.find((r) => r.author === author)?.rate || 0;
		setNewRate(currentRate);
		setEditingAuthor(author);
	};

	const handleSaveRate = (author: string) => {
		dispatch(setPayoutRate({ author, rate: newRate }));
		setEditingAuthor(null);
	};

	const handleRemoveRate = (author: string) => {
		dispatch(removePayoutRate(author));
	};

	const totalPayout = authorStatsList.reduce(
		(sum, stat) => sum + stat.totalPayout,
		0
	);

	return (
		<Paper p="md" withBorder>
			<Stack gap="md">
				<Group justify="space-between">
					<Title order={3}>Payout Management</Title>
					<Group>
						<Text fw={500}>Total Payout: ${totalPayout.toFixed(2)}</Text>
						<ExportPayoutData />
					</Group>
				</Group>

				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Author</Table.Th>
							<Table.Th>Articles</Table.Th>
							<Table.Th>Rate per Article</Table.Th>
							<Table.Th>Total Payout</Table.Th>
							<Table.Th>Actions</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{authorStatsList.map((stat) => (
							<Table.Tr key={stat.author}>
								<Table.Td>{stat.author}</Table.Td>
								<Table.Td>{stat.articleCount}</Table.Td>
								<Table.Td>
									{editingAuthor === stat.author ? (
										<Group gap="xs">
											<NumberInput
												value={newRate}
												onChange={(value) => setNewRate(Number(value))}
												min={0}
												step={0.01}
												style={{ width: "100px" }}
											/>
											<Button
												size="xs"
												variant="light"
												onClick={() => handleSaveRate(stat.author)}
											>
												Save
											</Button>
										</Group>
									) : (
										<Group gap="xs">
											<Text>
												$
												{(
													rates.find((r) => r.author === stat.author)?.rate || 0
												).toFixed(2)}
											</Text>
											<Button
												size="xs"
												variant="subtle"
												onClick={() => handleEditRate(stat.author)}
											>
												Edit
											</Button>
										</Group>
									)}
								</Table.Td>
								<Table.Td>${stat.totalPayout.toFixed(2)}</Table.Td>
								<Table.Td>
									<Button
										size="xs"
										variant="light"
										color="red"
										onClick={() => handleRemoveRate(stat.author)}
									>
										Remove
									</Button>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Stack>
		</Paper>
	);
};

export default PayoutTable;
