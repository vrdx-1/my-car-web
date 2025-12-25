'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      const { data, error } = await supabase.from('cars').select('*');
      if (!error) setCars(data || []);
      setLoading(false);
    }
    fetchCars();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>กำลังโหลดข้อมูล...</div>;

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>🚗 โชว์รูมรถมือสองคุณภาพ</h1>
      <hr />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {cars.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>ยังไม่มีข้อมูลรถในขณะนี้</p>
        ) : (
          cars.map((car) => (
            <div key={car.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
              <img src={car.image_url || 'https://via.placeholder.com/300x200'} alt={car.brand} style={{ width: '100%', borderRadius: '5px' }} />
              <h3>{car.brand} {car.model}</h3>
              <p style={{ color: 'green', fontWeight: 'bold' }}>ราคา: {Number(car.price).toLocaleString()} บาท</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}