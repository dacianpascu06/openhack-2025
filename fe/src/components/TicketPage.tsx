import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Card, Text, Stack, Center } from '@mantine/core';

interface TicketCardProps {
  city_hall: string;
  status: string;
  city: string;
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
            city_hall: data.city_hall || '',
            city: data.city || '',
            status: data.status || '',
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
      <Center>
        <Card shadow="sm" w="400px" mt="300px" padding="lg" radius="md" withBorder>
          <Stack gap="sm" align='center'>
            <Text >City: {ticket?.city}</Text>
            <Text >Primarie: {ticket?.city_hall}</Text>
            <Text >Status: {ticket?.status}</Text>
          </Stack>
        </Card>
      </Center>
    }
  </div>
}


