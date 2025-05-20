'use client';

import React, { useState, useEffect } from 'react';
import '@/styles/admin.css';

const AdminPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const [loadingVersions, setLoadingVersions] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedVersions, setSelectedVersions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setLoadingVersions(true);
      const response = await fetch('/api/list-versions');
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      } else {
        console.error('Error al obtener versiones');
      }
    } catch (err) {
      console.error('Error al llamar al endpoint de versiones', err);
    } finally {
      setLoadingVersions(false);
    }
  };

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
      fetchVersions();
    } else {
      alert('❌ Error al ejecutar el script');
    }
  };

  const toggleVersionSelection = (version: string) => {
    setSelectedVersions((prev) => {
      const updated = new Set(prev);
      if (updated.has(version)) {
        updated.delete(version);
      } else {
        updated.add(version);
      }
      return updated;
    });
  };

  const handleDelete = () => {
    if (
      selectedVersions.size === 0 ||
      !confirm(`¿Estás seguro de que deseas eliminar las versiones seleccionadas?\n${Array.from(selectedVersions).join(', ')}`)
    ) {
      return;
    }

    alert(`(Simulado) Eliminando: ${Array.from(selectedVersions).join(', ')}`);
    setEditMode(false);
    setSelectedVersions(new Set());
    fetchVersions();
  };

  const handleCancel = () => {
    setEditMode(false);
    setSelectedVersions(new Set());
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Página de administración</h1>

      <section className="upload-section">
        <h2 className="section-title">Carga de archivo</h2>
        <p> Sección para la carga de nuevos blisters, o actualziaciones de los existentes, en el radar tecnológico. Se espera un formato CSV.</p>
        <form onSubmit={handleSubmit} className="upload-form">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button type="submit" className="button primary">Cargar</button>
        </form>
      </section>

      <section className="version-section">
        <h2 className="section-title">Versiones cargadas</h2>
        <p> Listado de versiones disponibles. Permite el borrado de versiones.</p>
        {loadingVersions ? (
          <p>Cargando versiones...</p>
        ) : versions.length === 0 ? (
          <p>No existen versiones disponibles.</p>
        ) : (
          <>
            <div className="actions">
              {!editMode ? (
                <>
                  <button onClick={() => setEditMode(true)} className="button danger-outline">Modificar</button>
                  <button disabled className="button disabled">Eliminar</button>
                </>
              ) : (
                <>
                  <button onClick={handleCancel} className="button danger-outline">Cancelar</button>
                  <button
                    onClick={handleDelete}
                    disabled={selectedVersions.size === 0}
                    className="button danger-solid"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>

            <div className="version-list">
              {versions.map((version) => (
                <div key={version} className="version-item">
                  <div className="checkbox-container">
                    {editMode ? (
                      <input
                        type="checkbox"
                        checked={selectedVersions.has(version)}
                        onChange={() => toggleVersionSelection(version)}
                      />
                    ) : (
                      <span className="dash">–</span>
                    )}
                  </div>
                  <span className="version-label">{version}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
