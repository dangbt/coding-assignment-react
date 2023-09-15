import { Ticket, User } from '@acme/shared-models';
import { create } from "zustand"

interface UsersStore {
  users: User[],
  setUsers: (users: User[]) => void
}

interface TicketsStore {
  tickets: Ticket[],
  setTickets: (tickets: Ticket[]) => void
}


export const useUsersStore = create<UsersStore>((set) => ({
  users: [],
  setUsers: (users: User[]) =>
    set(() => ({ users })),
}))

export const useTicketsStore = create<TicketsStore>((set) => ({
  tickets: [],
  setTickets: (tickets: Ticket[]) =>
    set(() => ({ tickets })),
}))
