"use client";

import { useState } from "react";
import { Institute } from "@/lib/data";

type Props = {
  initialData?: Institute;
  onSubmit: (data: Institute) => void;
};

export default function InstituteForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<Institute>(
    initialData || {
      id: "",
      name: "",
      type: "School",
      location: "",
      status: "Pending",
      contact: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, id: form.id || Date.now().toString() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Edit Institute" : "Add New Institute"}
      </h2>

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="School">School</option>
          <option value="College">College</option>
          <option value="Coaching">Coaching</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Contact Email</label>
        <input
          type="email"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {initialData ? "Update" : "Add"}
      </button>
    </form>
  );
}
