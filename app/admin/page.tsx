'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  // ใช้ <any[]> เพื่อป้องกัน Error เวลา Deploy บน Vercel
  const [cars, setCars] = useState<any[]>([])
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Sedan')

  // ฟังก์ชันดึงข้อมูลจาก Supabase
  const fetchCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) setCars(data || [])
  }

  useEffect(() => {
    fetchCars()
  }, [])

  // ฟังก์ชันเพิ่มข้อมูลรถ
  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('cars').insert([
      { brand, model, price: parseInt(price), category }
    ])

    if (!error) {
      alert('เพิ่มรถเรียบร้อยแล้ว!')
      setBrand('')
      setModel('')
      setPrice('')
      fetchCars()
    } else {
      alert('เกิดข้อผิดพลาด: ' + error.message)
    }
  }

  // ฟังก์ชันลบข้อมูลรถ
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('cars').delete().eq('id', id)
    if (!error) fetchCars()
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">ระบบจัดการหลังบ้าน (เจ้าของร้าน)</h1>
      
      {/* ฟอร์มเพิ่มข้อมูล */}
      <form onSubmit={handleAddCar} className="bg-white p-6 rounded-xl border shadow-sm mb-10">
        <h2 className="text-blue-600 font-semibold mb-4 text-lg">ลงประกาศขายรถใหม่</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">ยี่ห้อรถ</label>
            <input 
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="เช่น Toyota" 
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">รุ่น</label>
            <input 
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="เช่น Camry" 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">ราคา (บาท)</label>
            <input 
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              type="number" 
              placeholder="เช่น 550000" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">ประเภทรถ</label>
            <select 
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Sedan">Sedan (รถเก๋ง)</option>
              <option value="SUV">SUV (รถอเนกประสงค์)</option>
              <option value="Pickup">Pickup (รถกระบะ)</option>
              <option value="Van">Van (รถตู้)</option>
            </select>
          </div>
        </div>
        <button type="submit" className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md">
          บันทึกและขึ้นหน้าเว็บ
        </button>
      </form>

      {/* ตารางแสดงรายการรถ */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-bold text-gray-700">รายการรถทั้งหมดในระบบ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-medium">ข้อมูลรถ</th>
                <th className="p-4 font-medium">ประเภท</th>
                <th className="p-4 font-medium text-right">ราคา</th>
                <th className="p-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{car.brand} {car.model}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">{car.category}</span>
                  </td>
                  <td className="p-4 text-right font-bold text-blue-600">฿{car.price?.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(car.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm p-2"
                    >
                      ลบออก
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cars.length === 0 && (
            <div className="p-8 text-center text-gray-400">ยังไม่มีข้อมูลรถในระบบ</div>
          )}
        </div>
      </div>
    </div>
  )
}