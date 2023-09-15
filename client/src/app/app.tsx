import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Tickets from './tickets/tickets';
import TicketDetail from './tickets/ticket-detail';
import Users from './users/users';
import Layout from '../components/common/layout/layout';
import { useTicketsStore, useUsersStore } from '../stores';

const App = () => {
  const setUsers = useUsersStore((state) => state.setUsers)
  const setTickets = useTicketsStore((state) => state.setTickets)
  const fetchData = async () => {
    try {
      const promise = []
      promise.push(fetch('/api/tickets'))
      promise.push(fetch('/api/users'))
      const res=  await Promise.all(promise)
      if (res[0]) {
        const tickets = await res[0].json()
        setTickets(tickets)
      }
      if (res[1]) {
        const users = await res[1].json()
        setUsers(users)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
      <Layout>
        <Routes>
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/users" element={<Users  />} />
        </Routes>
      </Layout>
  );
};

export default App;
