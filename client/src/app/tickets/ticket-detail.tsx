import { Badge } from "@mantine/core";
import { useTicketsStore, useUsersStore } from "client/src/stores";
import { useMemo } from "react";
import { useParams } from "react-router-dom"

export default function TicketDetail() {
  const params = useParams();
  const tickets = useTicketsStore(state => state.tickets)
  const users = useUsersStore(state => state.users)

  const ticket = useMemo(() => {
    const ticket = tickets.find(t => t.id.toString() === params['id'])
    return ticket
  }, [tickets])

  return (
    <div>
      <h2>Ticket #{params['id']} </h2>
      {
        ticket && <div>
          {ticket.description} - {ticket.assigneeId} - <Badge color={ticket.completed ? "green" : "red"}>{ticket.completed ? 'Complete' : "Uncomplete"}</Badge>
        </div>
      }
    </div>
  )
}