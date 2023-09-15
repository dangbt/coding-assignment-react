import { Ticket } from '@acme/shared-models';
import { useTicketsStore, useUsersStore } from '../../stores';
import { Button, Group, Table, Text, Modal, Box, Select, Textarea, Radio, Badge, Tooltip } from '@mantine/core';
import { IconEdit, IconFile, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm, zodResolver } from '@mantine/form';
import * as z from "zod"
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';

interface FormValues {
  description: string
  assigneeId: string | null
  completed?: string
}

export function Tickets() {
  const [tickets, setTickets] = useTicketsStore(state => [state.tickets, state.setTickets])
  const users = useUsersStore(state => state.users)
  const [opened, { open, close }] = useDisclosure(false);
  const [updating, setUpdating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ticketSelected, setTicketSelected] = useState<Ticket | null>(null)
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    initialValues: {
      description: '',
      assigneeId: null
    },
    validate: zodResolver(z.object({
      description: z.string().min(1, { message: "Description is required" }),
    })),
  });

  const fetchTickets = () => {
    fetch('/api/tickets').then(async res => {
      const tickets = await res.json()
      setTickets(tickets)
    }).catch(err => {
      console.log(err)
    })
  }

  const handleSubmit = async (values: FormValues) => {
    setLoading(true)
    if (updating && ticketSelected) {
      try {
        const promise = []
        if (values.assigneeId) {
          promise.push(fetch(`/api/tickets/${ticketSelected.id}/assign/${values.assigneeId}`, {
            method: "PUT",
          }))
        }
        if (values.completed) {
          let method = 'PUT'
          if (values.completed === 'false') {
            method = "DELETE"
          }
          promise.push(fetch(`/api/tickets/${ticketSelected.id}/complete`, {
            method: method,
          }))
        }
        if (promise.length) {
          await Promise.all(promise)
        }
      } catch (error) {
        console.log(error)
      } finally {
        fetchTickets()
        close()
        setLoading(false)
        notifications.show({
          title: 'Update',
          message: 'Update the ticket successfully',
          color: "green"
        })
      }

    } else {
      const data = {
        description: values.description,
      }

      fetch('/api/tickets', {
        method: "POST",
        body: JSON.stringify(data)
      }).then(async res => {
        if (res) {
          fetchTickets()
          close()
          form.reset()
          notifications.show({
            title: 'Success',
            message: 'Create a new ticket successfully',
            color: "green"
          })
        }
      })
    }
  }
  const handleEdit = (ticket: Ticket) => {
    setUpdating(true)
    open()
    const formValue: FormValues = {
      description: ticket.description,
      assigneeId: ticket.assigneeId?.toString() || null,
      completed: ticket.completed.toString(),
    }
    form.setValues(formValue)
    setTicketSelected(ticket)
  }


  const rows = tickets.map((ticket) => {
    let user
    if (ticket.assigneeId) {
      user = users.find(u => u.id === ticket.assigneeId)
    }
    return (
      <tr key={ticket.id}>
        <td>{ticket.id}</td>
        <td>{ticket.description}</td>
        <td>{user ? user.name : ''}</td>
        <td><Group align='center' position='center'>
        {ticket.completed ? <Badge color='green'>Complete</Badge> : <Badge color="red">Uncomplete</Badge>}
          </Group></td>
        <td>
          <Group>
            <Tooltip label="Edit">
              <Button compact onClick={() => handleEdit(ticket)} variant='outline' size='xs'><IconEdit size={14} /></Button>
            </Tooltip>
            <Tooltip label="Detail">
              <Button compact onClick={() => navigate(`/tickets/${ticket.id}`)} variant='outline' size='xs'><IconFile size={14} /></Button>
            </Tooltip>
          </Group>
        </td>
      </tr>
    )
  });

  const userOtpions = useMemo(() => {
    return users.map((user) => ({
      value: user.id.toString(),
      label: user.name
    }))
  }, [users])

  return (
    <div>
      <Group position='apart'>
        <h2>Tickets</h2>
        <Button onClick={open} leftIcon={<IconPlus />}>Create</Button>
      </Group>
      <Table fontSize="sm" striped withBorder highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Assignee</th>
            <th style={{ textAlign: "center" }}>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={5}><Text align='center' color='gray' >No Data</Text></td></tr>}
          {rows}
        </tbody>
      </Table>
      <Modal opened={opened} onClose={close} title="Create ticket" centered>
        <Box maw={300} mx="auto">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Textarea
              withAsterisk
              label="Description"
              placeholder="Enter description"
              {...form.getInputProps('description')}
            />
            {
              updating &&
              <>
                <Select
                  label="Assignee"
                  placeholder="Select user"
                  data={userOtpions}
                  {...form.getInputProps('assigneeId')}
                />
                <Radio.Group
                  name="Status"
                  withAsterisk
                  {...form.getInputProps('completed')}
                >
                  <Group mt="xs">
                    <Radio value="true" label="Complete" />
                    <Radio value="false" label="Uncomplete" />
                  </Group>
                </Radio.Group>
              </>
            }
            <Group position="right" mt="md">
              <Button loading={loading} type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default Tickets;
