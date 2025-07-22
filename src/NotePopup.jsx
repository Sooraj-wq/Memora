import React, { useState } from "react";

const colors = ["#c52233", "#588157", "#277da1", "#f77f00", "#6d23b6", "#495057"];

export default function NotePopup({ onCreate, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleCreate = () => {
    onCreate({ title, content, color: selectedColor });
    setTitle("");
    setContent("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg w-[90%] max-w-md border-2 border-pink-600">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-white font-family-cabin">Create Note</h2>

        {/* Title Field */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 font-family-cabin px-4 py-2 text-sm border text-white border-white placeholder-white rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
        />

        {/* Content Field */}
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mb-4 font-family-cabin px-4 py-2 text-sm border border-white text-white placeholder-white rounded-md resize-none h-24 focus:outline-none focus:ring focus:ring-indigo-300"
        ></textarea>

        {/* Color Options */}
        <div className="flex items-center flex-wrap gap-3 mb-5">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border-2 ${
                selectedColor === color ? "border-pink-600" : "border-white"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-2 text-sm bg-gray-300 rounded font-family-cabin hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-3 py-2 text-sm bg-pink-600 font-family-cabin text-white rounded hover:bg-pink-700 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
