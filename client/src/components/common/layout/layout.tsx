import React from "react"
import { Navigate } from "./navigate"
import { AppShell, Header, Title } from "@mantine/core"

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <AppShell
      padding="md"
      navbar={<Navigate />}
      header={<Header height={60} p="xs"><Title>Ticketing App</Title></Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {children}
    </AppShell>
  )
}