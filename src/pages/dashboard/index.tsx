import { signOut, useSession } from "next-auth/react";
import {
	Container,
	Title,
	Text,
	Paper,
	Stack,
	Group,
	Avatar,
	Card,
	SimpleGrid,
	Button,
	Loader,
} from "@mantine/core";
import { IconUser, IconMail, IconCalendar } from "@tabler/icons-react";
import AppLayout from "@/components/layout/AppLayout";
import { NextPageWithLayout } from "@/types/common";
import { ReactElement } from "react";
import Link from "next/link";
const Dashboard: NextPageWithLayout = () => {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<Container
				size="xs"
				h="100vh"
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Loader />
			</Container>
		);
	}

	const handleLogout = () => {
		signOut({ callbackUrl: "/auth/signin" });
	};

	return (
		<Container size="lg">
			<Stack gap="xl">
				<Paper radius="lg" p="xl" withBorder>
					<Group align="flex-start">
						{session?.user?.image && (
							<Avatar
								src={session.user.image}
								alt={session.user.name || "Profile picture"}
								size={120}
								radius="xl"
								style={{
									border: "4px solid white",
									boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
								}}
							/>
						)}
						<Stack gap="xs">
							<Title order={2} style={{ color: "#1a1b1e" }}>
								{session?.user?.name}
							</Title>
							<Group gap="xs">
								<IconMail size={16} style={{ color: "#868e96" }} />
								<Text c="dimmed" size="sm">
									{session?.user?.email}
								</Text>
							</Group>
							<Group gap="xs">
								<IconCalendar size={16} style={{ color: "#868e96" }} />
								<Text c="dimmed" size="sm">
									Member since {new Date().toLocaleDateString()}
								</Text>
							</Group>
						</Stack>
					</Group>
				</Paper>

				<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
					<Card
						withBorder
						radius="lg"
						p="xl"
						style={{ background: "rgba(255, 255, 255, 0.9)" }}
					>
						<Stack gap="xs">
							<Group>
								<IconUser size={24} style={{ color: "#228be6" }} />
								<Title order={3}>Profile</Title>
							</Group>
							<Text c="dimmed" size="sm">
								Manage your account settings and preferences
							</Text>
						</Stack>
					</Card>

					<Card withBorder radius="lg" p="xl">
						<Stack gap="xs">
							<Group>
								<IconCalendar size={24} style={{ color: "#40c057" }} />
								<Title order={3}>Activity</Title>
							</Group>
							<Text c="dimmed" size="sm">
								View your recent activity and interactions
							</Text>
						</Stack>
					</Card>
				</SimpleGrid>
			</Stack>
			<Button onClick={handleLogout}>Logout</Button>
			<Button component={Link} href="/news">
				News
			</Button>
		</Container>
	);
};

Dashboard.getLayout = (page: ReactElement) => {
	return <AppLayout>{page}</AppLayout>;
};

export default Dashboard;
