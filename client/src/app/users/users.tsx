import { useUsersStore } from '../../stores';
import { Table, Text } from '@mantine/core';


export function Tickets() {
  const [users] = useUsersStore(state => [state.users, state.setUsers])

  const rows = users.map((user) => {
    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name}</td>
      </tr>
    )
  });

  
  return (
    <div>
      <h2>Users</h2>
      <Table fontSize="sm" striped withBorder highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={2}><Text align='center' color='gray' >No Data</Text></td></tr>}
          {rows}
        </tbody>
      </Table>
    </div>
  );
}

export default Tickets;
