async function fetchData(url: string | URL | Request, token: string) {
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error('Error details:', errorDetails);
    throw new Error('Network response was not ok: ' + errorDetails);
  }
  
  const data = await res.json();
  return data;
}

async function deleteData(url: string | URL | Request, token: string) {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error('Error details:', errorDetails);
    throw new Error('Network response was not ok: ' + errorDetails);
  }
}

async function postData(url: string | URL | Request, token: string, body: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  console.log('Token:', token);
  console.log('Request Body:', body);

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error('Error details:', errorDetails);
    throw new Error('Network response was not ok: ' + errorDetails);
  }

  const data = await res.json();
  return data;
}

async function putData(url: string | URL | Request, token: string, body: any) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error('Error details:', errorDetails);
    throw new Error('Network response was not ok: ' + errorDetails);
  }

  const data = await res.json();
  return data;
}

export { fetchData, deleteData, postData, putData };
