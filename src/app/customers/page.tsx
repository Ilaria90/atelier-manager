import React from 'react';
import { mockCustomers } from '@/types/mockData';

export default function CustomersPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>
        Gestione Clienti - Atelier
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Elenco dei clienti registrati nell'atelier (dati locali di prova).
      </p>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Nome e Cognome</th>
              <th style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Telefono</th>
              <th style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Email</th>
              <th style={{ padding: '12px 16px', fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map((customer) => (
              <tr key={customer.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#111827', fontWeight: 500 }}>
                  {customer.firstName} {customer.lastName}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#4b5563' }}>
                  {customer.phone}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#4b5563' }}>
                  {customer.email || '-'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                  {customer.notes || 'Nessuna nota'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}