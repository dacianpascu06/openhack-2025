import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Card, Text, Badge, Group, Stack } from '@mantine/core';

interface TicketCardProps {
  description: string;
}

export default function TicketPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<TicketCardProps>()
  const [error, setError] = useState<boolean>(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/v1/get_ticket?ticket_id=${id}`);
        const data = await res.json();
        console.log(data)
        if (data.success) {
          setTicket({
            description: data.description || '',
          });
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.log(err)
      }
    };
    fetchTicket();
  }, [id]);


  return <div>
    {error ? <h1>Error</h1> :
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm">
          <Text >Description: {ticket?.description}</Text>
        </Stack>
      </Card>
    }
  </div>
}


