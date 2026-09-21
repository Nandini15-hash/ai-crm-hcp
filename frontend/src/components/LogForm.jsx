import { useState } from "react";
import { useDispatch } from "react-redux";
import { createInteraction } from "../redux/interactionSlice";

function LogForm() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    hcp_name: "",
    interaction_type: "Meeting",
    topics: "",
    notes: "",
    follow_up: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveInteraction = async () => {
    try {
      await dispatch(createInteraction(formData)).unwrap();
      alert("Interaction saved successfully.");

      setFormData({
        hcp_name: "",
        interaction_type: "Meeting",
        topics: "",
        notes: "",
        follow_up: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error saving interaction");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h2>Log HCP Interaction</h2>

      <input
        type="text"
        name="hcp_name"
        placeholder="HCP Name"
        value={formData.hcp_name}
        onChange={handleChange}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <select
        name="interaction_type"
        value={formData.interaction_type}
        onChange={handleChange}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        <option>Meeting</option>
        <option>Call</option>
        <option>Email</option>
      </select>

      <textarea
        name="topics"
        placeholder="Topics Discussed"
        value={formData.topics}
        onChange={handleChange}
        rows="4"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        rows="4"
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="date"
        name="follow_up"
        value={formData.follow_up}
        onChange={handleChange}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={saveInteraction}
        style={{
          background: "#2563eb",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save Interaction
      </button>
    </div>
  );
}

export default LogForm;
