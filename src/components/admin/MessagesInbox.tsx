'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  cadastralCode: string | null;
  buildingFunction: string | null;
  area: number | null;
  createdAt: string | Date;
  read: boolean;
}

export function MessagesInbox({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Message | null>(null);

  const toggleRead = async (msg: Message) => {
    await fetch(`/api/admin/messages/${msg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !msg.read }),
    });
    router.refresh();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('დარწმუნებული ხართ?')) return;
    await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    router.refresh();
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ka-GE', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="flex gap-6">
      <div className="w-1/2 space-y-2">
        {initialMessages.map((msg) => (
          <div
            key={msg.id}
            onClick={() => { setSelected(msg); if (!msg.read) toggleRead(msg); }}
            className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-colors ${
              selected?.id === msg.id ? 'border-primary-400' : 'border-gray-100 hover:border-gray-200'
            } ${!msg.read ? 'border-l-4 border-l-primary-500' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm ${!msg.read ? 'font-bold' : 'font-medium'} text-secondary-900`}>
                  {msg.name}
                </p>
                <p className="text-xs text-secondary-500">{msg.email}</p>
              </div>
              <p className="text-xs text-secondary-400">{formatDate(msg.createdAt)}</p>
            </div>
            <p className="text-sm text-secondary-600 mt-2 line-clamp-2">{msg.message}</p>
          </div>
        ))}
        {initialMessages.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-secondary-400 border border-gray-100">
            შეტყობინებები არ არის
          </div>
        )}
      </div>

      <div className="w-1/2">
        {selected ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">{selected.name}</h3>
                <p className="text-sm text-secondary-500">{selected.email}</p>
                {selected.phone && <p className="text-sm text-secondary-500">{selected.phone}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleRead(selected)} className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">
                  {selected.read ? 'წაუკითხავი' : 'წაკითხული'}
                </button>
                <button onClick={() => deleteMessage(selected.id)} className="px-3 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50">
                  წაშლა
                </button>
              </div>
            </div>

            <p className="text-xs text-secondary-400 mb-4">{formatDate(selected.createdAt)}</p>

            <div className="prose prose-sm max-w-none text-secondary-700">
              <p>{selected.message}</p>
            </div>

            {(selected.cadastralCode || selected.buildingFunction || selected.area) && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <p className="text-xs font-medium text-secondary-500 uppercase">დამატებითი ინფორმაცია</p>
                {selected.cadastralCode && <p className="text-sm"><span className="text-secondary-500">საკადასტრო კოდი:</span> {selected.cadastralCode}</p>}
                {selected.buildingFunction && <p className="text-sm"><span className="text-secondary-500">ფუნქცია:</span> {selected.buildingFunction}</p>}
                {selected.area && <p className="text-sm"><span className="text-secondary-500">ფართი:</span> {selected.area} მ2</p>}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center text-secondary-400 border border-gray-100">
            აირჩიეთ შეტყობინება სანახავად
          </div>
        )}
      </div>
    </div>
  );
}
