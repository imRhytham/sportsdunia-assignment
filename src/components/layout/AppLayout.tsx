import {
	AppShell,
	Text,
	Group,
	Stack,
	UnstyledButton,
	Burger,
	Menu,
	Avatar,
	ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	IconNews,
	IconTable,
	IconDashboard,
	IconChartBar,
	Icon as TablerIcon,
	IconLogout,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const navItems = [
	{ icon: IconDashboard, label: "Dashboard", href: "/dashboard" },
	{ icon: IconChartBar, label: "Analytics", href: "/analytics" },
	{ icon: IconNews, label: "News", href: "/news" },
	{ icon: IconTable, label: "Payout Table", href: "/payout" },
];

interface AppLayoutProps {
	children: ReactNode;
}

const NavItem = ({
	Icon,
	label,
	href,
	active,
}: {
	Icon: TablerIcon;
	label: string;
	href: string;
	active: boolean;
}) => (
	<UnstyledButton
		component="a"
		href={href}
		style={(theme) => ({
			display: "block",
			width: "100%",
			padding: theme.spacing.xs,
			borderRadius: theme.radius.sm,
			color: theme.colors.gray[7],
			backgroundColor: active ? theme.colors.blue[0] : "transparent",
			"&:hover": {
				backgroundColor: theme.colors.gray[0],
			},
		})}
	>
		<Group>
			<Icon size={20} />
			<Text size="sm">{label}</Text>
		</Group>
	</UnstyledButton>
);

const AppLayout = ({ children }: AppLayoutProps) => {
	const router = useRouter();
	const [mobileOpened, mobileSidebarHandler] = useDisclosure(false);
	const { data: session } = useSession();

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 250,
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened },
			}}
			padding="md"
		>
			<AppShell.Header>
				<Group h="100%" px="md" justify="space-between">
					<Group>
						<Text size="xl" fw={700}>
							Admin Panel
						</Text>
						<Burger
							hiddenFrom="sm"
							opened={mobileOpened}
							onClick={mobileSidebarHandler.toggle}
							color="#fff"
							size="sm"
						/>
					</Group>

					<Menu shadow="md" width={200}>
						<Menu.Target>
							<ActionIcon variant="transparent">
								<Group gap={7}>
									<Avatar radius="xl">
										{session?.user?.image && (
											<Image
												src={session?.user?.image}
												alt={session?.user?.name || "User"}
												fill
												className="object-cover rounded-full h-7 w-7"
											/>
										)}
									</Avatar>
								</Group>
							</ActionIcon>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Item
								color="red"
								leftSection={<IconLogout size={14} />}
								onClick={() => signOut({ callbackUrl: "/auth/signin" })}
							>
								Logout
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Group>
			</AppShell.Header>

			<AppShell.Navbar p="md">
				<Stack gap="xs">
					{navItems.map((item) => (
						<NavItem
							key={item.href}
							Icon={item.icon}
							label={item.label}
							href={item.href}
							active={router.pathname === item.href}
						/>
					))}
				</Stack>
			</AppShell.Navbar>

			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	);
};

export default AppLayout;
