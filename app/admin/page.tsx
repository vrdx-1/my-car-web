'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('cars').insert([{ brand, model, price: Number(price), image_url: imageUrl }]);
    if (error) alert('เกิดข้อผิดพลาด: ' + error.message);
    else {
      alert('เพิ่มข้อมูลรถสำเร็จ!');
      setBrand(''); setModel(''); setPrice(''); setImageUrl('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>➕ ลงประกาศรถคันใหม่</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder="ยี่ห้อรถ" value={brand} onChange={(e) => setBrand(e.target.value)} required style={{ padding: '10px' }} />
        <input placeholder="รุ่นรถ" value={model} onChange={(e) => setModel(e.target.value)} required style={{ padding: '10px' }} />
        <input placeholder="ราคา" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '10px' }} />
        <input placeholder="ลิงก์รูปภาพ" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>บันทึกข้อมูล</button>
      </form>
    </div>
  );
}
