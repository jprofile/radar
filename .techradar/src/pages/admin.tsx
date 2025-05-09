'use client';

import React, { useState } from 'react';

const AdminPage = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('✅ Script ejecutado correctamente');
    } else {
      alert('❌ Error al ejecutar el script');
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Ejecutar generateMd</button>
      </form>
    </div>
  );
};

export default AdminPage;
